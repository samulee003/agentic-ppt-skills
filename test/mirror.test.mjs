import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repo = path.resolve(new URL('..', import.meta.url).pathname);

async function listFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full, base)));
    else files.push(path.relative(base, full));
  }
  return files.sort();
}

async function assertMirror(source, mirror) {
  const sourceFiles = await listFiles(source);
  assert.deepEqual(await listFiles(mirror), sourceFiles, `${mirror} file list differs`);
  for (const file of sourceFiles) {
    const [a, b] = await Promise.all([
      readFile(path.join(source, file)),
      readFile(path.join(mirror, file)),
    ]);
    assert.ok(a.equals(b), `${path.join(mirror, file)} differs from ${path.join(source, file)}`);
  }
}

test('.agents/skills mirrors every distributable skill', async () => {
  const skills = (await readdir(path.join(repo, 'skills'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  for (const skill of skills) {
    await assertMirror(path.join(repo, 'skills', skill), path.join(repo, '.agents/skills', skill));
  }
});

test('.agents/adapters mirrors adapters', async () => {
  await assertMirror(path.join(repo, 'adapters'), path.join(repo, '.agents/adapters'));
});

test('docs only link to skills that exist', async () => {
  const index = await readFile(path.join(repo, 'skills/SKILLS-INDEX.md'), 'utf8');
  for (const [, link] of index.matchAll(/\]\(\.\/([a-z0-9-]+)\/SKILL\.md\)/g)) {
    await assert.doesNotReject(
      readFile(path.join(repo, 'skills', link, 'SKILL.md')),
      `SKILLS-INDEX links to missing skill ${link}`,
    );
  }
  const gates = await readFile(path.join(repo, 'skills/make-presentation/references/gates.md'), 'utf8');
  for (const [, owner] of gates.matchAll(/\| `([a-z-]+)` → /g)) {
    await assert.doesNotReject(
      readFile(path.join(repo, 'skills', owner, 'SKILL.md')),
      `gates.md names missing owner ${owner}`,
    );
  }
});
