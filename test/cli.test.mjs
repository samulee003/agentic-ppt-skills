import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const exportScript = path.resolve(
  new URL('../skills/make-presentation/scripts/export-deck.mjs', import.meta.url).pathname,
);
const qaScript = path.resolve(
  new URL('../skills/make-presentation/scripts/qa-deck.mjs', import.meta.url).pathname,
);

test('export-deck.mjs reports usage when called without deck-id', async () => {
  await assert.rejects(
    async () => {
      await execFileAsync(process.execPath, [exportScript]);
    },
    (err) => {
      assert.match(err.stderr, /Usage: export-deck\.mjs <deck-id>/);
      return true;
    },
  );
});

test('qa-deck.mjs reports usage when called without deck-id', async () => {
  await assert.rejects(
    async () => {
      await execFileAsync(process.execPath, [qaScript]);
    },
    (err) => {
      assert.match(err.stderr, /Usage: qa-deck\.mjs <deck-id>/);
      return true;
    },
  );
});
