#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function usage() {
  process.stderr.write(
    `Usage: export-deck.mjs <deck-id> [--engine=<engine>] [--format=<pdf,pptx,html,all>] [--out-dir=<dir>]\n`,
  );
  process.exit(1);
}

function parseArgs(args) {
  let deckId = null;
  const flags = {
    engine: 'auto',
    format: 'pdf,pptx',
    outDir: 'exports',
  };

  for (const arg of args) {
    if (arg.startsWith('--engine=')) {
      flags.engine = arg.slice('--engine='.length).trim();
    } else if (arg.startsWith('--format=')) {
      flags.format = arg.slice('--format='.length).trim();
    } else if (arg.startsWith('--out-dir=')) {
      flags.outDir = arg.slice('--out-dir='.length).trim();
    } else if (!arg.startsWith('-') && !deckId) {
      deckId = arg.trim();
    }
  }

  if (!deckId) usage();
  return { deckId, flags };
}

function detectEngine(userCwd, deckId, explicit) {
  if (explicit && explicit !== 'auto') return explicit;

  const statusCandidates = [
    path.join(userCwd, 'presentation-work', deckId, 'STATUS.md'),
    path.join(userCwd, 'slides', deckId, 'STATUS.md'),
    path.join(userCwd, deckId, 'STATUS.md'),
    path.join(userCwd, 'STATUS.md'),
  ];
  for (const p of statusCandidates) {
    if (existsSync(p)) {
      try {
        const raw = readFileSync(p, 'utf8');
        const match = raw.match(/<!-- presentation-status:start -->[\s\S]*?```json([\s\S]*?)```/);
        if (match?.[1]) {
          const json = JSON.parse(match[1].trim());
          if (json.engine) return json.engine;
        }
      } catch {}
    }
  }

  const slidesDir = path.join(userCwd, 'slides');
  const deckDir = path.join(slidesDir, deckId);

  if (existsSync(path.join(deckDir, 'outline.json')) || existsSync(path.join(deckDir, 'pages'))) {
    return 'genoffice';
  }
  if (
    existsSync(path.join(slidesDir, `${deckId}.md`)) ||
    existsSync(path.join(deckDir, 'index.md'))
  ) {
    return 'marp';
  }
  if (existsSync(path.join(deckDir, 'build.mjs')) || existsSync(path.join(deckDir, 'build.js'))) {
    return 'pptxgenjs';
  }
  return 'open-slide';
}

async function main() {
  const { deckId, flags } = parseArgs(process.argv.slice(2));
  const userCwd = process.cwd();
  const engine = detectEngine(userCwd, deckId, flags.engine);

  process.stdout.write(`Exporting presentation "${deckId}" using engine [${engine}]...\n`);

  // First try delegating to local open-slide CLI export
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

  if (localCoreBin) {
    const cliArgs = [
      localCoreBin,
      'export',
      deckId,
      `--engine=${engine}`,
      `--format=${flags.format}`,
      `--out-dir=${flags.outDir}`,
    ];
    await execFileAsync('node', cliArgs, { stdio: 'inherit' });
    return;
  }

  // Fallback to npx open-slide
  try {
    await execFileAsync('npx', [
      'open-slide',
      'export',
      deckId,
      `--engine=${engine}`,
      `--format=${flags.format}`,
      `--out-dir=${flags.outDir}`,
    ]);
  } catch (err) {
    process.stderr.write(`Failed to export deck: ${String(err)}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`export-deck error: ${String(err)}\n`);
  process.exit(1);
});
