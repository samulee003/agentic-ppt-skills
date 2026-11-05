#!/usr/bin/env node
// Deterministic checks on STORYBOARD.md before story grilling:
//   - every slide has an action title that reads as a takeaway, not a topic label
//   - every slide has a known archetype; no three consecutive slides share one
//   - every cited evidence ID exists in EVIDENCE-LEDGER.md
//   - main-talk time fits the talk length in PRESENTATION-BRIEF.md
// Usage: storyboard-check.mjs <work-root> [--json]
// Exit code 1 when any error is found.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ARCHETYPES = ['hero', 'split', 'diagram', 'cards', 'data', 'section', 'interaction'];
const TITLE_EXEMPT = new Set(['section', 'interaction']);
const CJK = /[぀-ヿ㐀-鿿豈-﫿가-힯]/g;

export function parseTables(markdown) {
  const tables = [];
  let current = null;
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      current = null;
      continue;
    }
    const cells = trimmed
      .replace(/^\||\|$/g, '')
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim().replace(/\\\|/g, '|'));
    if (!current) {
      current = { header: cells.map((cell) => cell.toLowerCase()), rows: [] };
      tables.push(current);
    } else if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) {
      continue;
    } else if (cells.some((cell) => cell !== '')) {
      current.rows.push(Object.fromEntries(current.header.map((name, i) => [name, cells[i] ?? ''])));
    }
  }
  return tables;
}

export function isTopicLabel(title) {
  const clean = title.replace(/[*_`]/g, '').trim();
  if (clean.endsWith(':') || clean.endsWith('：')) return true;
  const cjk = (clean.match(CJK) ?? []).length;
  const words = (clean.replace(CJK, ' ').match(/[\p{L}\p{N}%$€£¥]+/gu) ?? []).length;
  if (cjk > 0) return cjk + words * 2 < 8;
  return words < 4;
}

export function parseMinutes(value) {
  const text = value.trim().toLowerCase();
  if (!text) return null;
  const clock = text.match(/^(\d+):(\d{1,2})$/);
  if (clock) return Number(clock[1]) + Number(clock[2]) / 60;
  const seconds = text.match(/^(\d+(?:\.\d+)?)\s*(?:s|sec|secs|seconds|秒)$/);
  if (seconds) return Number(seconds[1]) / 60;
  const minutes = text.match(/^(\d+(?:\.\d+)?)\s*(?:m|min|mins|minutes|分|分鐘|分钟)?$/);
  if (minutes) return Number(minutes[1]);
  return null;
}

/** The value after a brief line's label, accepting ":" or the full-width "：". */
export function afterLabel(line) {
  const at = line.search(/[:：]/);
  return at < 0 ? '' : line.slice(at + 1);
}

export function briefMinutes(brief) {
  const lines = brief.split(/\r?\n/);
  // A session with long stretches off the slides states its slide time separately.
  const line =
    lines.find((l) => /^\s*-\s*(?:Slide time|投影片時間|幻灯片时间)/i.test(l) && /\d/.test(afterLabel(l))) ??
    lines.find((l) => /^\s*-\s*(?:Time\b|時間|时间)/i.test(l));
  if (!line) return null;
  const value = afterLabel(line);
  const MINUTES = String.raw`(?:minutes?|mins?|m\b|分鐘|分钟|分)`;
  const hours = value.match(
    new RegExp(String.raw`(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h\b|小時|小时)\s*(?:(\d+(?:\.\d+)?)\s*${MINUTES})?`, 'i'),
  );
  const minutes = value.match(new RegExp(String.raw`(\d+(?:\.\d+)?)\s*${MINUTES}`, 'i'));
  // "1 hour 30 min" → 90; a lone hour count wins only if it comes first
  // ("1 h talk, 10 min Q&A" → 60).
  if (hours && (!minutes || hours.index <= minutes.index)) {
    return Number(hours[1]) * 60 + (hours[2] ? Number(hours[2]) : 0);
  }
  return minutes ? Number(minutes[1]) : null;
}

/** Finds a table column: an exact header first ("proof"), then a prefix match ("proof type"). */
export function column(header, ...names) {
  return (
    header.find((name) => names.includes(name)) ??
    header.find((name) => names.some((candidate) => name.startsWith(candidate)))
  );
}

/** Seconds to say a passage aloud: about 4 CJK characters or 2.5 Latin words a second. */
export function spokenSeconds(text) {
  const cjk = (text.match(CJK) ?? []).length;
  const words = (text.replace(CJK, ' ').match(/[\p{L}\p{N}]+/gu) ?? []).length;
  return cjk / 4 + words / 2.5;
}

const CN_DIGITS = { 一: 1, 兩: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 半: 0.5 };

/** Minutes of activity the notes schedule explicitly ("about two minutes", 「大約兩分鐘」). */
export function plannedActivitySeconds(text) {
  let seconds = 0;
  // Only durations marked as scheduled ("about", "for", 大約, 約): "talk for five
  // minutes at the door" inside the content must not count as activity time.
  const marked = /(?:大約|大概|約|约|about|around|approx\.?|for)\s*(\d+(?:\.\d+)?|[一兩二三四五六七八九十半])\s*(?:分鐘|分钟|minutes?|mins?)/gi;
  for (const m of text.matchAll(marked)) {
    seconds += (CN_DIGITS[m[1]] ?? Number(m[1])) * 60;
  }
  return seconds;
}

export function checkStoryboard({ storyboard, ledger = null, brief = null, script = null }) {
  const errors = [];
  const warnings = [];
  const table = parseTables(storyboard).find((t) => column(t.header, 'slide'));
  if (!table) return { errors: ['STORYBOARD.md has no slide table'], warnings, slides: 0 };

  const titleCol = column(table.header, 'action title');
  const archetypeCol = column(table.header, 'archetype');
  const evidenceCol = column(table.header, 'evidence');
  const timeCol = column(table.header, 'time');
  const rangeCol = column(table.header, 'main');
  if (!titleCol) errors.push('STORYBOARD.md is missing the "Action title" column');
  if (!archetypeCol) errors.push('STORYBOARD.md is missing the "Archetype" column');
  if (table.rows.length === 0) errors.push('STORYBOARD.md has no slides');

  const ledgerIds = new Set();
  if (ledger) {
    const claims = parseTables(ledger).find((t) => column(t.header, 'claim id'));
    for (const row of claims?.rows ?? []) {
      const id = row[column(claims.header, 'claim id')];
      if (id) ledgerIds.add(id);
    }
  }

  let run = { archetype: null, length: 0 };
  let mainMinutes = 0;
  let timedRows = 0;
  table.rows.forEach((row, index) => {
    const label = row[column(table.header, 'slide')] || String(index + 1);
    const backup = rangeCol ? /backup|備|备|q&a/i.test(row[rangeCol]) : false;
    const archetype = archetypeCol ? row[archetypeCol].replace(/[`*]/g, '').trim().toLowerCase() : '';

    if (archetypeCol) {
      if (!archetype) errors.push(`Slide ${label}: no archetype`);
      else if (!ARCHETYPES.includes(archetype)) {
        errors.push(`Slide ${label}: unknown archetype "${archetype}" (use ${ARCHETYPES.join(', ')})`);
      }
    }

    if (titleCol) {
      const title = row[titleCol];
      if (!title) errors.push(`Slide ${label}: no action title`);
      else if (!backup && !TITLE_EXEMPT.has(archetype) && isTopicLabel(title)) {
        errors.push(`Slide ${label}: "${title}" reads as a topic label; write the takeaway as a sentence`);
      }
    }

    if (!backup && archetype) {
      run = run.archetype === archetype ? { archetype, length: run.length + 1 } : { archetype, length: 1 };
      if (run.length === 3) {
        errors.push(`Slide ${label}: third consecutive "${archetype}" slide; vary the layout`);
      }
    }

    if (evidenceCol && ledger) {
      const ids = row[evidenceCol]
        .split(/[,;、，\s]+/)
        .map((id) => id.replace(/[`*]/g, '').trim())
        .filter((id) => id && !/^(-|—|n\/a|none|無|无)$/i.test(id));
      for (const id of ids) {
        if (!ledgerIds.has(id)) errors.push(`Slide ${label}: evidence ID "${id}" is not in EVIDENCE-LEDGER.md`);
      }
    }

    if (timeCol && !backup) {
      const minutes = parseMinutes(row[timeCol]);
      if (minutes === null) {
        if (row[timeCol]) warnings.push(`Slide ${label}: cannot read time "${row[timeCol]}"`);
      } else {
        mainMinutes += minutes;
        timedRows += 1;
      }
    }
  });

  // Once SPEAKER-SCRIPT.md exists, each slot should be filled by its notes:
  // far shorter means unplanned minutes, far longer means the slot overruns.
  const scriptTable = script ? parseTables(script).find((t) => column(t.header, 'page', 'slide')) : null;
  if (scriptTable && timeCol) {
    const pageCol = column(scriptTable.header, 'page', 'slide');
    const wordCol = column(scriptTable.header, 'approved wording', 'notes');
    const wording = new Map(scriptTable.rows.map((r) => [String(r[pageCol]).trim(), wordCol ? r[wordCol] : '']));
    for (const row of table.rows) {
      const label = row[column(table.header, 'slide')];
      const minutes = parseMinutes(row[timeCol] ?? '');
      const words = wording.get(String(label).trim());
      const archetype = archetypeCol ? row[archetypeCol].replace(/[`*]/g, '').trim().toLowerCase() : '';
      const backup = rangeCol ? /backup|備|备|q&a/i.test(row[rangeCol]) : false;
      if (minutes === null || !words || archetype === 'interaction' || backup) continue;
      const seconds = spokenSeconds(words) + plannedActivitySeconds(words);
      if (minutes >= 2 && seconds < minutes * 60 * 0.25) {
        warnings.push(`Slide ${label}: the notes take about ${Math.round(seconds)} s for a ${minutes}-minute slot; plan what fills the rest (a prompt, an activity) or shorten the slot`);
      } else if (seconds > minutes * 60 * 1.25) {
        warnings.push(`Slide ${label}: the notes take about ${Math.round(seconds)} s, more than the ${minutes}-minute slot`);
      }
    }
  }

  const target = brief ? briefMinutes(brief) : null;
  if (timeCol && timedRows > 0 && target) {
    if (mainMinutes > target) {
      errors.push(`Main talk runs ${mainMinutes.toFixed(1)} min, over the ${target} min in the brief`);
    } else if (mainMinutes < target * 0.8) {
      warnings.push(`Main talk runs ${mainMinutes.toFixed(1)} min, well under the ${target} min in the brief`);
    }
  } else if (brief && !target) {
    warnings.push('Could not read the talk length from the "Time" line in PRESENTATION-BRIEF.md');
  }

  return { errors, warnings, slides: table.rows.length, mainMinutes: timedRows ? mainMinutes : null };
}

function main(argv) {
  const root = argv.find((arg) => !arg.startsWith('--'));
  if (!root) {
    process.stderr.write('Usage: storyboard-check.mjs <work-root> [--json]\n');
    process.exit(1);
  }
  const read = (name) => {
    const file = path.join(root, name);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
  const storyboard = read('STORYBOARD.md');
  if (storyboard === null) throw new Error(`No STORYBOARD.md in ${root}`);
  const report = checkStoryboard({
    storyboard,
    ledger: read('EVIDENCE-LEDGER.md'),
    brief: read('PRESENTATION-BRIEF.md'),
    script: read('SPEAKER-SCRIPT.md'),
  });
  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(
      `STORYBOARD.md: ${report.slides} slides` +
        (report.mainMinutes !== null && report.mainMinutes !== undefined
          ? `, main talk ${report.mainMinutes.toFixed(1)} min`
          : '') +
        '\n',
    );
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
    if (report.errors.length === 0) process.stdout.write('storyboard-check: no errors\n');
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`storyboard-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
