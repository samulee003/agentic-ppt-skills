import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import {
  briefMinutes,
  checkStoryboard,
  isTopicLabel,
  parseMinutes,
} from '../skills/make-presentation/scripts/storyboard-check.mjs';

const execFileAsync = promisify(execFile);
const script = path.resolve(
  new URL('../skills/make-presentation/scripts/storyboard-check.mjs', import.meta.url).pathname,
);

const header = `| Slide | Action title | Archetype | Audience job | Evidence ID | Speaker transition | Time | Main / backup |
| --- | --- | --- | --- | --- | --- | --- | --- |`;
const row = (n, title, archetype, evidence = '', time = '1', range = 'main') =>
  `| ${n} | ${title} | ${archetype} | job | ${evidence} | next | ${time} | ${range} |`;
const ledger = `| Claim ID | Claim |\n| --- | --- |\n| E1 | Churn rose |\n| E2 | Price changed |`;
const brief = '## Constraints\n\n- Time (talk length, Q&A length): 10 min talk, 5 min Q&A\n';

test('a good storyboard passes', () => {
  const storyboard = [
    header,
    row(1, 'Churn rose four points after the March price change', 'data', 'E1, E2', '3'),
    row(2, 'Pricing', 'section', '', '0:30'),
    row(3, '價格調整是流失率上升的主要原因', 'hero', 'E2', '3'),
    row(4, 'Three levers can win back the lost customers', 'cards', '', '2'),
    row(5, 'Full regional breakdown', 'data', 'E1', '2', 'backup'),
  ].join('\n');
  const report = checkStoryboard({ storyboard, ledger, brief });
  assert.deepEqual(report.errors, []);
  assert.equal(report.mainMinutes, 8.5);
});

test('topic labels, bad archetypes, runs, unknown evidence, and overtime fail', () => {
  const storyboard = [
    header,
    row(1, 'Churn', 'data', 'E1', '4'),
    row(2, 'Revenue fell in every region last quarter', 'cards', 'E9', '3'),
    row(3, 'Support costs doubled while satisfaction dropped', 'cards', '', '3'),
    row(4, 'We should test a cheaper annual plan first', 'cards', '', '2'),
    row(5, 'Our next step is a pilot in two markets', 'chart', '', '1'),
  ].join('\n');
  const { errors } = checkStoryboard({ storyboard, ledger, brief });
  assert.ok(errors.some((e) => /Slide 1: "Churn" reads as a topic label/.test(e)));
  assert.ok(errors.some((e) => /Slide 2: evidence ID "E9"/.test(e)));
  assert.ok(errors.some((e) => /Slide 4: third consecutive "cards"/.test(e)));
  assert.ok(errors.some((e) => /Slide 5: unknown archetype "chart"/.test(e)));
  assert.ok(errors.some((e) => /Main talk runs 13\.0 min, over the 10 min/.test(e)));
});

test('old storyboards without the new columns are rejected', () => {
  const storyboard = `| Slide | Audience job | Main claim |\n| --- | --- | --- |\n| 1 | x | y |`;
  const { errors } = checkStoryboard({ storyboard });
  assert.ok(errors.includes('STORYBOARD.md is missing the "Action title" column'));
  assert.ok(errors.includes('STORYBOARD.md is missing the "Archetype" column'));
});

test('helpers parse titles, times, and talk length', () => {
  assert.equal(isTopicLabel('Q3 results'), true);
  assert.equal(isTopicLabel('Agenda:'), true);
  assert.equal(isTopicLabel('流失率'), true);
  assert.equal(isTopicLabel('Mobile now drives most orders'), false);
  assert.equal(parseMinutes('1:30'), 1.5);
  assert.equal(parseMinutes('90s'), 1.5);
  assert.equal(parseMinutes('2 分鐘'), 2);
  assert.equal(parseMinutes('soon'), null);
  assert.equal(briefMinutes('- Time: 45 分鐘'), 45);
  assert.equal(briefMinutes('- Time: 1.5 hours'), 90);
  assert.equal(briefMinutes('- Tone: calm'), null);
});

test('CLI reads the work root and exits 1 on errors', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'storyboard-check-'));
  try {
    await writeFile(path.join(root, 'STORYBOARD.md'), [header, row(1, 'Intro', 'hero')].join('\n'));
    await assert.rejects(execFileAsync(process.execPath, [script, root]), (err) => {
      assert.match(err.stdout, /reads as a topic label/);
      return true;
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
