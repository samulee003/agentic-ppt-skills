import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { checkLedger } from '../skills/make-presentation/scripts/ledger-check.mjs';
import { checkPlan, overlap, squash } from '../skills/make-presentation/scripts/plan-check.mjs';
import { checkSources, looksLikePath } from '../skills/make-presentation/scripts/source-check.mjs';

const execFileAsync = promisify(execFile);
const repo = path.resolve(new URL('..', import.meta.url).pathname);
const scripts = path.join(repo, 'skills/make-presentation/scripts');
const work = path.join(repo, 'examples/agentic-coding-anatomy/work');

const ledger = `| Claim ID | Claim | Source | Source type | Date | Safety |
| --- | --- | --- | --- | --- | --- |
| E1 | Churn rose 4 points | CRM export | primary | 2026-03 | A |
| E2 | Competitors cut prices | blog post | secondary | 2025 | C |
| E3 | Price is the only cause | — | opinion | | D |

## Assets

| Asset ID | File | Kind | Source | Licence | Attribution text | Used on slide |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | hero.jpg | photo | Unsplash | Unsplash licence | Photo by X | 1 |
| A2 | chart.png | icon | unknown | | | 2 |`;
const board = (rows) => `| Slide | Action title | Archetype | Audience job | Evidence ID | Speaker transition | Time | Main / backup |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}`;

test('ledger-check: main slides may cite only A/B claims; D nowhere; numbers need evidence', () => {
  const storyboard = board([
    '| 1 | Churn rose 4 points after the March price change | data | j | E1 | t | 1 | main |',
    '| 2 | Competitors moved first on price | cards | j | E2 | t | 1 | main |',
    '| 3 | Price is the whole story | hero | j | E3 | t | 1 | backup |',
    '| 4 | Revenue fell 12% in Q3 | data | j | — | t | 1 | main |',
    '| 5 | Regional detail | data | j | E2 | t | 1 | backup |',
  ]);
  const { errors, warnings } = checkLedger({ ledger, storyboard });
  assert.ok(errors.some((e) => /Slide 2: cites E2, a safety C claim, in the main talk/.test(e)));
  assert.ok(errors.some((e) => /Slide 3: cites E3, a safety D claim/.test(e)));
  assert.ok(!errors.some((e) => /Slide 5/.test(e)), 'C in backup is allowed');
  assert.ok(errors.some((e) => /Ledger E3: no source/.test(e)));
  assert.ok(errors.some((e) => /Asset A2: no licence recorded/.test(e)));
  assert.ok(warnings.some((w) => /Slide 4: the title states a number .* cites no evidence/.test(w)));
});

test('ledger-check: research-enhanced mode requires dates and safety levels; IDs are unique', () => {
  const md = `| Claim ID | Claim | Source | Date | Safety |
| --- | --- | --- | --- | --- |
| E1 | x | paper | | |
| E1 | y | paper | 2024 | Z |`;
  const { errors } = checkLedger({ ledger: md, mode: 'research-enhanced' });
  assert.ok(errors.some((e) => /E1: research-enhanced claims need a date/.test(e)));
  assert.ok(errors.some((e) => /E1: research-enhanced claims need an A\/B\/C\/D safety/.test(e)));
  assert.ok(errors.some((e) => /"E1" is used twice/.test(e)));
  assert.ok(errors.some((e) => /safety "Z" is not A, B, C, or D/.test(e)));
  assert.deepEqual(checkLedger({ ledger: md.replace(/\| E1 \| y.*$/m, ''), mode: 'general' }).errors, []);
});

test('plan-check: slide count, rewritten titles, and drifted notes are caught', () => {
  const storyboard = board([
    '| 1 | Churn rose four points after the price change | data | j | E1 | t | 1 | main |',
    '| 2 | Three levers win customers back | cards | j | — | t | 1 | main |',
  ]);
  const script = `| Page | Approved wording |
| --- | --- |
| 1 | Churn went up right after the March change, and the timing points to price. |
| 2 | Here are three levers we can pull this quarter. |`;
  const good = [
    { text: 'DATA Churn rose four points after the price change Source: CRM', notes: 'Churn went up right after the March change, and the timing points to price.' },
    { text: 'Three levers win customers back', notes: 'Here are three levers we can pull this quarter.' },
  ];
  assert.deepEqual(checkPlan({ storyboard, script, slides: good }).errors, []);
  const drifted = [
    { text: 'Our churn story', notes: 'Welcome everyone to the update.' },
    good[1],
    { text: 'Extra slide the tool added', notes: '' },
  ];
  const { errors } = checkPlan({ storyboard, script, slides: drifted });
  assert.ok(errors.some((e) => /The deck has 3 slide\(s\) but STORYBOARD\.md plans 2/.test(e)));
  assert.ok(errors.some((e) => /Slide 1: the storyboard title .* is not on the slide/.test(e)));
  assert.ok(errors.some((e) => /Slide 1: the notes keep \d+% of the approved wording/.test(e)));
});

test('plan-check helpers ignore punctuation, quotes, and CJK spacing', () => {
  assert.equal(squash("Human review should match each action’s scope"), squash("Human review should match each action's scope"));
  assert.equal(overlap('價格調整是主因', '我們認為 價格 調整 是 主因'), 1);
});

test('plan-check passes the showcase deck against its storyboard and script', async () => {
  const pptx = path.join(repo, 'examples/agentic-coding-anatomy-claude-pptx/exports/agentic-coding-anatomy.pptx');
  const { stdout } = await execFileAsync(process.execPath, [path.join(scripts, 'plan-check.mjs'), work, `--pptx=${pptx}`]);
  assert.match(stdout, /plan-check: no errors/);
});

test('source-check: listed paths must exist; URLs, descriptions, and Missing rows are skipped', async () => {
  assert.equal(looksLikePath('raw_notes.md'), true);
  assert.equal(looksLikePath('raw_notes.md benchmark section'), false);
  assert.equal(looksLikePath('https://arxiv.org/abs/2310.06770'), false);
  const dir = await mkdtemp(path.join(os.tmpdir(), 'source-check-'));
  try {
    await mkdir(path.join(dir, 'notes'));
    await writeFile(path.join(dir, 'notes', 'raw.md'), 'x');
    const inventory = `## File map

| Path | Type |
| --- | --- |
| notes/raw.md | notes |
| notes/gone.pdf | report |

## Missing

| Needed item | Path |
| --- | --- |
| interview | notes/interview.docx |`;
    const { errors, checked } = checkSources({ inventory, bases: [dir] });
    assert.equal(checked, 2);
    assert.deepEqual(errors.length, 1);
    assert.match(errors[0], /lists "notes\/gone\.pdf"/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('ledger-check and source-check pass the bundled example', async () => {
  for (const name of ['ledger-check.mjs', 'source-check.mjs']) {
    const { stdout } = await execFileAsync(process.execPath, [path.join(scripts, name), work]);
    assert.match(stdout, /: no errors/, name);
  }
});
