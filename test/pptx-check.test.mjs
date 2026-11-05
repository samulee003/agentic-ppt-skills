import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { countPdfPages, countWords, inspectPptx } from '../skills/make-presentation/scripts/pptx-check.mjs';

const execFileAsync = promisify(execFile);
const repo = path.resolve(new URL('..', import.meta.url).pathname);
const script = path.join(repo, 'skills/make-presentation/scripts/pptx-check.mjs');
const example = (engine, ext) =>
  path.join(repo, `examples/agentic-coding-anatomy-${engine}/exports/agentic-coding-anatomy.${ext}`);

// Minimal stored (uncompressed) zip writer for synthetic decks.
function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content);
    const nameBuf = Buffer.from(name);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBuf, data);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralBuf, end]);
}

const NS = 'xmlns:a="a" xmlns:p="p" xmlns:r="r"';
function slideXml(runs, pic = '') {
  const body = runs
    .map(([sz, text]) => `<a:r><a:rPr lang="en-US" sz="${sz}"/><a:t>${text}</a:t></a:r>`)
    .join('');
  return `<p:sld ${NS}><p:cSld><p:spTree><p:sp><p:txBody><a:p>${body}</a:p></p:txBody></p:sp>${pic}</p:spTree></p:cSld></p:sld>`;
}

function deck(slides, { cy = 6858000 } = {}) {
  const files = {
    'ppt/presentation.xml': `<p:presentation ${NS}><p:sldIdLst>${slides
      .map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`)
      .join('')}</p:sldIdLst><p:sldSz cx="12192000" cy="${cy}"/></p:presentation>`,
    'ppt/_rels/presentation.xml.rels': `<Relationships>${slides
      .map((_, i) => `<Relationship Id="rId${i + 1}" Type="x/slide" Target="slides/slide${i + 1}.xml"/>`)
      .join('')}</Relationships>`,
  };
  slides.forEach((slide, i) => {
    const n = i + 1;
    files[`ppt/slides/slide${n}.xml`] = slide.xml;
    if (slide.notes !== undefined) {
      files[`ppt/slides/_rels/slide${n}.xml.rels`] =
        `<Relationships><Relationship Id="rId9" Type="x/notesSlide" Target="../notesSlides/notesSlide${n}.xml"/></Relationships>`;
      files[`ppt/notesSlides/notesSlide${n}.xml`] =
        `<p:notes ${NS}><p:sp><p:nvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr></p:sp><p:sp><p:txBody><a:p><a:r><a:t>${slide.notes}</a:t></a:r></a:p></p:txBody></p:sp></p:notes>`;
    }
  });
  return zip(files);
}

test('example decks pass with slide, note, and PDF parity', async () => {
  const pptxgen = inspectPptx(await readFile(example('pptxgenjs', 'pptx')), {
    pdf: await readFile(example('pptxgenjs', 'pdf')),
  });
  assert.deepEqual(pptxgen.errors, []);
  assert.equal(pptxgen.slideCount, 5);
  assert.equal(pptxgen.notesCount, 5);
  assert.equal(pptxgen.pdfPages, 5);

  const marp = inspectPptx(await readFile(example('marp', 'pptx')), {
    pdf: await readFile(example('marp', 'pdf')),
  });
  assert.deepEqual(marp.errors, []);
  assert.equal(marp.pdfPages, 5, 'pages inside compressed object streams are counted');
  assert.ok(marp.slides.every((slide) => slide.imageOnly));
  assert.ok(marp.warnings.some((warning) => /image-only/.test(warning)));
});

test('missing notes, sub-floor text, and PDF mismatch are errors', () => {
  const buffer = deck([
    { xml: slideXml([[4400, 'Churn rose because of pricing']]), notes: 'Say why.' },
    { xml: slideXml([[1000, 'tiny footnote']]) },
  ]);
  const report = inspectPptx(buffer, { pdf: Buffer.from('/Type /Page /Type /Page /Type /Page') });
  assert.equal(report.slideCount, 2);
  assert.ok(report.errors.some((e) => /Slide 2: no speaker notes/.test(e)));
  assert.ok(report.errors.some((e) => /Slide 2: 10pt text .*hard floor/.test(e)));
  assert.ok(report.errors.some((e) => /PDF has 3 page\(s\) but the PPTX has 2/.test(e)));
  assert.ok(!report.errors.some((e) => /Slide 1/.test(e)));
});

test('caption-size text, missing alt text, and dense slides are warnings', () => {
  const pic = '<p:pic><p:nvPicPr><p:cNvPr id="4" name="Picture"/></p:nvPicPr></p:pic>';
  const words = Array.from({ length: 80 }, (_, i) => `word${i}`).join(' ');
  const report = inspectPptx(
    deck([{ xml: slideXml([[1200, 'label'], [2800, words]], pic), notes: 'ok' }]),
  );
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((w) => /12pt text .*body floor/.test(w)));
  assert.ok(report.warnings.some((w) => /1 picture\(s\) without alt text/.test(w)));
  assert.ok(report.warnings.some((w) => /dense text \(81 words/.test(w)));
});

test('--no-notes skips the notes requirement; 4:3 decks warn', () => {
  const report = inspectPptx(deck([{ xml: slideXml([[3200, 'Hello']]) }], { cy: 9144000 }), {
    requireNotes: false,
  });
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((w) => /not 16:9/.test(w)));
});

test('word counting separates CJK characters from Latin words', () => {
  assert.deepEqual(countWords('流失率上升 because pricing'), { cjk: 5, latin: 2 });
  assert.equal(countPdfPages(Buffer.from('nothing here')), null);
});

test('CLI exits 1 on errors and prints JSON on request', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'pptx-check-'));
  try {
    const file = path.join(dir, 'bad.pptx');
    await writeFile(file, deck([{ xml: slideXml([[3200, 'No notes here']]) }]));
    await assert.rejects(execFileAsync(process.execPath, [script, file]), (err) => {
      assert.equal(err.code, 1);
      assert.match(err.stdout, /error {4}Slide 1: no speaker notes/);
      return true;
    });
    const { stdout } = await execFileAsync(process.execPath, [script, file, '--no-notes', '--json']);
    assert.equal(JSON.parse(stdout).slideCount, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('text at the documented floors passes; footer fields are ignored', () => {
  // 8 pt on a 405 pt slide (10×5.625 in) is the documented hard floor.
  const small = inspectPptx(deck([{ xml: slideXml([[800, 'Source: survey 2024']]), notes: 'n' }], { cy: 5143500 }));
  assert.ok(!small.errors.some((e) => /hard floor/.test(e)), small.errors.join('; '));
  // 14 pt on a 540 pt slide is the documented body floor.
  const body = inspectPptx(deck([{ xml: slideXml([[1400, 'Body text at the floor']]), notes: 'n' }]));
  assert.ok(!body.warnings.some((w) => /body floor/.test(w)), body.warnings.join('; '));
  // A 9 pt slide-number field must not count as content.
  const field = slideXml([[3200, 'Main point of the slide']]).replace(
    '</a:p>',
    '<a:fld id="{1}" type="slidenum"><a:rPr lang="en-US" sz="900"/><a:t>3</a:t></a:fld></a:p>',
  );
  const withField = inspectPptx(deck([{ xml: field, notes: 'n' }]));
  assert.deepEqual(withField.errors, []);
});

test('PDF page count prefers the page tree over stray page objects', () => {
  const pdf = Buffer.from(
    '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> << /Type /Page >> << /Type /Page >> << /Type /Page >>',
  );
  assert.equal(countPdfPages(pdf), 2);
  assert.equal(countPdfPages(Buffer.from('<< /Count 3 /Kids [] /Type /Pages >>')), 3);
});

test('text that needs more height than its box is reported as a possible overflow', () => {
  const box = (cy, words) =>
    `<p:sld ${NS}><p:cSld><p:spTree><p:sp><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="4572000" cy="${cy}"/></a:xfrm></p:spPr><p:txBody><a:bodyPr lIns="0" rIns="0" tIns="0" bIns="0"/><a:p><a:r><a:rPr lang="en-US" sz="4000" b="1"/><a:t>${words}</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`;
  const long = 'Agentic coding is a loop, not a single answer';
  const tight = inspectPptx(deck([{ xml: box(914400, long), notes: 'n' }])); // 1 in tall, 5 in wide
  assert.ok(tight.warnings.some((w) => /may overflow its box/.test(w)), tight.warnings.join('; '));
  const roomy = inspectPptx(deck([{ xml: box(2743200, long), notes: 'n' }])); // 3 in tall
  assert.ok(!roomy.warnings.some((w) => /overflow/.test(w)), roomy.warnings.join('; '));
});

test('the showcase and pptxgenjs example decks have no overflow or density warnings', async () => {
  for (const engine of ['claude-pptx', 'pptxgenjs']) {
    const report = inspectPptx(await readFile(example(engine, 'pptx')), {
      pdf: await readFile(example(engine, 'pdf')),
    });
    assert.deepEqual(report.errors, [], engine);
    assert.deepEqual(report.warnings, [], `${engine}: ${report.warnings.join('; ')}`);
  }
});

test('only shrink-to-fit that was actually applied is reported', () => {
  const shape = (autofit) =>
    `<p:sld ${NS}><p:cSld><p:spTree><p:sp><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="4572000" cy="2743200"/></a:xfrm></p:spPr><p:txBody><a:bodyPr>${autofit}</a:bodyPr><a:p><a:r><a:rPr lang="en-US" sz="2400"/><a:t>Short line</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`;
  const applied = inspectPptx(deck([{ xml: shape('<a:normAutofit fontScale="62500"/>'), notes: 'n' }]));
  assert.ok(applied.warnings.some((w) => /shrunk to 62\.5%/.test(w)), applied.warnings.join('; '));
  const setting = inspectPptx(deck([{ xml: shape('<a:normAutofit/>'), notes: 'n' }]));
  assert.deepEqual(setting.warnings, []);
});

test('text runs with attributes (xml:space="preserve") are read', () => {
  const xml = `<p:sld ${NS}><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:rPr lang="en-US" sz="3200"/><a:t>Churn</a:t></a:r><a:r><a:rPr lang="en-US" sz="3200"/><a:t xml:space="preserve"> rose after the change TODO</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`;
  const report = inspectPptx(deck([{ xml, notes: 'n' }]));
  assert.ok(report.errors.some((e) => /placeholder text "TODO"/.test(e)), report.errors.join('; '));
  assert.equal(report.slides[0].words, 6);
});

const shapeXml = ({ x, y, w, h, fill = false, text = '', sz = 1800, wrap = '', algn = '' }) =>
  `<p:sp><p:spPr><a:xfrm><a:off x="${Math.round(x)}" y="${Math.round(y)}"/><a:ext cx="${Math.round(w)}" cy="${Math.round(h)}"/></a:xfrm>${fill ? '<a:solidFill><a:srgbClr val="FFCF33"/></a:solidFill>' : '<a:noFill/>'}</p:spPr>${
    text ? `<p:txBody><a:bodyPr ${wrap} lIns="0" rIns="0" tIns="0" bIns="0"/><a:p>${algn ? `<a:pPr algn="${algn}"/>` : ''}<a:r><a:rPr lang="zh-TW" sz="${sz}" b="1"/><a:t>${text}</a:t></a:r></a:p></p:txBody>` : ''
  }</p:sp>`;
const slideOf = (...shapes) => `<p:sld ${NS}><p:cSld><p:spTree>${shapes.join('')}</p:spTree></p:cSld></p:sld>`;
const IN = 914400;

test('a no-wrap label wider than the pill behind it is reported; one that fits is not', () => {
  const pill = shapeXml({ x: IN, y: 4 * IN, w: 2.6 * IN, h: 0.6 * IN, fill: true });
  const label = (text) => shapeXml({ x: 1.15 * IN, y: 4.15 * IN, w: 2.3 * IN, h: 0.3 * IN, text, wrap: 'wrap="none"' });
  const cut = inspectPptx(deck([{ xml: slideOf(pill, label('吩咐 · 驗貨 · 派活 · 算賬')), notes: 'n' }]));
  assert.ok(cut.warnings.some((w) => /runs [\d.]+ in past the edge of the shape behind it/.test(w)), cut.warnings.join('; '));
  const fits = inspectPptx(deck([{ xml: slideOf(pill, label('吩咐 · 驗貨')), notes: 'n' }]));
  assert.deepEqual(fits.warnings, []);
  // The slide background is not a "shape behind it".
  const bg = shapeXml({ x: 0, y: 0, w: 12192000, h: 6858000, fill: true });
  const header = shapeXml({ x: IN, y: 0.3 * IN, w: 0.5 * IN, h: 0.3 * IN, text: 'Block 1 · 怎麼吩咐', sz: 1500, wrap: 'wrap="none"' });
  assert.deepEqual(inspectPptx(deck([{ xml: slideOf(bg, header), notes: 'n' }])).warnings, []);
});

test('short footer lines are captions; body text and per-box paragraphs are still checked', () => {
  const footer = shapeXml({ x: IN, y: 6.2 * IN, w: 9 * IN, h: 0.3 * IN, text: '資料：中心 2025 年個案檢討', sz: 1350 });
  const bodySmall = shapeXml({ x: IN, y: 2 * IN, w: 9 * IN, h: 1 * IN, text: '這是內文但字太小了一點點', sz: 1350 });
  assert.deepEqual(inspectPptx(deck([{ xml: slideOf(footer), notes: 'n' }])).warnings, []);
  assert.ok(inspectPptx(deck([{ xml: slideOf(bodySmall), notes: 'n' }])).warnings.some((w) => /13.5pt text .*body floor/.test(w)));
  const para = '長'.repeat(80);
  const box = shapeXml({ x: IN, y: 2 * IN, w: 9 * IN, h: 4 * IN, text: para, sz: 2000 });
  assert.ok(inspectPptx(deck([{ xml: slideOf(box), notes: 'n' }])).warnings.some((w) => /one text box carries a paragraph/.test(w)));
  const cards = [0, 1, 2, 3].map((i) => shapeXml({ x: (0.5 + i * 3) * IN, y: 2 * IN, w: 2.8 * IN, h: 3 * IN, text: '卡'.repeat(35), sz: 1650 }));
  assert.ok(!inspectPptx(deck([{ xml: slideOf(...cards), notes: 'n' }])).warnings.some((w) => /dense|paragraph/.test(w)), '140 CJK across four cards is not a wall');
});

test('a deck of box rows with no visuals is flagged; speaker voice on a slide is flagged', () => {
  const card = (i, text = '卡片內容') => shapeXml({ x: (0.5 + i * 3) * IN, y: 2 * IN, w: 2.8 * IN, h: 2.5 * IN, fill: true, text, sz: 2000 });
  const boxes = slideOf(card(0), card(1), card(2));
  const monotone = inspectPptx(deck(Array.from({ length: 8 }, () => ({ xml: boxes, notes: 'n' }))));
  assert.ok(monotone.errors.some((e) => /8 of 8 slides are a row of boxes/.test(e)));
  assert.ok(monotone.warnings.some((w) => /No slide has a picture, chart, or drawn diagram/.test(w)));
  const line = '<p:cxnSp><p:spPr><a:prstGeom prst="straightConnector1"/></p:spPr></p:cxnSp>';
  const mixed = Array.from({ length: 8 }, (_, i) => ({ xml: i < 4 ? boxes : slideOf(card(0), line), notes: 'n' }));
  const varied = inspectPptx(deck(mixed));
  assert.ok(!varied.errors.some((e) => /row of boxes/.test(e)));
  assert.ok(!varied.warnings.some((w) => /No slide has/.test(w)));
  const voice = slideOf(shapeXml({ x: IN, y: 2 * IN, w: 9 * IN, h: IN, text: '今天我想同大家講三件事', sz: 2400 }));
  assert.ok(inspectPptx(deck([{ xml: voice, notes: 'n' }])).warnings.some((w) => /speaker's voice/.test(w)));
  const quoted = slideOf(shapeXml({ x: IN, y: 2 * IN, w: 9 * IN, h: IN, text: '開場白：「我想同你傾五分鐘」', sz: 2400 }));
  assert.ok(!inspectPptx(deck([{ xml: quoted, notes: 'n' }])).warnings.some((w) => /speaker's voice/.test(w)), 'quoted dialogue is fine');
});
