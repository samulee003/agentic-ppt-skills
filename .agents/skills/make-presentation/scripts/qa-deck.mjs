#!/usr/bin/env node
// Automated part of the production-qa gate for every supported engine.
//   open-slide → open-slide qa
//   genoffice  → genoffice slides audit + slides read (notes parity)
//   every engine     → export integrity + pptx-check.mjs (notes parity, type
//                      floor, alt text, density, PDF page parity)
// The visual and PowerPoint checks in adapters/<engine>/qa.md still apply.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkExports,
  detectEngine,
  expectedExports,
  formatStep,
  parseFlags,
  planExport,
  planQa,
  printExportResults,
  resolveRequest,
  runStep,
} from './deck-engines.mjs';
import { formatReport, inspectPptx } from './pptx-check.mjs';

const USAGE =
  'Usage: qa-deck.mjs <deck-id> [--engine=<auto|open-slide|genoffice|marp|pptxgenjs>] [--format=<auto|pdf,pptx,html|all>] [--export] [--out-dir=<dir>] [--dry-run]\n';

async function main() {
  const { deckId, flags } = parseFlags(process.argv.slice(2), {
    engine: 'auto',
    format: 'auto',
    outDir: 'exports',
    export: false,
    dryRun: false,
  });
  if (!deckId) {
    process.stderr.write(USAGE);
    process.exit(1);
  }

  const cwd = process.cwd();
  const engine = detectEngine(cwd, deckId, flags.engine);
  const { formats, optional } = resolveRequest(engine, flags.format);
  const outDir = path.resolve(cwd, flags.outDir);
  const qaSteps = planQa({ cwd, deckId, engine, outDir });

  process.stdout.write(`QA for "${deckId}" with engine [${engine}]\n`);
  if (flags.dryRun) {
    if (flags.export) {
      for (const step of planExport({ cwd, deckId, engine, formats, outDir })) {
        process.stdout.write(`$ ${formatStep(step)}\n`);
      }
    }
    for (const step of qaSteps) process.stdout.write(`$ ${formatStep(step)}\n`);
    process.stdout.write(`check exports: ${formats.join(', ')}\n`);
    if (formats.includes('pptx')) process.stdout.write('then: pptx-check on the exported .pptx\n');
    return;
  }

  if (flags.export) {
    // Reuse export-deck so optional formats and missing converters behave the same.
    const exportArgs = [
      path.join(path.dirname(fileURLToPath(import.meta.url)), 'export-deck.mjs'),
      deckId,
      `--engine=${engine}`,
      `--format=${flags.format}`,
      `--out-dir=${outDir}`,
    ];
    await runStep({ label: 'export-deck', cmd: process.execPath, args: exportArgs }, cwd);
  }
  for (const step of qaSteps) {
    process.stdout.write(`$ ${formatStep(step)}\n`);
    await runStep(step, cwd);
  }

  const exportsOk = printExportResults(
    checkExports(expectedExports({ deckId, formats, outDir, optional })),
  );

  let pptxErrors = 0;
  const pptx = path.join(outDir, `${deckId}.pptx`);
  const pdf = path.join(outDir, `${deckId}.pdf`);
  if (formats.includes('pptx') && existsSync(pptx)) {
    const report = inspectPptx(readFileSync(pptx), {
      pdf: formats.includes('pdf') && existsSync(pdf) ? readFileSync(pdf) : undefined,
    });
    process.stdout.write(formatReport(report, 'pptx-check'));
    pptxErrors = report.errors.length;
  }
  process.stdout.write(
    `Manual checks remain: see adapters/${engine}/qa.md (visual parity, PowerPoint inspection).\n`,
  );
  if (!exportsOk) throw new Error('Export integrity check failed');
  if (pptxErrors > 0) throw new Error(`pptx-check found ${pptxErrors} error(s)`);
}

main().catch((error) => {
  process.stderr.write(`qa-deck error: ${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
});
