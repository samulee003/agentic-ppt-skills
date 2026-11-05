import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const installer = path.resolve(new URL('../install.mjs', import.meta.url).pathname);

async function withTarget(callback) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'ppt-install-'));
  try {
    await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('installs skills and adapters into .agents and verifies the status helper', async () => {
  await withTarget(async (dir) => {
    const { stdout } = await execFileAsync(process.execPath, [installer, dir]);
    assert.match(stdout, /verified {3}status helper runs/);
    for (const file of [
      '.agents/skills/make-presentation/SKILL.md',
      '.agents/skills/make-presentation/scripts/pptx-check.mjs',
      '.agents/skills/make-presentation/themes/editorial-minimal.md',
      '.agents/adapters/claude-pptx/README.md',
      '.agents/adapters/google-slides/qa.md',
    ]) {
      assert.ok(existsSync(path.join(dir, file)), file);
    }
  });
});

test('--runtime=claude installs into .claude; reinstall is idempotent', async () => {
  await withTarget(async (dir) => {
    await execFileAsync(process.execPath, [installer, dir, '--runtime=claude']);
    await execFileAsync(process.execPath, [installer, dir, '--runtime=claude']);
    assert.ok(existsSync(path.join(dir, '.claude/skills/make-presentation/SKILL.md')));
    assert.ok(!existsSync(path.join(dir, '.agents')));
  });
});

test('refuses to overwrite a different orchestrator without --force', async () => {
  await withTarget(async (dir) => {
    const skill = path.join(dir, '.agents/skills/make-presentation');
    await mkdir(skill, { recursive: true });
    await writeFile(path.join(skill, 'SKILL.md'), 'local edits');
    await assert.rejects(execFileAsync(process.execPath, [installer, dir]), (err) => {
      assert.match(err.stderr, /differs from this version/);
      return true;
    });
    await execFileAsync(process.execPath, [installer, dir, '--force']);
  });
});

test('rejects bad options and installing into the repository itself', async () => {
  await assert.rejects(execFileAsync(process.execPath, [installer, '--runtime=vscode']), /--runtime must be/);
  await assert.rejects(
    execFileAsync(process.execPath, [installer, path.dirname(installer)]),
    /not from this repository/,
  );
});

test('reinstall removes files a newer version dropped but keeps unrelated skills', async () => {
  await withTarget(async (dir) => {
    await execFileAsync(process.execPath, [installer, dir]);
    const stale = path.join(dir, '.agents/skills/make-presentation/references/old-reference.md');
    const mine = path.join(dir, '.agents/skills/my-own-skill/SKILL.md');
    await mkdir(path.dirname(mine), { recursive: true });
    await writeFile(stale, 'outdated');
    await writeFile(mine, 'mine');
    await execFileAsync(process.execPath, [installer, dir]);
    assert.ok(!existsSync(stale), 'stale file removed');
    assert.ok(existsSync(mine), 'unrelated skill kept');
  });
});

test('--to installs into any runtime folder; ~ expands; --runtime=workbuddy targets ~/.workbuddy', async () => {
  const { installRoot, expandHome } = await import('../install.mjs');
  const os = await import('node:os');
  assert.equal(installRoot({ target: '/p', runtime: 'workbuddy', to: null }), path.join(os.homedir(), '.workbuddy'));
  assert.equal(installRoot({ target: '/p', runtime: 'agents', to: '/x/y' }), '/x/y');
  assert.equal(expandHome('~/abc'), path.join(os.homedir(), 'abc'));
  await withTarget(async (dir) => {
    const to = path.join(dir, 'runtime-home');
    await execFileAsync(process.execPath, [installer, `--to=${to}`]);
    assert.ok(existsSync(path.join(to, 'skills/make-presentation/SKILL.md')));
    assert.ok(existsSync(path.join(to, 'adapters/workbuddy-pptx/engine.json')));
  });
});
