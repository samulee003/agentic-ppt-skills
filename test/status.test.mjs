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

// Most tests are about state transitions, so their artifacts are created as
// placeholders first. The missing-artifact test uses runStatus directly.
async function runStatusWithArtifacts(root, ...args) {
  const { mkdir, writeFile } = await import('node:fs/promises');
  for (let i = 0; i < args.length - 1; i += 1) {
    if (args[i] === '--artifact') {
      const file = path.resolve(root, args[i + 1]);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, 'placeholder', { flag: 'a' });
    }
  }
  return runStatus(root, ...args);
}

// The work root is the deck's own folder, named after the deck id.
async function withWorkspace(callback) {
  const base = await mkdtemp(path.join(os.tmpdir(), 'agentic-ppt-status-'));
  const root = path.join(base, 'demo-deck');
  const { mkdir } = await import('node:fs/promises');
  await mkdir(root);
  try {
    await callback(root);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

test('init creates a valid pipeline and next reports the first gate', async () => {
  await withWorkspace(async (root) => {
    const { stdout } = await runStatus(root, 'init', 'demo-deck', './notes');
    assert.match(stdout, /init ok/);

    const status = await readFile(path.join(root, 'STATUS.md'), 'utf8');
    assert.match(status, /"schemaVersion": 3/);
    assert.match(status, /"sourceRoot": "notes"/, 'stored relative to the work root');

    const next = await runStatus(root, 'next');
    assert.equal(next.stdout.trim(), 'source-intake');
  });
});

test('set records provenance and allows the gate to pass', async () => {
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    await runStatusWithArtifacts(
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
      await runStatusWithArtifacts(root, 'set', gate, 'passed', 'Reviewed', '--artifact', `${gate}.md`);
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
      runStatusWithArtifacts(root, 'result', 'source-intake', 'passed', 'Missing artifact'),
      (error) => {
        assert.match(error.stderr, /Passed result requires at least one --artifact/);
        return true;
      },
    );
    await assert.rejects(
      runStatusWithArtifacts(root, 'result', 'source-intake', 'unknown', 'Bad result'),
      (error) => {
        assert.match(error.stderr, /Invalid result "unknown"/);
        return true;
      },
    );
  });
});

test('fast-track consolidates paired gates only when their grill checks pass', async () => {
  const { writeFile } = await import('node:fs/promises');
  const { loadTree } = await import('../skills/make-presentation/scripts/grill-check.mjs');
  const tree = loadTree();
  const rows = (phase) =>
    tree[phase].map((n) => `| ${phase} | ${n.id} | q | r | d | Decided | ${phase} | Source: the notes | — |`);
  const log = (phases) =>
    [
      '| Round | Phase | Nodes asked | User reply (verbatim) |',
      '| --- | --- | --- | --- |',
      ...phases.map((phase) => `| ${phase.toUpperCase()} | ${phase} | ${tree[phase].map((n) => n.id).join(', ')} | Yes to all. |`),
      '',
      '| Phase | Node | Question | Recommended answer | Decision | Status | Round | Reason | Invalidates |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
      ...phases.flatMap(rows),
    ].join('\n');

  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes', 'fast-track', 'Sprint review');
    // No grilling yet: passing source-intake must not silently pass product-grill.
    await assert.rejects(
      runStatusWithArtifacts(root, 'result', 'source-intake', 'passed', 'Unified brief', '--artifact', 'PRESENTATION-BRIEF.md'),
      (err) => {
        assert.match(err.stderr, /fast-track: source-intake also passes product-grill, but product-grill's checks fail/);
        assert.match(err.stderr, /No GRILL-LOG\.md/);
        return true;
      },
    );
    await writeFile(path.join(root, 'GRILL-LOG.md'), log(['product-grill']));
    await runStatusWithArtifacts(root, 'result', 'source-intake', 'passed', 'Unified brief', '--artifact', 'PRESENTATION-BRIEF.md');
    assert.equal((await runStatus(root, 'next')).stdout.trim(), 'evidence');

    await runStatusWithArtifacts(root, 'result', 'evidence', 'passed', 'Top metrics', '--artifact', 'EVIDENCE-LEDGER.md');
    // Story nodes and the interrogation are required before story-grill passes with story-architecture.
    await assert.rejects(
      runStatusWithArtifacts(root, 'result', 'story-architecture', 'passed', 'Story', '--artifact', 'STORY.md'),
      /story-grill\/opposition: not settled/,
    );
    await writeFile(path.join(root, 'GRILL-LOG.md'), log(['product-grill', 'story-grill']));
    await writeFile(
      path.join(root, 'INTERROGATION.md'),
      '## Round: story-grill\n\n### Adversaries\n\n- the CFO: 0\n- the operator: 0\n- the newcomer: 0\n',
    );
    await runStatusWithArtifacts(root, 'result', 'story-architecture', 'passed', 'Story + opposition', '--artifact', 'STORY.md');
    assert.equal((await runStatus(root, 'next')).stdout.trim(), 'deck-prototype');

    const status = await readFile(path.join(root, 'STATUS.md'), 'utf8');
    assert.match(status, /fast-track: consolidated with story-architecture/);
  });

  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    await runStatusWithArtifacts(root, 'result', 'source-intake', 'passed', 'Inventory',
      '--artifact', 'SOURCE-INVENTORY.md');
    assert.equal((await runStatus(root, 'next')).stdout.trim(), 'product-grill');
  });
});

test('brief reports progress, open load-bearing assumptions, unresolved findings, and the next move', async () => {
  const { writeFile } = await import('node:fs/promises');
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    await runStatusWithArtifacts(root, 'result', 'source-intake', 'passed', 'Inventory done', '--artifact', 'SOURCE-INVENTORY.md');
    await writeFile(path.join(root, 'PRESENTATION-BRIEF.md'), '## Playback\n\n- A decision deck for the board.\n');
    await writeFile(
      path.join(root, 'GRILL-LOG.md'),
      `| Phase | Node | Question | Recommended answer | Decision | Status | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| product-grill | audience | q | r | d | Assumed | Headless run | — |
| product-grill | brand | q | r | d | Assumed | Reversible | — |
| product-grill | outcome | q | r | d | Deferred | Waiting on the sponsor | — |`,
    );
    await writeFile(
      path.join(root, 'INTERROGATION.md'),
      `## Round: story-grill

| ID | Adversary | Slide | Quote | Proof type | Proof | Verdict | Bucket | Resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | the CFO | 3 | x | ledger | no row | kept | Act on | |`,
    );
    const { stdout } = await runStatus(root, 'brief');
    assert.match(stdout, /demo-deck: 1\/8 gates passed/);
    assert.match(stdout, /Playback: A decision deck for the board\./);
    assert.match(stdout, /product-grill\/audience: Assumed, load-bearing \(Headless run\)/);
    assert.doesNotMatch(stdout, /product-grill\/brand/);
    assert.match(stdout, /product-grill\/outcome: Deferred \(Waiting on the sponsor\)/);
    assert.match(stdout, /story-grill S1: Act on finding without a resolution/);
    assert.match(stdout, /Run `presentation-product-grill` for the `product-grill` gate, asking the open decisions/);
  });
});

test('brief includes profile nodes and flags old-schema grill logs', async () => {
  const { writeFile } = await import('node:fs/promises');
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    await writeFile(path.join(root, 'PRESENTATION-BRIEF.md'), '- Profile: `training-zh-hant`\n');
    await writeFile(
      path.join(root, 'GRILL-LOG.md'),
      '| Phase | Node | Question | Recommended answer | Decision | Status | Reason | Invalidates |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| product-grill | interaction-format | q | r | d | Assumed | Guessed workshop | — |',
    );
    assert.match((await runStatus(root, 'brief')).stdout, /product-grill\/interaction-format: Assumed, load-bearing/);
    await writeFile(path.join(root, 'GRILL-LOG.md'), '| Phase | Question |\n| --- | --- |\n| product-grill | q |');
    assert.match((await runStatus(root, 'brief')).stdout, /GRILL-LOG\.md: GRILL-LOG\.md needs "Node" and "Status" columns/);
  });
});

test('passing a gate requires its artifacts to exist', async () => {
  const { writeFile } = await import('node:fs/promises');
  await withWorkspace(async (root) => {
    await runStatus(root, 'init', 'demo-deck', './notes');
    await assert.rejects(
      runStatus(root, 'result', 'source-intake', 'passed', 'Done', '--artifact', 'SOURCE-INVENTORY.md'),
      (err) => {
        assert.match(err.stderr, /Cannot pass source-intake: artifact\(s\) not found: SOURCE-INVENTORY\.md/);
        return true;
      },
    );
    await writeFile(path.join(root, 'SOURCE-INVENTORY.md'), '# SOURCE-INVENTORY');
    await runStatus(root, 'result', 'source-intake', 'passed', 'Done', '--artifact', 'SOURCE-INVENTORY.md');
    assert.equal((await runStatus(root, 'next')).stdout.trim(), 'product-grill');
  });
});

test('init refuses a work root that is not the deck folder', async () => {
  await withWorkspace(async (root) => {
    await assert.rejects(runStatus(path.dirname(root), 'init', 'demo-deck', './notes'), (err) => {
      assert.match(err.stderr, /work root should be the deck's own folder, presentation-work\/demo-deck/);
      return true;
    });
  });
});
