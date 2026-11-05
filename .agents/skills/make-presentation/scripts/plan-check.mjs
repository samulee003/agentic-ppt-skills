#!/usr/bin/env node
// Compares the exported deck with the plan, so a builder (or an external tool
// in the handoff engine) cannot silently add slides, rewrite titles, or drop
// the approved speaker notes:
//   - slide count = STORYBOARD.md rows (main + backup)
//   - each slide's text contains its storyboard action title
//   - each slide's notes carry its SPEAKER-SCRIPT.md approved wording
//     (error under 50% word overlap, warning under 80%)
// Usage: plan-check.mjs <work-root> --pptx=<file> [--json]
// Without --pptx it looks for exports/<deck-id>.pptx next to the work root.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deckIdFor } from './interrogation-check.mjs';
import { inspectPptx, slideTexts } from './pptx-check.mjs';
import { column, parseTables } from './storyboard-check.mjs';

const CJK = /[぀-ヿ㐀-鿿豈-﫿가-힯]/;

/** Lowercase, unify quotes and dashes, and drop everything but letters and digits. */
export function squash(text) {
  return text
    .toLowerCase()
    .replace(/[“”„‟«»"]/g, '')
    .replace(/[‘’‛`']/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export function tokens(text) {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return words.flatMap((word) => (CJK.test(word) ? [...word] : [word]));
}

/** Share of the script's words that appear in the notes. */
export function overlap(script, notes) {
  const want = tokens(script);
  if (want.length === 0) return 1;
  const have = new Set(tokens(notes));
  return want.filter((token) => have.has(token)).length / want.length;
}

/** Does the brief's Imagery line promise pictures (photos, illustrations, icons)? */
export function promisesPictures(brief) {
  const line = (brief ?? '').split(/\r?\n/).find((l) => /^\s*-\s*(?:Imagery|配圖|配图|圖像|图像)/i.test(l));
  if (!line) return false;
  const value = line.slice(line.search(/[:：]/) + 1)
    // drop what the brief rules out: "no photos", 「不用照片」
    .replace(/(?:\bno\b|\bnot\b|\bwithout\b|不用|唔用|不要|唔要|避免|沒有|冇)[^,，;；。.]*/gi, ' ');
  return /photo|illustration|icon|image|picture|screenshot|照片|插圖|插图|插畫|插画|圖示|图示|圖片|图片|截圖|截图/i.test(value);
}

export function checkPlan({ storyboard, script = null, slides, brief = null, pictures = null }) {
  const errors = [];
  const warnings = [];
  const board = parseTables(storyboard).find((t) => column(t.header, 'slide'));
  if (!board) return { errors: ['STORYBOARD.md has no slide table'], warnings, slides: slides.length, planned: 0 };
  const titleCol = column(board.header, 'action title');
  if (!titleCol) errors.push('STORYBOARD.md is missing the "Action title" column');
  const planned = board.rows.length;
  if (planned !== slides.length) {
    errors.push(`The deck has ${slides.length} slide(s) but STORYBOARD.md plans ${planned}; slides were added, dropped, or merged`);
  }

  const wording = new Map();
  const table = script ? parseTables(script).find((t) => column(t.header, 'page', 'slide')) : null;
  if (table) {
    const pageCol = column(table.header, 'page', 'slide');
    const wordCol = column(table.header, 'approved wording', 'notes');
    for (const row of table.rows) if (wordCol) wording.set(String(row[pageCol]).trim(), row[wordCol]);
  }

  board.rows.forEach((row, index) => {
    const slide = slides[index];
    if (!slide) return;
    const label = row[column(board.header, 'slide')] || String(index + 1);
    const title = titleCol ? row[titleCol] : '';
    if (title && !squash(slide.text).includes(squash(title))) {
      errors.push(`Slide ${index + 1}: the storyboard title "${title}" is not on the slide; it was rewritten or moved`);
    }
    const approved = wording.get(String(label).trim());
    if (approved) {
      const score = overlap(approved, slide.notes);
      if (score < 0.5) {
        errors.push(`Slide ${index + 1}: the notes keep ${Math.round(score * 100)}% of the approved wording in SPEAKER-SCRIPT.md`);
      } else if (score < 0.8) {
        warnings.push(`Slide ${index + 1}: the notes keep ${Math.round(score * 100)}% of the approved wording; check the edits`);
      }
    }
  });
  // The slide repeats its own notes: the presenter's script was pasted on screen.
  slides.forEach((slide, index) => {
    const slideTokens = tokens(slide.text);
    if (slideTokens.length >= 30 && slide.notes && overlap(slide.text, slide.notes) > 0.7) {
      warnings.push(`Slide ${index + 1}: the slide repeats its speaker notes; keep the slide to the takeaway and leave the explanation in the notes`);
    }
  });

  if (brief && pictures !== null && promisesPictures(brief) && pictures === 0) {
    errors.push('The brief\'s Imagery line promises pictures (photos, illustrations, or icons), but the deck has none');
  }
  return { errors, warnings, slides: slides.length, planned };
}

export function findPptx(root) {
  const deckId = deckIdFor(root);
  if (!deckId) return null;
  return (
    [path.join(root, 'exports'), path.join(root, '..', '..', 'exports')]
      .map((dir) => path.join(dir, `${deckId}.pptx`))
      .find((file) => existsSync(file)) ?? null
  );
}

export function checkPlanAt(root, pptxFile = null) {
  const read = (name) => {
    const file = path.join(root, name);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
  const storyboard = read('STORYBOARD.md');
  if (storyboard === null) return { errors: [`No STORYBOARD.md in ${root}`], warnings: [], slides: 0, planned: 0 };
  const pptx = pptxFile ?? findPptx(root);
  if (!pptx || !existsSync(pptx)) {
    return { errors: [`No exported .pptx found for ${root}; pass --pptx=<file>`], warnings: [], slides: 0, planned: 0 };
  }
  const buffer = readFileSync(pptx);
  return checkPlan({
    storyboard,
    script: read('SPEAKER-SCRIPT.md'),
    slides: slideTexts(buffer),
    brief: read('PRESENTATION-BRIEF.md'),
    pictures: inspectPptx(buffer, { requireNotes: false }).pictures,
  });
}

function main(argv) {
  const root = argv.find((arg) => !arg.startsWith('--'));
  if (!root) {
    process.stderr.write('Usage: plan-check.mjs <work-root> --pptx=<file> [--json]\n');
    process.exit(1);
  }
  const pptx = argv.find((arg) => arg.startsWith('--pptx='))?.slice('--pptx='.length) ?? null;
  const report = checkPlanAt(root, pptx);
  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`plan-check: ${report.slides} slides in the deck, ${report.planned} planned\n`);
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
    if (report.errors.length === 0) process.stdout.write('plan-check: no errors\n');
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`plan-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
