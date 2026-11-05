import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { checkGrill, loadTree } from '../skills/make-presentation/scripts/grill-check.mjs';

const execFileAsync = promisify(execFile);
const repo = path.resolve(new URL('..', import.meta.url).pathname);
const script = path.join(repo, 'skills/make-presentation/scripts/grill-check.mjs');

const header = `| Phase | Node | Question | Recommended answer | Decision | Status | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- |`;
const row = (phase, node, status = 'Decided', reason = 'User answered') =>
  `| ${phase} | ${node} | q | r | d | ${status} | ${reason} | — |`;
const tree = loadTree();
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
  rows.push(row('product-grill', 'visual', 'Assumed', 'Reversible; seen on the prototype'));
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
