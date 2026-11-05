import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { checkTheme, contrast, parseTheme } from '../skills/make-presentation/scripts/theme-check.mjs';

const execFileAsync = promisify(execFile);
const script = path.resolve(
  new URL('../skills/make-presentation/scripts/theme-check.mjs', import.meta.url).pathname,
);

test('every shipped theme passes its contrast contract', async () => {
  const { stdout } = await execFileAsync(process.execPath, [script]);
  for (const id of ['aurora', 'bright-sans', 'editorial-minimal', 'sticker-pop']) {
    assert.match(stdout, new RegExp(`ok .*${id}\\.md`));
  }
});

test('contrast matches the WCAG formula', () => {
  assert.equal(contrast('#000000', '#FFFFFF').toFixed(1), '21.0');
  assert.equal(contrast('#777777', '#FFFFFF').toFixed(2), '4.48');
});

test('low-contrast body pairs, bad colours, and missing names fail', () => {
  const errors = checkTheme({
    id: 'Bad Theme',
    palette: { background: '#FFFFFF', text: '#999999', accent: 'orange' },
    bodyPairs: [['text', 'background'], ['ink', 'background']],
    largeOnlyPairs: [['accent', 'background']],
  });
  assert.ok(errors.some((e) => /id must be kebab-case/.test(e)));
  assert.ok(errors.some((e) => /body pair text\/background is 2\.85:1/.test(e)));
  assert.ok(errors.some((e) => /palette\.accent is not a #RRGGBB/.test(e)));
  assert.ok(errors.some((e) => /ink\/background names a colour missing/.test(e)));
  assert.throws(() => parseTheme('# no block'), /missing a ```json theme block/);
});
