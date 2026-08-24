import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const statusScript = path.resolve(
  new URL('../skills/make-presentation/scripts/status.mjs', import.meta.url).pathname,
);

async function runStatus(root, ...args) {
  return execFileAsync(process.execPath, [statusScript, args[0], root, ...args.slice(1)], {
    cwd: root,
  });
}

async function withWorkspace(callback) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'agentic-ppt-status-'));
  try {
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('init creates a valid pipeline and next reports the first gate', async () => {
  await withWorkspace(async (root) => {
    const { stdout } = await runStatus(root, 'init', 'demo-deck', './notes');
    assert.match(stdout, /init ok/);

    const status = await readFile(path.join(root, 'STATUS.md'), 'utf8');
    assert.match(status, /"schemaVersion": 3/);
    assert.match(status, /"sourceRoot": ".*notes"/);

    const next = await runStatus(root, 'next');
    assert.equal(next.stdout.trim(), 'source-intake');
  });
});

test('set records provenance and allows the gate to pass', async () => {
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    await runStatus(
      root,
      'set',
      'source-intake',
      'passed',
      'Inventory complete',
      '--artifact',
      'SOURCE-INVENTORY.md',
      '--input',
      'notes/raw.md',
      '--decision',
      'Use research-enhanced mode',
    );

    const status = JSON.parse(
      (await readFile(path.join(root, 'STATUS.md'), 'utf8')).match(
        /<!-- presentation-status:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- presentation-status:end -->/,
      )[1],
    );
    assert.equal(status.gates['source-intake'].status, 'passed');
    assert.deepEqual(status.gates['source-intake'].artifacts, ['SOURCE-INVENTORY.md']);
    assert.deepEqual(status.gates['source-intake'].inputs, ['notes/raw.md']);
    assert.deepEqual(status.gates['source-intake'].decisions, ['Use research-enhanced mode']);
    assert.equal((await runStatus(root, 'next')).stdout.trim(), 'product-grill');
  });
});

test('invalidate cascades from a gate and selective invalidation does not cascade', async () => {
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    for (const gate of ['source-intake', 'product-grill', 'evidence']) {
      await runStatus(root, 'set', gate, 'passed', 'Reviewed', '--artifact', `${gate}.md`);
    }

    await runStatus(root, 'invalidate', 'product-grill', 'Brief changed');
    let status = JSON.parse(
      (await readFile(path.join(root, 'STATUS.md'), 'utf8')).match(
        /<!-- presentation-status:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- presentation-status:end -->/,
      )[1],
    );
    assert.equal(status.gates['source-intake'].status, 'passed');
    assert.equal(status.gates['product-grill'].status, 'needs_revision');
    assert.equal(status.gates.evidence.status, 'needs_revision');

    await runStatus(root, 'invalidate', 'evidence', 'Evidence refreshed', '--selective');
    status = JSON.parse(
      (await readFile(path.join(root, 'STATUS.md'), 'utf8')).match(
        /<!-- presentation-status:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- presentation-status:end -->/,
      )[1],
    );
    assert.equal(status.gates.evidence.status, 'needs_revision');
    assert.equal(status.gates['story-architecture'].status, 'pending');
  });
});

test('passed results require an artifact and invalid result names fail', async () => {
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');

    await assert.rejects(
      runStatus(root, 'result', 'source-intake', 'passed', 'Missing artifact'),
      (error) => {
        assert.match(error.stderr, /Passed result requires at least one --artifact/);
        return true;
      },
    );
    await assert.rejects(
      runStatus(root, 'result', 'source-intake', 'unknown', 'Bad result'),
      (error) => {
        assert.match(error.stderr, /Invalid result "unknown"/);
        return true;
      },
    );
  });
});
