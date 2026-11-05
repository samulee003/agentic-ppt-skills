#!/usr/bin/env node
// Verifies SOURCE-INVENTORY.md against the disk: every file path it lists in a
// "Path" or "Source path" column exists under the source root (STATUS.md's
// sourceRoot), the work root, or the current folder. URLs and descriptive
// cells ("raw_notes.md benchmark section") are skipped. Rows in the "Missing"
// and "Access issue" sections are expected not to exist and are not checked.
// Usage: source-check.mjs <work-root> [--json]

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { column, parseTables } from './storyboard-check.mjs';

const clean = (value = '') => value.replace(/[`*]/g, '').trim();

/** A cell is a path when it has no spaces and looks like a file or folder. */
export function looksLikePath(cell) {
  const value = clean(cell);
  if (!value || /\s/.test(value) || /^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return false;
  return /\.[A-Za-z0-9]{1,6}$/.test(value) || value.endsWith('/');
}

export function sourceRootFor(root) {
  const file = path.join(root, 'STATUS.md');
  if (!existsSync(file)) return null;
  const json = readFileSync(file, 'utf8').match(/<!-- presentation-status:start -->[\s\S]*?```json([\s\S]*?)```/)?.[1];
  try {
    const value = json ? JSON.parse(json.trim()).sourceRoot : null;
    return value ? path.resolve(root, value) : null;
  } catch {
    return null;
  }
}

export function checkSources({ inventory, bases }) {
  const errors = [];
  let checked = 0;
  // Only sections that claim the file is here; Missing and Access issue rows are not.
  const sections = inventory.split(/^##\s+/m).filter((part) => !/^(Missing|Access issue)\b/i.test(part));
  for (const section of sections) {
    for (const table of parseTables(section)) {
      const pathCol = column(table.header, 'path', 'source path');
      if (!pathCol) continue;
      for (const row of table.rows) {
        if (!looksLikePath(row[pathCol])) continue;
        checked += 1;
        const value = clean(row[pathCol]);
        if (!bases.some((base) => existsSync(path.resolve(base, value)))) {
          errors.push(`SOURCE-INVENTORY.md lists "${value}", which is not under ${bases.join(' or ')}`);
        }
      }
    }
  }
  return { errors, warnings: [], checked };
}

export function checkSourcesAt(root) {
  const file = path.join(root, 'SOURCE-INVENTORY.md');
  if (!existsSync(file)) return { errors: [`No SOURCE-INVENTORY.md in ${root}`], warnings: [], checked: 0 };
  const bases = [sourceRootFor(root), path.resolve(root), process.cwd()].filter(Boolean);
  return checkSources({ inventory: readFileSync(file, 'utf8'), bases: [...new Set(bases)] });
}

function main(argv) {
  const root = argv.find((arg) => !arg.startsWith('--'));
  if (!root) {
    process.stderr.write('Usage: source-check.mjs <work-root> [--json]\n');
    process.exit(1);
  }
  const report = checkSourcesAt(root);
  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`source-check: ${report.checked} path(s) checked\n`);
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    if (report.errors.length === 0) process.stdout.write('source-check: no errors\n');
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`source-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
