#!/usr/bin/env node
// Automated part of the production-qa gate for every supported engine.
//   open-slide → open-slide qa
//   genoffice  → genoffice slides audit + slides read (notes parity)
//   every engine     → export integrity + pptx-check.mjs (notes parity, type
//                      floor, alt text, density, PDF page parity)
// The visual and PowerPoint checks in adapters/<engine>/qa.md still apply.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  checkExports,
  detectEngine,
  expectedExports,
  formatStep,
  parseFlags,
  planExport,
  planQa,
  resolveFormats,
  runStep,
} from './deck-engines.mjs';
import { inspectPptx } from './pptx-check.mjs';

const USAGE =
  'Usage: qa-deck.mjs <deck-id> [--engine=<auto|open-slide|genoffice|marp|pptxgenjs>] [--format=<pdf,pptx,html|all>] [--export] [--out-dir=<dir>] [--dry-run]\n';

async function main() {
  const { deckId, flags } = parseFlags(process.argv.slice(2), {
    engine: 'auto',
    format: 'pdf,pptx',
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
  const formats = resolveFormats(engine, flags.format);
  const outDir = path.resolve(cwd, flags.outDir);
  const steps = [
    ...(flags.export ? planExport({ cwd, deckId, engine, formats, outDir }) : []),
    ...planQa({ cwd, deckId, engine, outDir }),
  ];

  process.stdout.write(`QA for "${deckId}" with engine [${engine}]\n`);
  if (flags.dryRun) {
    for (const step of steps) process.stdout.write(`$ ${formatStep(step)}\n`);
    process.stdout.write(`check exports: ${formats.join(', ')}\n`);
    if (formats.includes('pptx')) process.stdout.write('then: pptx-check on the exported .pptx\n');
    return;
  }

  for (const step of steps) {
    process.stdout.write(`$ ${formatStep(step)}\n`);
    await runStep(step, cwd);
  }

  const results = checkExports(expectedExports({ deckId, formats, outDir }));
  for (const result of results) {
    process.stdout.write(
      result.ok
        ? `ok      ${result.file} (${result.size} bytes)\n`
        : `FAILED  ${result.file} (${result.problem})\n`,
    );
  }
  let pptxErrors = 0;
  const pptx = path.join(outDir, `${deckId}.pptx`);
  const pdf = path.join(outDir, `${deckId}.pdf`);
  if (formats.includes('pptx') && existsSync(pptx)) {
    const report = inspectPptx(readFileSync(pptx), {
      pdf: formats.includes('pdf') && existsSync(pdf) ? readFileSync(pdf) : undefined,
    });
    process.stdout.write(
      `pptx-check: ${report.slideCount} slides, ${report.notesCount} with notes` +
        (report.pdfPages !== null ? `, PDF ${report.pdfPages} pages` : '') +
        '\n',
    );
    for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
    for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
    pptxErrors = report.errors.length;
  }
  process.stdout.write(
    `Manual checks remain: see adapters/${engine}/qa.md (visual parity, PowerPoint inspection).\n`,
  );
  if (results.some((result) => !result.ok)) {
    throw new Error('Export integrity check failed');
  }
  if (pptxErrors > 0) throw new Error(`pptx-check found ${pptxErrors} error(s)`);
}

main().catch((error) => {
  process.stderr.write(`qa-deck error: ${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
});
