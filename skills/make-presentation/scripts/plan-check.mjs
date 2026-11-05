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
import { slideTexts } from './pptx-check.mjs';
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

export function checkPlan({ storyboard, script = null, slides }) {
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
  return checkPlan({ storyboard, script: read('SPEAKER-SCRIPT.md'), slides: slideTexts(readFileSync(pptx)) });
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
