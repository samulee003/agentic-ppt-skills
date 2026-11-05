import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { checkInterrogation, normalize } from '../skills/make-presentation/scripts/interrogation-check.mjs';

const execFileAsync = promisify(execFile);
const repo = path.resolve(new URL('..', import.meta.url).pathname);
const script = path.join(repo, 'skills/make-presentation/scripts/interrogation-check.mjs');

const corpus = 'Churn rose four points after the March price change. Mobile is 62% of orders.';
const claimIds = new Set(['E1']);
const round = (adversaries, rows) => `## Round: story-grill

### Adversaries

${adversaries.map((a) => `- ${a}: 1 raised, 1 kept`).join('\n')}

### Findings

| ID | Adversary | Slide | Quote | Proof type | Proof | Verdict | Bucket | Resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}
`;
const cast = ['the CFO', 'the operator', 'the newcomer'];

test('a proven, bucketed, resolved finding passes', () => {
  const md = round(cast, [
    '| F1 | the CFO | 2 | Churn rose four points after the March price change | ledger | `E1` has no denominator | kept | Act on | Added the base in the note |',
    '| F2 | the newcomer | 3 | Mobile is 62% of orders | contradiction | Slide 5 says "Churn rose four points" without a period | kept | Noted | |',
    '| F3 | the operator | 4 | something never written | unanswered | n/a | dropped | | |',
  ]);
  assert.deepEqual(checkInterrogation({ interrogation: md, corpus, claimIds }).errors, []);
});

test('invented quotes, unknown claim IDs, missing buckets and resolutions fail', () => {
  const md = round(cast, [
    '| F1 | the CFO | 2 | Revenue tripled | arithmetic | 3 × 2 ≠ 5 | kept | Act on | |',
    '| F2 | the CFO | 2 | Churn rose four points | ledger | `E9` is missing | kept | Consider | |',
    '| F3 | the newcomer | 3 | Mobile is 62% of orders | contradiction | elsewhere it differs | kept | | |',
    '| F4 | the operator | 4 | Mobile is 62% of orders | vibes | feels off | kept | Noted | |',
    '| F5 | the operator | 4 | Mobile is 62% of orders | check | x | maybe | | |',
  ]);
  const { errors } = checkInterrogation({ interrogation: md, corpus, claimIds });
  assert.ok(errors.some((e) => /F1: quote "Revenue tripled" is not in the deck/.test(e)));
  assert.ok(errors.some((e) => /F1: Act on without a resolution/.test(e)));
  assert.ok(errors.some((e) => /F2: ledger proof names no claim ID/.test(e)));
  assert.ok(errors.some((e) => /F3: contradiction proof needs the second quote/.test(e)));
  assert.ok(errors.some((e) => /F3: kept findings need a bucket/.test(e)));
  assert.ok(errors.some((e) => /F4: proof type "vibes"/.test(e)));
  assert.ok(errors.some((e) => /F5: verdict must be "kept" or "dropped"/.test(e)));
});

test('fewer than three adversaries, or no newcomer, fails', () => {
  const md = round(['the CFO', 'the operator'], []);
  const { errors } = checkInterrogation({ interrogation: md, corpus, claimIds });
  assert.ok(errors.some((e) => /at least three adversaries \(found 2\)/.test(e)));
  assert.ok(errors.some((e) => /the newcomer must be one of the adversaries/.test(e)));
  assert.ok(checkInterrogation({ interrogation: md, corpus, claimIds, round: 'stage-grill' }).errors.some((e) => /no "## Round: stage-grill"/.test(e)));
});

test('quote matching ignores curly quotes, markdown, and spacing', () => {
  assert.equal(normalize('“Churn”   *rose*'), normalize('"churn" rose'));
});

test('the bundled example interrogation verifies against its artifacts and exported deck', async () => {
  const work = path.join(repo, 'examples/agentic-coding-anatomy/work');
  const pptx = path.join(repo, 'examples/agentic-coding-anatomy-claude-pptx/exports/agentic-coding-anatomy.pptx');
  const { stdout } = await execFileAsync(process.execPath, [script, work, `--pptx=${pptx}`]);
  assert.match(stdout, /2 round\(s\), 7 kept finding\(s\)/);
  assert.match(stdout, /interrogation-check: no errors/);
});

test('quotes are verified against this deck only, never another deck in exports/', async () => {
  const { mkdtemp, mkdir, copyFile, writeFile, rm } = await import('node:fs/promises');
  const os = await import('node:os');
  const { loadCorpus } = await import('../skills/make-presentation/scripts/interrogation-check.mjs');
  const dir = await mkdtemp(path.join(os.tmpdir(), 'interrogate-'));
  try {
    const work = path.join(dir, 'presentation-work', 'q3-review');
    await mkdir(work, { recursive: true });
    await mkdir(path.join(dir, 'exports'));
    await writeFile(path.join(work, 'STATUS.md'), '<!-- presentation-status:start -->\n```json\n{"deckId":"q3-review"}\n```\n');
    const other = path.join(repo, 'examples/agentic-coding-anatomy-claude-pptx/exports/agentic-coding-anatomy.pptx');
    await copyFile(other, path.join(dir, 'exports', 'q2-review.pptx'));
    assert.doesNotMatch(loadCorpus(work), /Agentic coding is a loop/);
    await copyFile(other, path.join(dir, 'exports', 'q3-review.pptx'));
    assert.match(loadCorpus(work), /Agentic coding is a loop/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
