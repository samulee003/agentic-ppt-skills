#!/usr/bin/env node
// Writes BUILD-PACKET.md: everything an external slide tool (ChatGPT, Gamma,
// Canva, Copilot, Google Slides, a designer) needs to build the deck exactly
// as the storyboard specifies. Reads PRESENTATION-BRIEF.md, STORYBOARD.md,
// SPEAKER-SCRIPT.md (optional), and the theme file named in the brief.
// Usage: build-packet.mjs <work-root> [--out=<file>] [--include-backup]

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTables } from './storyboard-check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

function field(markdown, label) {
  const line = markdown
    .split(/\r?\n/)
    .find((l) => new RegExp(String.raw`^\s*-\s*${label}\b`, 'i').test(l));
  if (!line) return '';
  return line.slice(line.indexOf(':') + 1).trim();
}

function column(header, ...names) {
  return header.find((name) => names.some((candidate) => name.startsWith(candidate)));
}

export function themeId(brief) {
  const value = field(brief, 'Theme');
  // Accept `sticker-pop`, sticker-pop, or themes/sticker-pop.md; ignore the
  // template's "(`make-presentation/themes/<id>.md`, …)" placeholder.
  return value.match(/^`?(?:\S*themes\/)?([a-z0-9]+(?:-[a-z0-9]+)*)(?:\.md)?`?(?=$|[\s,;(])/)?.[1] ?? null;
}

export function buildPacket({ brief = '', storyboard, script = '', theme = null, includeBackup = false }) {
  const board = parseTables(storyboard).find((t) => column(t.header, 'slide'));
  if (!board || board.rows.length === 0) throw new Error('STORYBOARD.md has no slide rows');
  const col = (...names) => column(board.header, ...names);
  const [slideCol, titleCol, archetypeCol, jobCol, evidenceCol, timeCol, rangeCol] = [
    col('slide'),
    col('action title'),
    col('archetype'),
    col('audience job'),
    col('evidence'),
    col('time'),
    col('main'),
  ];
  if (!titleCol || !archetypeCol) {
    throw new Error('STORYBOARD.md needs "Action title" and "Archetype" columns (run storyboard-check.mjs)');
  }

  const notes = new Map();
  const scriptTable = parseTables(script).find((t) => column(t.header, 'page', 'slide'));
  if (scriptTable) {
    const pageCol = column(scriptTable.header, 'page', 'slide');
    const wordingCol = column(scriptTable.header, 'approved wording', 'notes');
    for (const row of scriptTable.rows) notes.set(row[pageCol], wordingCol ? row[wordingCol] : '');
  }

  const rows = board.rows.filter((row) => includeBackup || !/backup|備|备|q&a/i.test(row[rangeCol] ?? ''));
  const lines = [
    '# BUILD-PACKET',
    '',
    'Build the slides below exactly as specified:',
    '',
    '- One slide per block, in this order. Do not add, merge, split, or reorder slides.',
    '- Use each action title verbatim as the slide title.',
    '- Put the speaker notes in the notes field of each slide, not on the slide.',
    '- Follow the archetype and the theme. Keep body text at or above the type floor.',
    '- Give every image and chart alt text.',
    '- Export as PowerPoint (.pptx) and PDF.',
    '',
    '## Deck',
    '',
    `- Deck type: ${field(brief, 'Deck type') || '(not recorded)'}`,
    `- Audience: ${field(brief, 'Primary audience') || '(not recorded)'}`,
    `- Language on screen / spoken: ${field(brief, 'Language on screen') || '(not recorded)'}`,
    `- Aspect ratio: 16:9`,
    `- Slides: ${rows.length}`,
    '',
    '## Type scale (share of slide height)',
    '',
    '- Slide title 4.5–7.5%; body 3.0–4.1%, never under 2.6%; captions and source lines never under 2.0%.',
    '- On a 10 × 5.625 in slide: title 18–30 pt, body 12–17 pt (floor 10.5 pt), captions ≥ 8 pt.',
    '- On a 13.33 × 7.5 in slide: title 24–40 pt, body 16–22 pt (floor 14 pt), captions ≥ 11 pt.',
    '- If content does not fit, split the slide; never shrink text below the floor.',
    '',
    '## Archetypes',
    '',
    '- hero: one dominant statement or number, no bullets.',
    '- split: two asymmetric columns, visual on one side, explanation on the other.',
    '- diagram: a system or process drawing filling most of the slide, labels inside it.',
    '- cards: 2–4 parallel items with clear hierarchy.',
    '- data: one chart, table, or hero number that proves the title; highlight the series the title names; source line on the slide.',
    '- section: chapter divider.',
    '- interaction: a poll, discussion prompt, exercise, or demo cue.',
    '',
  ];

  lines.push('## Theme', '');
  if (theme) {
    lines.push(theme.trim(), '');
  } else {
    lines.push(`${field(brief, 'Theme') || '(no theme recorded in the brief)'}`, '');
  }
  const overrides = field(brief, 'Overrides to the theme');
  if (overrides) lines.push(`Overrides: ${overrides}`, '');
  const brand = field(brief, 'Master or template file');
  if (brand) lines.push(`Brand template: ${brand}. It overrides the theme's palette and fonts.`, '');

  lines.push('## Slides', '');
  for (const row of rows) {
    const id = row[slideCol];
    lines.push(`### Slide ${id}: ${row[titleCol]}`, '');
    lines.push(`- Archetype: ${row[archetypeCol]}`);
    if (jobCol && row[jobCol]) lines.push(`- Audience job: ${row[jobCol]}`);
    if (evidenceCol && row[evidenceCol] && !/^(-|—|none|n\/a)$/i.test(row[evidenceCol])) {
      lines.push(`- Sources: ${row[evidenceCol]} (see EVIDENCE-LEDGER.md; show the source line on data slides)`);
    }
    if (timeCol && row[timeCol]) lines.push(`- Time: ${row[timeCol]}`);
    const note = notes.get(id);
    lines.push(`- Speaker notes: ${note || '(to be written at stage-grill)'}`, '');
  }
  return `${lines.join('\n')}\n`;
}

function main(argv) {
  const root = argv.find((arg) => !arg.startsWith('--'));
  if (!root) {
    process.stderr.write('Usage: build-packet.mjs <work-root> [--out=<file>] [--include-backup]\n');
    process.exit(1);
  }
  const read = (name) => {
    const file = path.join(root, name);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
  const storyboard = read('STORYBOARD.md');
  if (storyboard === null) throw new Error(`No STORYBOARD.md in ${root}`);
  const brief = read('PRESENTATION-BRIEF.md') ?? '';
  const id = themeId(brief);
  const themeFile = id ? path.join(here, '..', 'themes', `${id}.md`) : null;
  const theme = themeFile && existsSync(themeFile) ? readFileSync(themeFile, 'utf8') : null;
  const packet = buildPacket({
    brief,
    storyboard,
    script: read('SPEAKER-SCRIPT.md') ?? '',
    theme,
    includeBackup: argv.includes('--include-backup'),
  });
  const outFlag = argv.find((arg) => arg.startsWith('--out='));
  const out = outFlag ? outFlag.slice('--out='.length) : path.join(root, 'BUILD-PACKET.md');
  writeFileSync(out, packet);
  process.stdout.write(`build-packet: wrote ${out}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`build-packet error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
