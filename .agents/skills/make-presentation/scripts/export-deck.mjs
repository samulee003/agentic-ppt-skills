#!/usr/bin/env node
// Headless export for every supported engine. Each engine runs its own CLI:
//   open-slide → open-slide export      marp      → @marp-team/marp-cli
//   pptxgenjs  → node build.mjs (+ soffice for PDF)   genoffice → genoffice create/convert
// Pass --dry-run to print the commands without running them.

import path from 'node:path';
import {
  checkExports,
  detectEngine,
  expectedExports,
  formatStep,
  hasBinary,
  parseFlags,
  planExport,
  resolveFormats,
  runStep,
} from './deck-engines.mjs';

const USAGE =
  'Usage: export-deck.mjs <deck-id> [--engine=<auto|open-slide|genoffice|marp|pptxgenjs>] [--format=<pdf,pptx,html|all>] [--out-dir=<dir>] [--dry-run]\n';

async function main() {
  const { deckId, flags } = parseFlags(process.argv.slice(2), {
    engine: 'auto',
    format: 'pdf,pptx',
    outDir: 'exports',
    dryRun: false,
  });
  if (!deckId) {
    process.stderr.write(USAGE);
    process.exit(1);
  }

  const cwd = process.cwd();
  const engine = detectEngine(cwd, deckId, flags.engine);
  const formats = resolveFormats(engine, flags.format);
  const outDir = path.resolve(cwd, flags.outDir);
  const steps = planExport({ cwd, deckId, engine, formats, outDir });

  process.stdout.write(`Exporting "${deckId}" with engine [${engine}] → ${formats.join(', ')}\n`);

  if (flags.dryRun) {
    for (const step of steps) process.stdout.write(`$ ${formatStep(step)}\n`);
    return;
  }

  for (const step of steps) {
    if (step.requiresBinary && !hasBinary(step.cmd)) {
      const fallback = step.cmd === 'soffice' && hasBinary('libreoffice') ? 'libreoffice' : null;
      if (!fallback) {
        throw new Error(
          `${step.label}: "${step.cmd}" is not installed. PptxGenJS writes PPTX only; install LibreOffice or export with --format=pptx. Do not fabricate a PDF.`,
        );
      }
      step.cmd = fallback;
    }
    process.stdout.write(`$ ${formatStep(step)}\n`);
    await runStep(step, cwd);
  }

  // open-slide writes into --out-dir itself; every engine must leave the files there.
  const results = checkExports(expectedExports({ deckId, formats, outDir }));
  for (const result of results) {
    process.stdout.write(
      result.ok
        ? `ok      ${result.file} (${result.size} bytes)\n`
        : `FAILED  ${result.file} (${result.problem})\n`,
    );
  }
  if (results.some((result) => !result.ok)) {
    throw new Error('One or more expected export files are missing or empty');
  }
}

main().catch((error) => {
  process.stderr.write(`export-deck error: ${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
});
