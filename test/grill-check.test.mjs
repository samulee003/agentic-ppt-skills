import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { checkGrill, loadTree } from '../skills/make-presentation/scripts/grill-check.mjs';

const execFileAsync = promisify(execFile);
const repo = path.resolve(new URL('..', import.meta.url).pathname);
const script = path.join(repo, 'skills/make-presentation/scripts/grill-check.mjs');

const tree = loadTree();
const ROUND = { 'product-grill': 'P1', 'story-grill': 'S1', 'deck-prototype': 'V1', 'stage-grill': 'T1' };
const PROFILE_NODES = { 'product-grill': ['interaction-format'], 'stage-grill': ['transfer', 'framing'] };
// One recorded round per phase that asked every node, so tests can focus on statuses.
const header = `## Rounds

| Round | Phase | Nodes asked | User reply (verbatim) |
| --- | --- | --- | --- |
${Object.entries(ROUND)
  .map(([phase, id]) => `| ${id} | ${phase} | ${[...tree[phase].map((n) => n.id), ...(PROFILE_NODES[phase] ?? [])].join(', ')} | Yes to all. |`)
  .join('\n')}

## Decisions

| Phase | Node | Question | Recommended answer | Decision | Status | Round | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |`;
const row = (phase, node, status = 'Decided', reason = 'Source: the notes', round = status === 'Decided' ? ROUND[phase] : '') =>
  `| ${phase} | ${node} | q | r | d | ${status} | ${round} | ${reason} | — |`;
const all = (phase, status = 'Decided') => tree[phase].map((n) => row(phase, n.id, status));

test('the grill tree is well formed: unique ids, known deps, no cycles', () => {
  for (const [phase, nodes] of Object.entries(tree)) {
    const ids = nodes.map((n) => n.id);
    assert.equal(new Set(ids).size, ids.length, `${phase} ids are unique`);
    for (const node of nodes) {
      for (const dep of node.deps) assert.ok(ids.includes(dep), `${phase}/${node.id} dep ${dep}`);
      assert.ok(node.question.endsWith('?'), `${phase}/${node.id} question ends with ?`);
    }
    const settled = new Set();
    let progress = true;
    while (progress) {
      progress = false;
      for (const node of nodes) {
        if (!settled.has(node.id) && node.deps.every((d) => settled.has(d))) {
          settled.add(node.id);
          progress = true;
        }
      }
    }
    assert.equal(settled.size, ids.length, `${phase} has no dependency cycle`);
  }
});

test('missing nodes, Deferred, and reasonless Assumed rows are errors', () => {
  const log = [header, row('product-grill', 'audience'), row('product-grill', 'outcome', 'Deferred'), row('product-grill', 'visual', 'Assumed', '')].join('\n');
  const { errors } = checkGrill({ log, gate: 'product-grill' });
  assert.ok(errors.some((e) => /product-grill\/deck-type: not settled\. Ask: Is this a decision/.test(e)));
  assert.ok(errors.some((e) => /product-grill\/outcome: still Deferred/.test(e)));
  assert.ok(errors.some((e) => /Assumed without a reason/.test(e)));
});

test('a later row replaces an earlier one for the same node', () => {
  const rows = all('product-grill');
  rows.push(row('product-grill', 'outcome', 'Deferred'), row('product-grill', 'outcome', 'Decided'));
  assert.deepEqual(checkGrill({ log: [header, ...rows].join('\n'), gate: 'product-grill' }).errors, []);
});

test('load-bearing assumptions warn at their gate and block production-qa', () => {
  const rows = [...all('product-grill'), ...all('story-grill'), ...all('deck-prototype'), ...all('stage-grill')];
  rows.push(row('product-grill', 'audience', 'Assumed', 'Headless run; inferred from the notes'));
  const log = [header, ...rows].join('\n');
  const atGate = checkGrill({ log, gate: 'product-grill' });
  assert.deepEqual(atGate.errors, []);
  assert.ok(atGate.warnings.some((w) => /audience: load-bearing and only Assumed/.test(w)));
  const atQa = checkGrill({ log, gate: 'production-qa' });
  assert.ok(atQa.errors.some((e) => /audience: load-bearing .* before delivery/.test(e)));
  // A reversible node may stay Assumed.
  rows.pop();
  rows.push(row('product-grill', 'brand', 'Assumed', 'Reversible; no template mentioned'));
  assert.deepEqual(checkGrill({ log: [header, ...rows].join('\n'), gate: 'production-qa' }).errors, []);
});

test('the attention-reset node applies only to talks over 30 minutes', () => {
  const log = [header, ...all('stage-grill').filter((r) => !r.includes('| resets |'))].join('\n');
  assert.deepEqual(checkGrill({ log, gate: 'stage-grill', brief: '- Time: 20 min' }).errors, []);
  const long = checkGrill({ log, gate: 'stage-grill', brief: '- Time: 45 min' });
  assert.ok(long.errors.some((e) => /stage-grill\/resets: not settled/.test(e)));
});

test('old logs without Node/Status columns and bad statuses are rejected', () => {
  const old = '| Phase | Question | Decision |\n| --- | --- | --- |\n| product-grill | q | d |';
  assert.match(checkGrill({ log: old, gate: 'product-grill' }).errors[0], /needs "Node" and "Status" columns/);
  const bad = [header, row('product-grill', 'audience', 'Maybe')].join('\n');
  assert.ok(checkGrill({ log: bad, gate: 'product-grill' }).errors.some((e) => /status "Maybe"/.test(e)));
  assert.throws(() => checkGrill({ log: bad, gate: 'evidence' }), /Unknown gate "evidence"/);
});

test('the bundled example is fully grilled for every gate', async () => {
  const work = path.join(repo, 'examples/agentic-coding-anatomy/work');
  for (const gate of ['product-grill', 'story-grill', 'deck-prototype', 'stage-grill', 'production-qa']) {
    const { stdout } = await execFileAsync(process.execPath, [script, work, gate]);
    assert.match(stdout, /grill-check: no errors/, gate);
  }
});

test('a profile can add required grill nodes', async () => {
  const { readFile } = await import('node:fs/promises');
  const { profileId, withProfile } = await import('../skills/make-presentation/scripts/grill-check.mjs');
  assert.equal(profileId('- Profile: `training-zh-hant`'), 'training-zh-hant');
  assert.equal(profileId('- Profile: (`default`, `training-zh-hant`, or another)'), null);
  const profile = await readFile(path.join(repo, 'skills/make-presentation/profiles/training-zh-hant.md'), 'utf8');
  const merged = withProfile(tree, profile);
  const log = [header, ...merged['product-grill'].filter((n) => n.id !== 'interaction-format').map((n) => row('product-grill', n.id))].join('\n');
  const { errors } = checkGrill({ log, gate: 'product-grill', tree: merged });
  assert.ok(errors.some((e) => /product-grill\/interaction-format: not settled/.test(e)));
  assert.deepEqual(checkGrill({ log, gate: 'product-grill' }).errors, [], 'default tree does not need it');
});

test('status values are matched without regard to case or decoration', async () => {
  const { normalizeStatus } = await import('../skills/make-presentation/scripts/grill-check.mjs');
  assert.equal(normalizeStatus('decided'), 'Decided');
  assert.equal(normalizeStatus('**Assumed** ⚠️'), 'Assumed');
  assert.equal(normalizeStatus('maybe'), 'maybe');
  const log = [header, ...tree['story-grill'].map((n) => `| story-grill | ${n.id} | q | r | d | decided | S1 | Source: ok | — |`)].join('\n');
  assert.deepEqual(checkGrill({ log, gate: 'story-grill' }).errors, []);
});

test('the product grill needs at most three rounds, with or without the training profile', async () => {
  const { readFile } = await import('node:fs/promises');
  const { withProfile } = await import('../skills/make-presentation/scripts/grill-check.mjs');
  const rounds = (nodes) => {
    const done = new Set();
    let count = 0;
    while (done.size < nodes.length) {
      const frontier = nodes.filter((n) => !done.has(n.id) && n.deps.every((d) => done.has(d)));
      assert.ok(frontier.length > 0, 'no cycle');
      frontier.forEach((n) => done.add(n.id));
      count += 1;
    }
    return count;
  };
  const profile = await readFile(path.join(repo, 'skills/make-presentation/profiles/training-zh-hant.md'), 'utf8');
  assert.ok(rounds(tree['product-grill']) <= 3, 'shared tree');
  assert.ok(rounds(withProfile(tree, profile)['product-grill']) <= 3, 'with training-zh-hant');
});

test('a Decided row must name a recorded round that asked it, with the reply on record', () => {
  const rows = all('story-grill');
  rows[0] = row('story-grill', 'opposition', 'Decided', 'from the notes', '');
  rows[1] = row('story-grill', 'headline-test', 'Decided', 'ok', 'S9');
  rows[2] = row('story-grill', 'counter-evidence', 'Decided', 'ok', 'P1');
  const { errors } = checkGrill({ log: [header, ...rows].join('\n'), gate: 'story-grill' });
  assert.ok(errors.some((e) => /opposition\): Decided without a round; if the user was not asked, it is Assumed/.test(e)));
  assert.ok(errors.some((e) => /headline-test\): round S9 is not in the Rounds table/.test(e)));
  assert.ok(errors.some((e) => /counter-evidence\): round P1 did not ask this node/.test(e)));
  const silent = header.replace('| S1 | story-grill |', '| S1 | story-grill |').replace(/\| Yes to all\. \|\n\| V1/, '| — |\n| V1');
  assert.ok(checkGrill({ log: [silent, ...all('story-grill')].join('\n'), gate: 'story-grill' }).errors.some((e) => /Round S1: no user reply recorded/.test(e)));
  const noRounds = `| Phase | Node | Question | Recommended answer | Decision | Status | Reason | Invalidates |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| story-grill | opposition | q | r | d | Decided | ok | — |`;
  assert.ok(checkGrill({ log: noRounds, gate: 'story-grill' }).errors.some((e) => /needs a "Round" column and a Rounds table/.test(e)));
});

test('visual direction, must-avoid, imagery, and slide budget are load-bearing', () => {
  const ids = (phase) => tree[phase].filter((n) => n.loadBearing).map((n) => n.id);
  for (const id of ['visual', 'must-avoid', 'imagery']) assert.ok(ids('product-grill').includes(id), id);
  assert.ok(ids('story-grill').includes('slide-budget'));
  assert.ok(ids('deck-prototype').includes('visual-confirm'));
});

test('a load-bearing node asked in the same round as its prerequisite fails', () => {
  const log = `## Rounds

| Round | Phase | Nodes asked | User reply (verbatim) |
| --- | --- | --- | --- |
| P1 | product-grill | deck-type, audience, outcome, brand | 全套授課投影片（推薦） |
| P2 | product-grill | promise | Yes |

## Decisions

| Phase | Node | Question | Recommended answer | Decision | Status | Round | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| product-grill | deck-type | q | r | d | Decided | P1 | User answered | — |
| product-grill | audience | q | r | d | Decided | P1 | User answered | — |
| product-grill | outcome | q | r | d | Decided | P1 | Bundled into the premise | — |
| product-grill | brand | q | r | d | Decided | P1 | User answered | — |
| product-grill | promise | q | r | d | Decided | P2 | User answered | — |`;
  const { errors } = checkGrill({ log, gate: 'product-grill' });
  assert.ok(errors.some((e) => /product-grill\/outcome\): asked in round P1 together with its prerequisite "deck-type"/.test(e)));
  assert.ok(!errors.some((e) => /\/promise\): asked in round/.test(e)), 'promise in a later round is fine');
  assert.ok(!errors.some((e) => /\/brand\): asked in round/.test(e)), 'brand has no prerequisite');
  const sourced = log.replace('Bundled into the premise', 'Source: the client email, 3 May');
  assert.ok(!checkGrill({ log: sourced, gate: 'product-grill' }).errors.some((e) => /together with its prerequisite/.test(e)));
});
