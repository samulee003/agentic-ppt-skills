#!/usr/bin/env node
// Re-verifies INTERROGATION.md mechanically (references/interrogate.md):
//   - at least three adversaries per round, the newcomer among them
//   - every kept finding quotes text that really exists in the deck's
//     artifacts (story, storyboard, script, ledger, or exported .pptx)
//   - ledger proofs name claim IDs that exist; contradiction proofs carry a
//     second quote that also exists
//   - every kept finding has a bucket; every Act on finding has a resolution
// Usage: interrogation-check.mjs <work-root> [--round=story-grill|stage-grill] [--pptx=<file>] [--json]

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slideTexts } from './pptx-check.mjs';
import { parseTables } from './storyboard-check.mjs';

export const PROOF_TYPES = ['ledger', 'contradiction', 'check', 'arithmetic', 'unanswered'];
export const BUCKETS = ['Act on', 'Consider', 'Noted'];
const SOURCES = ['STORY.md', 'STORYBOARD.md', 'SPEAKER-SCRIPT.md', 'EVIDENCE-LEDGER.md', 'PRESENTATION-BRIEF.md'];

export function normalize(text) {
  return text
    .replace(/[“”„‟"]/g, '"')
    .replace(/[‘’‛']/g, "'")
    .replace(/\\\|/g, '|')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function column(header, ...names) {
  // Prefer an exact header ("proof") over a prefix match ("proof type").
  return (
    header.find((name) => names.includes(name)) ??
    header.find((name) => names.some((candidate) => name.startsWith(candidate)))
  );
}

/** Splits INTERROGATION.md into rounds, each with its findings and adversary list. */
export function parseRounds(markdown) {
  const parts = markdown.split(/^##\s+Round:\s*/m).slice(1);
  return parts.map((part) => {
    const name = part.split(/\r?\n/, 1)[0].trim();
    const adversaries = (part.match(/###\s+Adversaries\s*\n([\s\S]*?)(?=\n###|$)/)?.[1] ?? '')
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*-\s*([^:]+):/)?.[1]?.trim())
      .filter(Boolean)
      .filter((persona) => !persona.startsWith('<'));
    const table = parseTables(part).find((t) => column(t.header, 'quote'));
    const findings = (table?.rows ?? []).map((row) => {
      const get = (...names) => {
        const key = column(table.header, ...names);
        return key ? row[key].trim() : '';
      };
      return {
        id: get('id'),
        adversary: get('adversary'),
        slide: get('slide'),
        quote: get('quote').replace(/^["“]|["”]$/g, ''),
        proofType: get('proof type').replace(/[`*]/g, '').toLowerCase(),
        proof: get('proof'),
        verdict: get('verdict').replace(/[`*]/g, '').toLowerCase(),
        bucket: get('bucket').replace(/[`*]/g, ''),
        resolution: get('resolution'),
      };
    });
    return { name, adversaries, findings };
  });
}

export function checkInterrogation({ interrogation, corpus, claimIds, round = null }) {
  const errors = [];
  const warnings = [];
  const rounds = parseRounds(interrogation).filter((r) => !round || r.name === round);
  if (rounds.length === 0) {
    errors.push(round ? `INTERROGATION.md has no "## Round: ${round}" section` : 'INTERROGATION.md has no rounds');
  }
  const haystack = normalize(corpus);
  const found = (quote) => quote && haystack.includes(normalize(quote));
  let kept = 0;

  for (const r of rounds) {
    if (r.adversaries.length < 3) errors.push(`${r.name}: needs at least three adversaries (found ${r.adversaries.length})`);
    if (!r.adversaries.some((a) => /newcomer|新手|新人/i.test(a))) {
      errors.push(`${r.name}: the newcomer must be one of the adversaries`);
    }
    for (const f of r.findings) {
      const label = `${r.name} ${f.id || `finding on slide ${f.slide}`}`;
      if (!['kept', 'dropped'].includes(f.verdict)) {
        errors.push(`${label}: verdict must be "kept" or "dropped", not "${f.verdict}"`);
        continue;
      }
      if (f.verdict === 'dropped') continue;
      kept += 1;
      if (!PROOF_TYPES.includes(f.proofType)) {
        errors.push(`${label}: proof type "${f.proofType}" is not one of ${PROOF_TYPES.join(', ')}`);
      }
      if (!f.proof) errors.push(`${label}: kept without a proof`);
      if (!found(f.quote)) {
        errors.push(`${label}: quote "${f.quote.slice(0, 60)}" is not in the deck's artifacts; copy it verbatim`);
      }
      if (f.proofType === 'ledger' && !/no row/i.test(f.proof)) {
        const ids = [...f.proof.matchAll(/`?([A-Za-z]+-?\d+[A-Za-z0-9-]*)`?/g)].map((m) => m[1]);
        const known = ids.filter((id) => claimIds.has(id));
        if (known.length === 0) errors.push(`${label}: ledger proof names no claim ID from EVIDENCE-LEDGER.md (or say "no row")`);
      }
      if (f.proofType === 'contradiction') {
        const second = f.proof.match(/["“]([^"”]{4,})["”]/)?.[1];
        if (!second) errors.push(`${label}: contradiction proof needs the second quote in double quotes`);
        else if (!found(second)) errors.push(`${label}: second quote "${second.slice(0, 60)}" is not in the deck's artifacts`);
      }
      if (!BUCKETS.includes(f.bucket)) {
        errors.push(`${label}: kept findings need a bucket (${BUCKETS.join(', ')})`);
      } else if (f.bucket === 'Act on' && f.resolution.replace(/[-—\s]/g, '') === '') {
        errors.push(`${label}: Act on without a resolution`);
      }
    }
    if (r.findings.length === 0) warnings.push(`${r.name}: no findings recorded; an interrogation that finds nothing is rare`);
  }
  return { errors, warnings, rounds: rounds.length, kept };
}

export function loadCorpus(root, pptxFile = null) {
  const parts = SOURCES.map((name) => path.join(root, name))
    .filter((file) => existsSync(file))
    .map((file) => readFileSync(file, 'utf8'));
  const candidates = pptxFile
    ? [pptxFile]
    : [path.join(root, 'exports'), path.join(root, '..', '..', 'exports')]
        .filter((dir) => existsSync(dir))
        .flatMap((dir) => readdirSync(dir).filter((f) => f.endsWith('.pptx')).map((f) => path.join(dir, f)));
  for (const file of candidates) {
    for (const slide of slideTexts(readFileSync(file))) parts.push(slide.text, slide.notes);
  }
  return parts.join('\n');
}

export function loadClaimIds(root) {
  const file = path.join(root, 'EVIDENCE-LEDGER.md');
  if (!existsSync(file)) return new Set();
  const table = parseTables(readFileSync(file, 'utf8')).find((t) => column(t.header, 'claim id'));
  return new Set((table?.rows ?? []).map((row) => row[column(table.header, 'claim id')].replace(/[`*]/g, '').trim()));
}

function main(argv) {
  const root = argv.find((arg) => !arg.startsWith('--'));
  if (!root) {
    process.stderr.write('Usage: interrogation-check.mjs <work-root> [--round=story-grill|stage-grill] [--pptx=<file>] [--json]\n');
    process.exit(1);
  }
  const file = path.join(root, 'INTERROGATION.md');
  if (!existsSync(file)) throw new Error(`No INTERROGATION.md in ${root}`);
  const flag = (name) => argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? null;
  const report = checkInterrogation({
    interrogation: readFileSync(file, 'utf8'),
    corpus: loadCorpus(root, flag('pptx')),
    claimIds: loadClaimIds(root),
    round: flag('round'),
  });
  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`interrogation-check: ${report.rounds} round(s), ${report.kept} kept finding(s)\n`);
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
    if (report.errors.length === 0) process.stdout.write('interrogation-check: no errors\n');
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`interrogation-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
