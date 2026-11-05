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
import { checkGrillAt } from './grill-check.mjs';
import { checkLedgerAt } from './ledger-check.mjs';
import { checkPlanAt } from './plan-check.mjs';
import { checkSourcesAt } from './source-check.mjs';
import { formatReport, inspectPptx } from './pptx-check.mjs';

const USAGE =
  'Usage: qa-deck.mjs <deck-id> [--engine=<engine>] [--format=<auto|pdf,pptx,html|all>] [--export] [--out-dir=<dir>] [--work=<work-root>] [--dry-run]\n';

async function main() {
  const { deckId, flags } = parseFlags(process.argv.slice(2), {
    engine: 'auto',
    format: 'auto',
    outDir: 'exports',
    export: false,
    dryRun: false,
    work: 'auto',
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
  // Plan, evidence, and grilling checks run when the pipeline work folder exists.
  const work = flags.work === 'auto' ? path.join(cwd, 'presentation-work', deckId) : path.resolve(cwd, flags.work);
  let pipelineErrors = 0;
  if (existsSync(path.join(work, 'STATUS.md'))) {
    const reports = [
      ['plan-check', existsSync(pptx) ? checkPlanAt(work, pptx) : null],
      ['ledger-check', checkLedgerAt(work)],
      ['grill-check production-qa', checkGrillAt(work, 'production-qa')],
      ['source-check --final', existsSync(path.join(work, 'SOURCE-INVENTORY.md')) ? checkSourcesAt(work, true) : null],
    ];
    for (const [name, report] of reports) {
      if (!report) continue;
      process.stdout.write(`${name}: ${report.errors.length ? `${report.errors.length} error(s)` : 'no errors'}\n`);
      for (const error of report.errors) process.stdout.write(`error    ${error}\n`);
      for (const warning of report.warnings) process.stdout.write(`warning  ${warning}\n`);
      pipelineErrors += report.errors.length;
    }
  } else if (flags.work !== 'auto') {
    throw new Error(`No STATUS.md in ${work}`);
  }
  process.stdout.write(
    `Manual checks remain: see adapters/${engine}/qa.md (visual parity, PowerPoint inspection).\n`,
  );
  if (!exportsOk) throw new Error('Export integrity check failed');
  if (pptxErrors > 0) throw new Error(`pptx-check found ${pptxErrors} error(s)`);
  if (pipelineErrors > 0) throw new Error(`plan, ledger, grill, or source checks found ${pipelineErrors} error(s)`);
}

main().catch((error) => {
  process.stderr.write(`qa-deck error: ${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
});
