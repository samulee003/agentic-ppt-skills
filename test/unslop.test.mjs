import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { scanText } from '../skills/make-presentation/scripts/unslop-check.mjs';

const execFileAsync = promisify(execFile);
const script = new URL('../skills/make-presentation/scripts/unslop-check.mjs', import.meta.url)
  .pathname;

test('scanText flags English and Chinese tells and ignores code fences', () => {
  const text = [
    'This deck serves as a pivotal testament, not just fast but reliable.',
    '值得注意的是，這不僅僅是工具，更是夥伴。',
    '```',
    'crucial inside a fence',
    '```',
    'Revenue grew 12% in Q3.',
  ].join('\n');
  const rules = scanText(text).map((finding) => `${finding.line}:${finding.rule}`);
  assert.ok(rules.includes('1:7'));
  assert.ok(rules.includes('1:8'));
  assert.ok(rules.includes('1:9'));
  assert.ok(rules.includes('2:zh-1'));
  assert.ok(rules.includes('2:zh-2'));
  assert.equal(
    rules.some((entry) => entry.startsWith('4:') || entry.startsWith('6:')),
    false,
  );
});

test('--strict exits 1 on findings and 0 on clean text', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'agentic-ppt-unslop-'));
  try {
    const dirty = path.join(root, 'dirty.md');
    const clean = path.join(root, 'clean.md');
    await writeFile(dirty, 'We leverage a pivotal method.\n');
    await writeFile(clean, 'Revenue grew 12% in Q3.\n');
    await assert.rejects(execFileAsync(process.execPath, [script, dirty, '--strict']), (error) => {
      assert.equal(error.code, 1);
      return true;
    });
    const result = await execFileAsync(process.execPath, [script, clean, '--strict']);
    assert.match(result.stdout, /0 finding/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
