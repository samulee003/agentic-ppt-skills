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
import { afterLabel, briefMinutes, column, parseTables } from './storyboard-check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PHASES = ['product-grill', 'story-grill', 'deck-prototype', 'stage-grill'];
export const STATUSES = ['Decided', 'Assumed', 'Deferred'];

export function loadTree(markdown = readFileSync(path.join(here, '..', 'references', 'grill-tree.md'), 'utf8')) {
  const match = markdown.match(/```json grill-tree\s*\n([\s\S]*?)```/);
  if (!match) throw new Error('grill-tree.md has no ```json grill-tree block');
  return JSON.parse(match[1]);
}


export function profileId(brief) {
  const line = (brief ?? '').split(/\r?\n/).find((l) => /^\s*-\s*(?:Profile\b|設定檔|配置档)/i.test(l));
  return afterLabel(line ?? '').match(/^\s*`?([a-z0-9]+(?:-[a-z0-9]+)*)`?(?=$|[\s,;(])/)?.[1] ?? null;
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

/** "decided", "**Decided** ✅" → "Decided"; anything else is returned trimmed for the error message. */
export function normalizeStatus(value) {
  const word = value.replace(/[^A-Za-z]/g, '').toLowerCase();
  const match = STATUSES.find((status) => status.toLowerCase() === word);
  return match ?? value.replace(/[`*]/g, '').trim();
}

/** Rounds actually asked: id, phase, the node ids asked, and the user's reply. */
export function parseRounds(markdown) {
  const table = parseTables(markdown).find((t) => t.header.includes('nodes asked'));
  if (!table) return [];
  const get = (row, ...names) => {
    const key = column(table.header, ...names);
    return key ? row[key].replace(/[`*]/g, '').trim() : '';
  };
  return table.rows.map((row) => ({
    id: get(row, 'round').toUpperCase(),
    phase: get(row, 'phase'),
    nodes: get(row, 'nodes asked')
      .split(/[,，、;\s]+/)
      .map((n) => n.trim())
      .filter(Boolean),
    reply: get(row, 'user reply'),
  }));
}

export function parseLog(markdown) {
  const tables = parseTables(markdown);
  // The decisions table has a "Node" column; the rounds table has "Nodes asked".
  const table = tables.find((t) => t.header.includes('node') && column(t.header, 'phase'));
  if (!table) {
    return tables.some((t) => column(t.header, 'phase'))
      ? { rows: [], schemaError: 'GRILL-LOG.md needs "Node" and "Status" columns (see presentation-product-grill/templates/GRILL-LOG.md)' }
      : { rows: [], schemaError: 'GRILL-LOG.md has no table with a "Phase" column' };
  }
  const cols = {
    phase: column(table.header, 'phase'),
    node: column(table.header, 'node'),
    decision: column(table.header, 'decision'),
    status: column(table.header, 'status'),
    reason: column(table.header, 'reason'),
    round: table.header.includes('round') ? 'round' : undefined,
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
    status: normalizeStatus(row[cols.status]),
    reason: cols.reason ? row[cols.reason].trim() : '',
    round: cols.round ? row[cols.round].replace(/[`*]/g, '').trim().toUpperCase() : '',
  }));
  return { rows, hasRoundColumn: Boolean(cols.round), rounds: parseRounds(markdown) };
}

/** A Decided row confirming what a source already says: "Source: client email". */
const SOURCE_REASON = /^\s*(?:source|來源|来源|出處|出处)\s*[:：]/i;

export function checkGrill({ log, gate, brief = null, tree = loadTree() }) {
  const errors = [];
  const warnings = [];
  const final = gate === 'production-qa';
  if (!final && !PHASES.includes(gate)) {
    throw new Error(`Unknown gate "${gate}". Expected one of: ${[...PHASES, 'production-qa'].join(', ')}`);
  }
  const { rows, schemaError, hasRoundColumn, rounds } = parseLog(log);
  if (schemaError) return { errors: [schemaError], warnings, covered: 0, required: 0 };
  if (!hasRoundColumn) {
    errors.push('GRILL-LOG.md needs a "Round" column and a Rounds table: every Decided row names the round that asked it (see grill-tree.md)');
  }
  const roundsById = new Map(rounds.map((r) => [r.id, r]));
  for (const r of rounds) {
    if (!r.reply || /^(-|—|n\/a)$/i.test(r.reply)) errors.push(`Round ${r.id}: no user reply recorded; copy the reply verbatim`);
  }

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
    if (row.status === 'Decided' && hasRoundColumn) {
      const round = roundsById.get(row.round);
      if (!row.round) {
        errors.push(`Row ${row.line} (${row.phase}/${row.node}): Decided without a round; if the user was not asked, it is Assumed`);
      } else if (!round) {
        errors.push(`Row ${row.line} (${row.phase}/${row.node}): round ${row.round} is not in the Rounds table`);
      } else if (round.phase !== row.phase || !round.nodes.includes(row.node)) {
        errors.push(`Row ${row.line} (${row.phase}/${row.node}): round ${row.round} did not ask this node`);
      }
    }
  }

  // A round asks the frontier: a node whose prerequisite is answered in the same
  // round was not really asked, it was bundled into a premise the user accepted.
  // Load-bearing nodes only; a confirmation of what a source already says may
  // skip the order.
  const decidedIn = new Map();
  for (const row of rows) if (row.status === 'Decided' && row.round) decidedIn.set(`${row.phase}/${row.node}`, row.round);
  for (const row of rows) {
    if (row.status !== 'Decided' || !row.round || SOURCE_REASON.test(row.reason)) continue;
    const node = known.get(`${row.phase}/${row.node}`);
    if (!node?.loadBearing) continue;
    for (const dep of node?.deps ?? []) {
      if (decidedIn.get(`${row.phase}/${dep}`) === row.round) {
        errors.push(
          `Row ${row.line} (${row.phase}/${row.node}): asked in round ${row.round} together with its prerequisite "${dep}"; ask it in a later round, or start the Reason with "Source:" and cite where the source answers it`,
        );
        break;
      }
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

/** The tree for a work root: the shared nodes plus the brief's profile nodes. */
export function treeFor(brief) {
  const profile = profileId(brief);
  const profileFile = profile ? path.join(here, '..', 'profiles', `${profile}.md`) : null;
  if (profile && !existsSync(profileFile)) {
    throw new Error(`The brief names profile "${profile}", but ${profileFile} does not exist`);
  }
  return withProfile(loadTree(), profileFile ? readFileSync(profileFile, 'utf8') : null);
}

/** Runs the check for a work root, reading GRILL-LOG.md and PRESENTATION-BRIEF.md from it. */
export function checkGrillAt(root, gate) {
  const read = (name) => {
    const file = path.join(root, name);
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
  const log = read('GRILL-LOG.md');
  if (log === null) return { errors: [`No GRILL-LOG.md in ${root}`], warnings: [], covered: 0, required: 0 };
  const brief = read('PRESENTATION-BRIEF.md');
  return checkGrill({ log, gate, brief, tree: treeFor(brief) });
}

function main(argv) {
  const [root, gate] = argv.filter((arg) => !arg.startsWith('--'));
  if (!root || !gate) {
    process.stderr.write('Usage: grill-check.mjs <work-root> <gate> [--json]\n');
    process.exit(1);
  }
  const report = checkGrillAt(root, gate);
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
