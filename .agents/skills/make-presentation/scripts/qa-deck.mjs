#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function usage() {
  process.stderr.write(`Usage: qa-deck.mjs <deck-id> [--export] [--record] [--out-dir=<dir>]\n`);
  process.exit(1);
}

function parseArgs(args) {
  let deckId = null;
  const flags = {
    export: false,
    record: false,
    outDir: null,
  };

  for (const arg of args) {
    if (arg === '--export') {
      flags.export = true;
    } else if (arg === '--record') {
      flags.record = true;
    } else if (arg.startsWith('--out-dir=')) {
      flags.outDir = arg.slice('--out-dir='.length).trim();
    } else if (!arg.startsWith('-') && !deckId) {
      deckId = arg.trim();
    }
  }

  if (!deckId) usage();
  return { deckId, flags };
}

async function main() {
  const { deckId, flags } = parseArgs(process.argv.slice(2));
  const userCwd = process.cwd();

  const coreBinCandidates = [
    path.join(userCwd, 'packages', 'core', 'bin.js'),
    path.join(userCwd, 'node_modules', '@open-slide', 'core', 'bin.js'),
  ];
  let localCoreBin = null;
  for (const c of coreBinCandidates) {
    if (existsSync(c)) {
      localCoreBin = c;
      break;
    }
  }

  const cliArgs = ['qa', deckId];
  if (flags.export) cliArgs.push('--export');
  if (flags.record) cliArgs.push('--record');
  if (flags.outDir) cliArgs.push(`-o`, flags.outDir);

  if (localCoreBin) {
    const { stdout, stderr } = await execFileAsync('node', [localCoreBin, ...cliArgs]);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    return;
  }

  // Fallback to npx open-slide
  try {
    const { stdout, stderr } = await execFileAsync('npx', ['open-slide', ...cliArgs]);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  } catch (err) {
    process.stderr.write(`Failed to run QA audit: ${String(err)}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`qa-deck error: ${String(err)}\n`);
  process.exit(1);
});
