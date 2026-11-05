#!/usr/bin/env node
// Verifies that grilling actually happened: every applicable node of the
// presentation grill tree (references/grill-tree.md) for a gate has a row in
// GRILL-LOG.md, nothing is silently assumed, and load-bearing assumptions are
// confirmed by the user before delivery.
// Usage: grill-check.mjs <work-root> <gate> [--json]
//   gate: product-grill | story-grill | deck-prototype | stage-grill | production-qa
//   production-qa checks every phase and turns unconfirmed load-bearing
//   assumptions into errors.
// Exit code 1 when any error is found.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { briefMinutes, parseTables } from './storyboard-check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PHASES = ['product-grill', 'story-grill', 'deck-prototype', 'stage-grill'];
export const STATUSES = ['Decided', 'Assumed', 'Deferred'];

export function loadTree(markdown = readFileSync(path.join(here, '..', 'references', 'grill-tree.md'), 'utf8')) {
  const match = markdown.match(/```json grill-tree\s*\n([\s\S]*?)```/);
  if (!match) throw new Error('grill-tree.md has no ```json grill-tree block');
  return JSON.parse(match[1]);
}

function column(header, ...names) {
  return header.find((name) => names.some((candidate) => name.startsWith(candidate)));
}

export function profileId(brief) {
  const line = (brief ?? '').split(/\r?\n/).find((l) => /^\s*-\s*Profile\b/i.test(l));
  return line?.slice(line.indexOf(':') + 1).match(/^\s*`?([a-z0-9]+(?:-[a-z0-9]+)*)`?(?=$|[\s,;(])/)?.[1] ?? null;
}

/** Adds the nodes a profile declares in its ```json grill-nodes block. */
export function withProfile(tree, profileMarkdown) {
  const match = profileMarkdown?.match(/```json grill-nodes\s*\n([\s\S]*?)```/);
  if (!match) return tree;
  const extra = JSON.parse(match[1]);
  return Object.fromEntries(
    Object.entries(tree).map(([phase, nodes]) => [phase, [...nodes, ...(extra[phase] ?? [])]]),
  );
}

export function parseLog(markdown) {
  const table = parseTables(markdown).find((t) => column(t.header, 'phase'));
  if (!table) return { rows: [], schemaError: 'GRILL-LOG.md has no table with a "Phase" column' };
  const cols = {
    phase: column(table.header, 'phase'),
    node: column(table.header, 'node'),
    decision: column(table.header, 'decision'),
    status: column(table.header, 'status'),
    reason: column(table.header, 'reason'),
  };
  if (!cols.node || !cols.status) {
    return {
      rows: [],
      schemaError:
        'GRILL-LOG.md needs "Node" and "Status" columns (see presentation-product-grill/templates/GRILL-LOG.md)',
    };
  }
  const rows = table.rows.map((row, index) => ({
    line: index + 1,
    phase: row[cols.phase].replace(/[`*]/g, '').trim(),
    node: row[cols.node].replace(/[`*]/g, '').trim(),
    decision: cols.decision ? row[cols.decision] : '',
    status: row[cols.status].replace(/[`*]/g, '').trim(),
    reason: cols.reason ? row[cols.reason].trim() : '',
  }));
  return { rows };
}

export function checkGrill({ log, gate, brief = null, tree = loadTree() }) {
  const errors = [];
  const warnings = [];
  const final = gate === 'production-qa';
  if (!final && !PHASES.includes(gate)) {
    throw new Error(`Unknown gate "${gate}". Expected one of: ${[...PHASES, 'production-qa'].join(', ')}`);
  }
  const { rows, schemaError } = parseLog(log);
  if (schemaError) return { errors: [schemaError], warnings, covered: 0, required: 0 };

  const minutes = brief ? briefMinutes(brief) : null;
  const conditions = { longTalk: minutes === null || minutes > 30 };
  const phases = final ? PHASES : [gate];
  const known = new Map(PHASES.flatMap((phase) => tree[phase].map((node) => [`${phase}/${node.id}`, node])));

  for (const row of rows) {
    if (!STATUSES.includes(row.status)) {
      errors.push(`Row ${row.line} (${row.phase}/${row.node}): status "${row.status}" is not Decided, Assumed, or Deferred`);
    }
    if (!known.has(`${row.phase}/${row.node}`) && PHASES.includes(row.phase)) {
      warnings.push(`Row ${row.line}: "${row.node}" is not a ${row.phase} node in grill-tree.md (profile node or typo?)`);
    }
    if (row.status === 'Assumed' && row.reason.replace(/[-—\s]/g, '') === '') {
      errors.push(`Row ${row.line} (${row.phase}/${row.node}): Assumed without a reason`);
    }
  }

  let required = 0;
  let covered = 0;
  for (const phase of phases) {
    for (const node of tree[phase]) {
      if (node.when && !conditions[node.when]) continue;
      required += 1;
      const latest = rows.filter((row) => row.phase === phase && row.node === node.id).at(-1);
      if (!latest) {
        errors.push(`${phase}/${node.id}: not settled. Ask: ${node.question}`);
        continue;
      }
      covered += 1;
      if (latest.status === 'Deferred') {
        errors.push(`${phase}/${node.id}: still Deferred; get the answer (to-questionnaire) or record an Assumed default`);
      } else if (latest.status === 'Assumed' && node.loadBearing) {
        const message = `${phase}/${node.id}: load-bearing and only Assumed (${latest.reason || 'no reason'}); confirm it with the user`;
        if (final) errors.push(`${message} before delivery`);
        else warnings.push(message);
      }
    }
  }
  return { errors, warnings, covered, required };
}

function main(argv) {
  const [root, gate] = argv.filter((arg) => !arg.startsWith('--'));
  if (!root || !gate) {
    process.stderr.write('Usage: grill-check.mjs <work-root> <gate> [--json]\n');
    process.exit(1);
  }
  const read = (name) => {
    const file = path.join(root, name);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
  const log = read('GRILL-LOG.md');
  if (log === null) throw new Error(`No GRILL-LOG.md in ${root}`);
  const brief = read('PRESENTATION-BRIEF.md');
  const profile = profileId(brief);
  const profileFile = profile ? path.join(here, '..', 'profiles', `${profile}.md`) : null;
  if (profile && !existsSync(profileFile)) {
    throw new Error(`The brief names profile "${profile}", but ${profileFile} does not exist`);
  }
  const tree = withProfile(loadTree(), profileFile ? readFileSync(profileFile, 'utf8') : null);
  const report = checkGrill({ log, gate, brief, tree });
  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`grill-check ${gate}: ${report.covered}/${report.required} nodes settled\n`);
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
    if (report.errors.length === 0) process.stdout.write('grill-check: no errors\n');
  }
  if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`grill-check error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}
