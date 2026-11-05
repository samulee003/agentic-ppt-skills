#!/usr/bin/env node
// Enforces the evidence ledger's rules (presentation-evidence):
//   - every claim row has an ID, the claim, and a source; IDs are unique
//   - research-enhanced mode: every claim also has a date and an A/B/C/D safety
//   - STORYBOARD.md main-talk slides cite only A/B claims; C claims are notes or
//     backup only; D claims are rejected everywhere
//   - main-talk slides whose title states a number cite evidence (warning)
//   - every non-original asset has a licence
// Usage: ledger-check.mjs <work-root> [--json]
// Exit code 1 when any error is found.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { column, parseTables } from './storyboard-check.mjs';

const NONE = /^(-|—|none|n\/a|無|无)?$/i;
const clean = (value = '') => value.replace(/[`*]/g, '').trim();

export function parseLedger(markdown) {
  const tables = parseTables(markdown);
  const claims = tables.find((t) => column(t.header, 'claim id'));
  const assets = tables.find((t) => column(t.header, 'asset id', 'asset'));
  const get = (table, row, ...names) => {
    const key = column(table.header, ...names);
    return key ? clean(row[key]) : '';
  };
  return {
    claims: (claims?.rows ?? []).map((row) => ({
      id: get(claims, row, 'claim id'),
      claim: get(claims, row, 'claim'),
      source: get(claims, row, 'source'),
      date: get(claims, row, 'date'),
      safety: get(claims, row, 'safety').toUpperCase(),
    })),
    assets: (assets?.rows ?? []).map((row) => ({
      id: get(assets, row, 'asset id', 'asset'),
      file: get(assets, row, 'file'),
      licence: get(assets, row, 'licence', 'license'),
    })),
    hasClaimsTable: Boolean(claims),
  };
}

export function checkLedger({ ledger, storyboard = null, mode = 'general' }) {
  const errors = [];
  const warnings = [];
  const { claims, assets, hasClaimsTable } = parseLedger(ledger);
  if (!hasClaimsTable) errors.push('EVIDENCE-LEDGER.md has no table with a "Claim ID" column');
  const research = mode === 'research-enhanced';
  const byId = new Map();

  claims.forEach((claim, index) => {
    const label = claim.id || `row ${index + 1}`;
    if (!claim.id) errors.push(`Ledger row ${index + 1}: no claim ID`);
    else if (byId.has(claim.id)) errors.push(`Ledger: claim ID "${claim.id}" is used twice`);
    else byId.set(claim.id, claim);
    if (!claim.claim) errors.push(`Ledger ${label}: no claim text`);
    if (NONE.test(claim.source)) errors.push(`Ledger ${label}: no source`);
    if (claim.safety && !['A', 'B', 'C', 'D'].includes(claim.safety[0])) {
      errors.push(`Ledger ${label}: safety "${claim.safety}" is not A, B, C, or D`);
    }
    if (research) {
      if (NONE.test(claim.date)) errors.push(`Ledger ${label}: research-enhanced claims need a date`);
      if (!claim.safety) errors.push(`Ledger ${label}: research-enhanced claims need an A/B/C/D safety level`);
    }
  });

  for (const asset of assets) {
    if (!asset.id && !asset.file) continue;
    if (NONE.test(asset.licence)) errors.push(`Asset ${asset.id || asset.file}: no licence recorded`);
  }

  let cited = 0;
  if (storyboard) {
    const board = parseTables(storyboard).find((t) => column(t.header, 'slide'));
    const col = (...names) => (board ? column(board.header, ...names) : undefined);
    const [slideCol, titleCol, evidenceCol, rangeCol] = [col('slide'), col('action title'), col('evidence'), col('main')];
    for (const [index, row] of (board?.rows ?? []).entries()) {
      const label = row[slideCol] || String(index + 1);
      const backup = rangeCol ? /backup|備|备|q&a/i.test(row[rangeCol]) : false;
      const ids = evidenceCol
        ? row[evidenceCol]
            .split(/[,;、，\s]+/)
            .map(clean)
            .filter((id) => id && !NONE.test(id))
        : [];
      cited += ids.length;
      for (const id of ids) {
        const claim = byId.get(id);
        if (!claim) continue; // storyboard-check reports unknown IDs
        const level = claim.safety[0];
        if (level === 'D') errors.push(`Slide ${label}: cites ${id}, a safety D claim; D claims are rejected`);
        else if (level === 'C' && !backup) {
          errors.push(`Slide ${label}: cites ${id}, a safety C claim, in the main talk; move it to notes or backup`);
        }
      }
      const title = titleCol ? row[titleCol] : '';
      if (!backup && ids.length === 0 && /\d/.test(title.replace(/^\s*\d+[.)]\s*/, ''))) {
        warnings.push(`Slide ${label}: the title states a number ("${title}") but cites no evidence`);
      }
    }
  }
  return { errors, warnings, claims: claims.length, assets: assets.length, cited };
}

export function modeFor(root) {
  const file = path.join(root, 'STATUS.md');
  if (!existsSync(file)) return 'general';
  const json = readFileSync(file, 'utf8').match(/<!-- presentation-status:start -->[\s\S]*?```json([\s\S]*?)```/)?.[1];
  try {
    return (json && JSON.parse(json.trim()).mode) || 'general';
  } catch {
    return 'general';
  }
}

export function checkLedgerAt(root) {
  const read = (name) => {
    const file = path.join(root, name);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
  const ledger = read('EVIDENCE-LEDGER.md');
  if (ledger === null) return { errors: [`No EVIDENCE-LEDGER.md in ${root}`], warnings: [], claims: 0, assets: 0, cited: 0 };
  return checkLedger({ ledger, storyboard: read('STORYBOARD.md'), mode: modeFor(root) });
}

function main(argv) {
  const root = argv.find((arg) => !arg.startsWith('--'));
  if (!root) {
    process.stderr.write('Usage: ledger-check.mjs <work-root> [--json]\n');
    process.exit(1);
  }
  const report = checkLedgerAt(root);
  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`ledger-check: ${report.claims} claims, ${report.assets} assets, ${report.cited} citations on slides\n`);
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
    if (report.errors.length === 0) process.stdout.write('ledger-check: no errors\n');
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`ledger-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
