#!/usr/bin/env node
// Engine-agnostic, zero-dependency inspection of an exported .pptx (and
// optionally its companion .pdf). It checks what every engine must get right:
//   - slide count, 16:9 geometry, and slide/speaker-note parity
//   - explicit font sizes against the projector floor (relative to slide height)
//   - pictures without alt text
//   - text density per slide and image-only (non-editable) slides
//   - PDF page count matching the slide count
// Usage: pptx-check.mjs <deck.pptx> [--pdf=<deck.pdf>] [--no-notes] [--json]
// Exit code 1 when any error is found; warnings never fail the run.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync, inflateSync } from 'node:zlib';

// Floors as a fraction of slide height. 28px on a 1080px canvas = 2.6%;
// 22px = 2.0%. See references/typography.md.
export const BODY_FLOOR = 0.026;
export const HARD_FLOOR = 0.02;
// typography.md rounds each floor to a whole or half point/pixel (14 pt on a
// 540 pt slide, 8 pt on a 405 pt slide), so text at a documented floor can sit
// a hair under the exact ratio. Allow half a pixel at 1080 px.
export const FLOOR_TOLERANCE = 0.0005;
export const DENSITY_WORDS = 70;
// Text a builder leaves behind when content is still missing.
export const PLACEHOLDER = /\b(?:TODO|TBD|TBC|FIXME|lorem ipsum|placeholder)\b|\bX{3,}\b|待補|待定|佔位|占位|\[(?:insert|add|logo|image)[^\]]*\]/i;
export const DENSITY_CJK = 160;
// Per text box: one card's worth of copy.
export const BOX_WORDS = 45;
export const BOX_CJK = 70;

export function readZip(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('Not a zip archive (no end-of-central-directory record)');
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();
  for (let n = 0; n < count; n += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error('Corrupt zip central directory');
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);
    entries.set(name, { method, compressedSize, localOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return {
    names: [...entries.keys()],
    has: (name) => entries.has(name),
    read(name) {
      const entry = entries.get(name);
      if (!entry) return null;
      const local = entry.localOffset;
      if (buffer.readUInt32LE(local) !== 0x04034b50) throw new Error(`Corrupt zip entry ${name}`);
      const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
      const data = buffer.subarray(start, start + entry.compressedSize);
      if (entry.method === 0) return data.toString('utf8');
      if (entry.method === 8) return inflateRawSync(data).toString('utf8');
      throw new Error(`Unsupported zip compression method ${entry.method} for ${name}`);
    },
  };
}

function decodeXml(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');
}

function texts(xml) {
  return [...xml.matchAll(/<a:t(?:\s[^>]*)?>([^<]*)<\/a:t>/g)].map((match) => decodeXml(match[1]));
}

function relsFor(zip, part) {
  const relsPath = path.posix.join(
    path.posix.dirname(part),
    '_rels',
    `${path.posix.basename(part)}.rels`,
  );
  const xml = zip.read(relsPath) ?? '';
  const rels = new Map();
  for (const match of xml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const attrs = match[1];
    const id = attrs.match(/\bId="([^"]+)"/)?.[1];
    const type = attrs.match(/\bType="([^"]+)"/)?.[1] ?? '';
    const target = attrs.match(/\bTarget="([^"]+)"/)?.[1];
    if (!id || !target) continue;
    const resolved = target.startsWith('/')
      ? target.slice(1)
      : path.posix.normalize(path.posix.join(path.posix.dirname(part), target));
    rels.set(id, { type, target: resolved });
  }
  return rels;
}

export function countWords(text) {
  const cjk = (text.match(/[぀-ヿ㐀-鿿豈-﫿가-힯]/g) ?? []).length;
  const latin = (
    text.replace(/[぀-ヿ㐀-鿿豈-﫿가-힯]/g, ' ').match(/[\p{L}\p{N}]+/gu) ??
    []
  ).length;
  return { cjk, latin };
}

const PAGE_OBJECT = /\/Type\s*\/Page(?![s\w])/g;
const DICT = /<<((?:(?!<<|>>)[\s\S])*?)>>/g;

function pdfBodies(buffer) {
  const raw = buffer.toString('latin1');
  const bodies = [raw];
  // Objects can sit inside compressed object streams (PDF 1.5+).
  for (const match of raw.matchAll(/\/Type\s*\/ObjStm\b[^]*?stream\r?\n/g)) {
    const start = match.index + match[0].length;
    const end = raw.indexOf('endstream', start);
    if (end < 0) continue;
    try {
      bodies.push(inflateSync(buffer.subarray(start, end)).toString('latin1'));
    } catch {
      // Not a Flate stream; skip it.
    }
  }
  return bodies;
}

export function countPdfPages(buffer) {
  const bodies = pdfBodies(buffer);
  // Prefer the page tree's /Count: the root /Pages node holds the largest one.
  // Counting /Type /Page objects overcounts files with incremental updates or
  // orphaned pages, so it is only the fallback.
  const counts = [];
  for (const body of bodies) {
    for (const dict of body.matchAll(DICT)) {
      if (!/\/Type\s*\/Pages\b/.test(dict[1])) continue;
      const count = dict[1].match(/\/Count\s+(\d+)/);
      if (count) counts.push(Number(count[1]));
    }
  }
  if (counts.length) return Math.max(...counts);
  const pages = bodies.reduce((sum, body) => sum + (body.match(PAGE_OBJECT)?.length ?? 0), 0);
  return pages > 0 ? pages : null;
}

const EMU_PER_PT = 12700;
const CJK_CHAR = /[぀-ヿ㐀-鿿豈-﫿가-힯＀-￯]/;

/**
 * Estimates whether a text box's text needs more height than the box has.
 * The estimate uses average glyph widths (Latin ≈ 0.55 em, bold ≈ 0.6 em,
 * CJK ≈ 1 em) and 1.2 line height, so it reports "may overflow" warnings,
 * never errors. Boxes set to shrink text on overflow are reported too,
 * because shrinking can push text under the type floor.
 */
/** Approximate advance width of one character, in ems. */
export function charWidth(ch, bold = false) {
  let em;
  if (CJK_CHAR.test(ch) || /[\u3000-\u303f\uff01-\uff5e]/.test(ch)) em = 1; // CJK and full-width punctuation
  else if (ch === ' ') em = 0.28;
  else if (ch === '·' || ch === '•') em = 0.5; // CJK fonts draw the middle dot wide
  else if (/[.,:;'"|!/()\[\]-]/.test(ch)) em = 0.3;
  else if (/[0-9]/.test(ch)) em = 0.56;
  else if (/[A-Z]/.test(ch)) em = 0.66;
  else em = 0.52;
  return bold ? em * 1.05 : em;
}

/** A shape's box in EMU, from its <a:xfrm>. */
export function shapeRect(shapeXml) {
  const off = shapeXml.match(/<a:xfrm\b[^>]*>\s*<a:off\b[^>]*\bx="(-?\d+)"[^>]*\by="(-?\d+)"[^>]*\/>\s*<a:ext\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/);
  return off ? { x: +off[1], y: +off[2], w: +off[3], h: +off[4] } : null;
}

/** True when the shape draws a fill or an outline (not just text). */
export function hasVisibleBox(shapeXml) {
  const spPr = shapeXml.match(/<p:spPr\b[\s\S]*?<\/p:spPr>/)?.[0] ?? '';
  const withoutLine = spPr.replace(/<a:ln\b[\s\S]*?<\/a:ln>/g, '');
  const filled = /<a:solidFill>|<a:gradFill>|<a:blipFill>/.test(withoutLine);
  const outlined = /<a:ln\b/.test(spPr) && !/<a:ln\b[^>]*>\s*<a:noFill\s*\/>/.test(spPr);
  return filled || outlined;
}

export function estimateOverflow(shapeXml, containers = []) {
  const off = shapeXml.match(/<a:xfrm\b[^>]*>[\s\S]*?<a:ext\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/);
  if (!off) return null;
  const body = shapeXml.match(/<a:bodyPr\b([^>]*)\/?>/)?.[1] ?? '';
  // Shrink-on-overflow that PowerPoint actually applied carries a fontScale
  // below 100%; the bare setting alone is common and harmless.
  const scale = shapeXml.match(/<a:normAutofit\b[^>]*\bfontScale="(\d+)"/);
  if (scale && Number(scale[1]) < 100000) return { autofit: true, scale: Number(scale[1]) / 1000 };
  if (/<a:normAutofit\b/.test(shapeXml)) return null;
  if (/<a:spAutoFit\b/.test(shapeXml)) return null; // box grows with its text
  const inset = (name, fallback) => Number(body.match(new RegExp(`\\b${name}="(\\d+)"`))?.[1] ?? fallback);
  const widthPt = (Number(off[1]) - inset('lIns', 91440) - inset('rIns', 91440)) / EMU_PER_PT;
  const heightPt = (Number(off[2]) - inset('tIns', 45720) - inset('bIns', 45720)) / EMU_PER_PT;
  if (widthPt <= 0 || heightPt <= 0) return null;
  const noWrap = /\bwrap="none"/.test(body);
  // Sideways overflow only shows against a visible box: the shape's own fill or
  // outline, or the smallest filled shape it sits on (a label over a pill).
  // Slide-sized backgrounds are excluded by the caller.
  const rect = shapeRect(shapeXml);
  const EMU_SLACK = 91440; // 0.1 in
  const own = hasVisibleBox(shapeXml) ? rect : null;
  const holder =
    own ??
    (rect &&
      containers
        .filter(
          (c) =>
            c.x <= rect.x + EMU_SLACK &&
            c.y <= rect.y + EMU_SLACK &&
            c.x + c.w >= rect.x + rect.w - EMU_SLACK &&
            c.y + c.h >= rect.y + rect.h - EMU_SLACK,
        )
        .sort((a, b) => a.w * a.h - b.w * b.h)[0]);
  let needed = 0;
  let sample = '';
  for (const para of shapeXml.matchAll(/<a:p>([\s\S]*?)<\/a:p>|<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g)) {
    const inner = para[1] ?? para[2] ?? '';
    const runs = [...inner.matchAll(/<a:r>([\s\S]*?)<\/a:r>/g)].map((run) => {
      const size = Number(run[1].match(/\bsz="(\d+)"/)?.[1] ?? 1800) / 100;
      const bold = /<a:rPr\b[^>]*\bb="1"/.test(run[1]);
      const value = decodeXml(run[1].match(/<a:t(?:\s[^>]*)?>([^<]*)<\/a:t>/)?.[1] ?? '');
      return { size, bold, value };
    });
    const textValue = runs.map((run) => run.value).join('');
    if (!textValue.trim()) continue;
    if (!sample) sample = textValue.trim().slice(0, 40);
    const size = Math.max(...runs.map((run) => run.size));
    const width = runs.reduce(
      (sum, run) =>
        sum +
        [...run.value].reduce((w, ch) => w + run.size * charWidth(ch, run.bold), 0),
      0,
    );
    const bullet = /<a:buChar\b|<a:buAutoNum\b/.test(inner) ? size * 1.5 : 0;
    // wrap="none": the line does not wrap, so it overflows sideways and is clipped.
    if (noWrap && holder && rect) {
      // Where the line actually lands, from the paragraph alignment.
      const align = inner.match(/<a:pPr\b[^>]*\balgn="(\w+)"/)?.[1] ?? 'l';
      const left = (rect.x + inset('lIns', 91440)) / EMU_PER_PT;
      const start = align === 'ctr' ? left + (widthPt - width) / 2 : align === 'r' ? left + widthPt - width : left;
      const minX = holder.x / EMU_PER_PT;
      const maxX = (holder.x + holder.w) / EMU_PER_PT;
      const over = Math.max(0, minX - start) + Math.max(0, start + width - maxX);
      // 3% of the line is within the font-width estimate's error.
      if (over > width * 0.03 + 2) {
        return { sample: textValue.trim().slice(0, 40), sideways: true, neededIn: width / 72, overIn: over / 72 };
      }
    }
    const lines = noWrap ? 1 : Math.max(1, Math.ceil(width / Math.max(1, widthPt - bullet)));
    const spacing = Number(inner.match(/<a:spcAft>\s*<a:spcPts val="(\d+)"/)?.[1] ?? 0) / 100;
    needed += lines * size * 1.2 + spacing;
  }
  if (!sample) return null;
  return needed > heightPt * 1.15 + 2
    ? { sample, neededIn: needed / 72, haveIn: heightPt / 72 }
    : null;
}

/** Returns the visible text and the speaker-note text of every slide, in order. */
export function slideTexts(buffer) {
  const zip = readZip(buffer);
  const presentation = zip.read('ppt/presentation.xml') ?? '';
  const presRels = relsFor(zip, 'ppt/presentation.xml');
  return [...presentation.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)]
    .map((match) => presRels.get(match[1])?.target)
    .filter(Boolean)
    .map((part) => {
      const rels = relsFor(zip, part);
      const notesPart = [...rels.values()].find((rel) => rel.type.endsWith('/notesSlide'))?.target;
      return {
        text: texts(zip.read(part) ?? '').join(' '),
        notes: notesPart ? texts(zip.read(notesPart) ?? '').join(' ') : '',
      };
    });
}

export function inspectPptx(buffer, options = {}) {
  const requireNotes = options.requireNotes ?? true;
  const zip = readZip(buffer);
  const presentation = zip.read('ppt/presentation.xml');
  if (!presentation) throw new Error('Not a PowerPoint file (ppt/presentation.xml missing)');

  const size = presentation.match(/<p:sldSz\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/);
  const cx = size ? Number(size[1]) : null;
  const cy = size ? Number(size[2]) : null;
  const heightPt = cy ? cy / 12700 : null;

  const presRels = relsFor(zip, 'ppt/presentation.xml');
  const slideParts = [...presentation.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)]
    .map((match) => presRels.get(match[1])?.target)
    .filter(Boolean);

  const errors = [];
  const warnings = [];
  const slides = [];

  if (slideParts.length === 0) errors.push('The deck has no slides');
  if (cx && cy && Math.abs(cx / cy - 16 / 9) > 0.01) {
    warnings.push(`Slide size is ${(cx / cy).toFixed(3)}:1, not 16:9`);
  }

  slideParts.forEach((part, index) => {
    const number = index + 1;
    const xml = zip.read(part) ?? '';
    const slideTexts = texts(xml);
    const allText = slideTexts.join(' ').trim();
    const words = countWords(allText);
    // Slide numbers, dates, and footers are utility text, not content: skip
    // text fields and footer placeholders when checking the type floors.
    const contentXml = xml
      .replace(/<a:fld\b[\s\S]*?<\/a:fld>/g, '')
      .replace(/<p:sp\b(?:(?!<\/p:sp>)[\s\S])*?<p:ph\b[^>]*type="(?:sldNum|dt|ftr|hdr)"[\s\S]*?<\/p:sp>/g, '');
    const sizes = [...contentXml.matchAll(/<a:rPr\b[^>]*\bsz="(\d+)"[^>]*\/?>(?:(?!<\/a:r>)[\s\S])*?<a:t(?:\s[^>]*)?>([^<]*)<\/a:t>/g)]
      .filter((match) => match[2].trim() !== '')
      .map((match) => Number(match[1]) / 100);
    const minPt = sizes.length ? Math.min(...sizes) : null;
    // Short lines in the header or footer band (section labels, page numbers,
    // source lines) are captions: they answer to the hard floor only.
    const bodySizes = [];
    for (const shapeXml of contentXml.match(/<p:sp\b[\s\S]*?<\/p:sp>/g) ?? []) {
      const r = shapeRect(shapeXml);
      const shapeText = texts(shapeXml).join('').trim();
      const band = r && cy && (r.y >= cy * 0.78 || r.y + r.h <= cy * 0.14);
      if (band && shapeText.length <= 80) continue;
      for (const m of shapeXml.matchAll(/<a:rPr\b[^>]*\bsz="(\d+)"[^>]*\/?>(?:(?!<\/a:r>)[\s\S])*?<a:t(?:\s[^>]*)?>([^<]*)<\/a:t>/g)) {
        if (m[2].trim()) bodySizes.push(Number(m[1]) / 100);
      }
    }
    const minBodyPt = bodySizes.length ? Math.min(...bodySizes) : null;
    const pictures = [...xml.matchAll(/<p:pic\b[\s\S]*?<\/p:pic>/g)];
    const missingAlt = pictures.filter((pic) => {
      const descr = pic[0].match(/<p:cNvPr\b[^>]*\bdescr="([^"]*)"/)?.[1];
      return !descr || !descr.trim();
    }).length;

    const rels = relsFor(zip, part);
    const notesPart = [...rels.values()].find((rel) => rel.type.endsWith('/notesSlide'))?.target;
    let notes = '';
    if (notesPart) {
      const notesXml = zip.read(notesPart) ?? '';
      const body = [...notesXml.matchAll(/<p:sp\b[\s\S]*?<\/p:sp>/g)]
        .map((shape) => shape[0])
        .filter((shape) => !/<p:ph\b[^>]*type="(?:sldImg|sldNum|hdr|ftr|dt)"/.test(shape));
      notes = body.flatMap(texts).join(' ').trim();
    }

    const slide = {
      number,
      words: words.latin,
      cjk: words.cjk,
      minFontPt: minPt,
      pictures: pictures.length,
      missingAlt,
      hasNotes: notes.length > 0,
      imageOnly: allText === '' && (pictures.length > 0 || /<p:bg>[\s\S]*?<a:blip\b/.test(xml)),
    };
    slides.push(slide);

    if (requireNotes && !slide.hasNotes) errors.push(`Slide ${number}: no speaker notes`);
    if (minPt !== null && heightPt) {
      const ratio = minPt / heightPt;
      if (ratio < HARD_FLOOR - FLOOR_TOLERANCE) {
        errors.push(
          `Slide ${number}: ${minPt}pt text is ${(ratio * 100).toFixed(1)}% of slide height (hard floor ${HARD_FLOOR * 100}%)`,
        );
      } else if (minBodyPt !== null && minBodyPt / heightPt < BODY_FLOOR - FLOOR_TOLERANCE) {
        const bodyRatio = minBodyPt / heightPt;
        warnings.push(
          `Slide ${number}: ${minBodyPt}pt text is ${(bodyRatio * 100).toFixed(1)}% of slide height; keep it to captions or labels (body floor ${BODY_FLOOR * 100}%)`,
        );
      }
    }
    if (missingAlt > 0) warnings.push(`Slide ${number}: ${missingAlt} picture(s) without alt text`);
    const placeholder = allText.match(PLACEHOLDER);
    if (placeholder) errors.push(`Slide ${number}: placeholder text "${placeholder[0]}" is still on the slide`);
    const shapes = [...contentXml.matchAll(/<p:sp\b[\s\S]*?<\/p:sp>/g)].map((m) => m[0]);
    const containers = shapes
      .filter(hasVisibleBox)
      .map(shapeRect)
      .filter((c) => c && cx && cy && !(c.w >= cx * 0.9 && c.h >= cy * 0.9)); // not the slide background
    for (const shapeXml of shapes) {
      const overflow = estimateOverflow(shapeXml, containers);
      if (!overflow) continue;
      slide.overflow = (slide.overflow ?? 0) + 1;
      warnings.push(
        overflow.autofit
          ? `Slide ${number}: a text box is shrunk to ${overflow.scale}% to fit; check it stays above the type floor, or split the slide`
          : overflow.sideways
            ? `Slide ${number}: "${overflow.sample}" runs ${overflow.overIn.toFixed(2)} in past the edge of the shape behind it and will look cut off`
            : `Slide ${number}: "${overflow.sample}" may overflow its box (needs ~${overflow.neededIn.toFixed(2)} in, has ${overflow.haveIn.toFixed(2)} in)`,
      );
    }
    // A text wall is one box carrying a paragraph, or a slide carrying far too much.
    const densestBox = shapes
      .map((shapeXml) => ({ text: texts(shapeXml).join(' ').trim() }))
      .map((box) => ({ ...box, count: countWords(box.text) }))
      .sort((a, b) => b.count.latin + b.count.cjk / 1.6 - (a.count.latin + a.count.cjk / 1.6))[0];
    if (words.latin > DENSITY_WORDS || words.cjk > DENSITY_CJK) {
      warnings.push(
        `Slide ${number}: dense text (${words.latin} words, ${words.cjk} CJK characters); split the slide or move detail to notes`,
      );
    } else if (densestBox && (densestBox.count.latin > BOX_WORDS || densestBox.count.cjk > BOX_CJK)) {
      warnings.push(
        `Slide ${number}: one text box carries a paragraph ("${densestBox.text.slice(0, 30)}…"); keep one idea per box or move detail to notes`,
      );
    }
  });

  const imageOnly = slides.filter((slide) => slide.imageOnly).length;
  if (imageOnly > 0) {
    warnings.push(
      `${imageOnly} of ${slides.length} slide(s) are image-only: text is not editable in PowerPoint and not readable by screen readers`,
    );
  }

  let pdfPages;
  if (options.pdf) {
    pdfPages = countPdfPages(options.pdf);
    if (pdfPages === null) warnings.push('Could not determine the PDF page count; check it by hand');
    else if (pdfPages !== slides.length) {
      errors.push(`PDF has ${pdfPages} page(s) but the PPTX has ${slides.length} slide(s)`);
    }
  }

  return {
    slideCount: slides.length,
    notesCount: slides.filter((slide) => slide.hasNotes).length,
    pdfPages: pdfPages ?? null,
    slideSize: cx && cy ? { widthIn: cx / 914400, heightIn: cy / 914400 } : null,
    slides,
    errors,
    warnings,
  };
}

export function formatReport(report, label = 'pptx-check') {
  const lines = [
    `${label}: ${report.slideCount} slides, ${report.notesCount} with notes` +
      (report.pdfPages !== null ? `, PDF ${report.pdfPages} pages` : ''),
    ...report.errors.map((error) => `error    ${error}`),
    ...report.warnings.map((warning) => `warning  ${warning}`),
  ];
  if (report.errors.length === 0) lines.push('pptx-check: no errors');
  return `${lines.join('\n')}\n`;
}

function main(argv) {
  const files = argv.filter((arg) => !arg.startsWith('--'));
  const pdfFlag = argv.find((arg) => arg.startsWith('--pdf='));
  const unknown = argv.filter(
    (arg) => arg.startsWith('--') && !['--json', '--no-notes'].includes(arg) && arg !== pdfFlag,
  );
  if (files.length !== 1 || unknown.length > 0) {
    process.stderr.write('Usage: pptx-check.mjs <deck.pptx> [--pdf=<deck.pdf>] [--no-notes] [--json]\n');
    process.exit(1);
  }
  const report = inspectPptx(readFileSync(files[0]), {
    requireNotes: !argv.includes('--no-notes'),
    pdf: pdfFlag ? readFileSync(pdfFlag.slice('--pdf='.length)) : undefined,
  });

  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(formatReport(report, files[0]));
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`pptx-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
