// Shared engine detection and command planning for export-deck.mjs and qa-deck.mjs.
// Every engine is driven by its own CLI, matching adapters/<engine>/qa.md.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILT_IN = [
  'open-slide',
  'genoffice',
  'marp',
  'pptxgenjs',
  'claude-pptx',
  'codex-slides',
  'google-slides',
  'handoff',
];

// Engines whose deck is a PptxGenJS build script (slides/<id>/build.mjs).
const SCRIPT_ENGINES = ['pptxgenjs', 'claude-pptx', 'codex-slides'];
// Engines where a person or an outside tool exports the files; the pipeline
// only checks what lands in --out-dir.
const EXTERNAL_ENGINES = ['google-slides', 'handoff'];
// Engines that cannot always produce a PDF themselves.
const OPTIONAL_PDF = ['pptxgenjs', 'claude-pptx', 'codex-slides', 'handoff'];

/**
 * Engines added without touching this file: any adapters/<name>/engine.json
 * next to the installed skills, e.g.
 *   { "kind": "external", "formats": ["pdf", "pptx"], "optionalPdf": true }
 * "external": the engine's own tool exports into --out-dir (like handoff);
 * "script": rebuilt with node slides/<deck-id>/build.mjs (like pptxgenjs).
 * Reinstalling the skills does not touch adapters you added yourself.
 */
export function adaptersDir() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return process.env.PPT_ADAPTERS_DIR ?? path.resolve(here, '..', '..', '..', 'adapters');
}

export function customEngines(dir = adaptersDir()) {
  if (!existsSync(dir)) return {};
  const found = {};
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name, 'engine.json');
    if (BUILT_IN.includes(name) || !existsSync(file)) continue;
    try {
      const spec = JSON.parse(readFileSync(file, 'utf8'));
      found[name] = {
        kind: spec.kind === 'script' ? 'script' : 'external',
        formats: Array.isArray(spec.formats) && spec.formats.length ? spec.formats : ['pdf', 'pptx'],
        optionalPdf: spec.optionalPdf !== false,
      };
    } catch (error) {
      throw new Error(`${file} is not valid JSON: ${error.message}`);
    }
  }
  return found;
}

const CUSTOM = customEngines();
export const ENGINES = [...BUILT_IN, ...Object.keys(CUSTOM)];
for (const [name, spec] of Object.entries(CUSTOM)) {
  (spec.kind === 'script' ? SCRIPT_ENGINES : EXTERNAL_ENGINES).push(name);
  if (spec.optionalPdf) OPTIONAL_PDF.push(name);
}

const ENGINE_FORMATS = {
  ...Object.fromEntries(Object.entries(CUSTOM).map(([name, spec]) => [name, spec.formats])),
  'claude-pptx': ['pdf', 'pptx'],
  'codex-slides': ['pdf', 'pptx'],
  'google-slides': ['pdf', 'pptx'],
  handoff: ['pdf', 'pptx'],
  'open-slide': ['pdf', 'pptx', 'html'],
  marp: ['pdf', 'pptx', 'html'],
  pptxgenjs: ['pdf', 'pptx'],
  genoffice: ['pdf', 'pptx'],
};

export function readStatusEngine(cwd, deckId) {
  const candidates = [
    path.join(cwd, 'presentation-work', deckId, 'STATUS.md'),
    path.join(cwd, 'slides', deckId, 'STATUS.md'),
    path.join(cwd, deckId, 'STATUS.md'),
    path.join(cwd, 'STATUS.md'),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      const raw = readFileSync(file, 'utf8');
      const match = raw.match(/<!-- presentation-status:start -->[\s\S]*?```json([\s\S]*?)```/);
      const json = match?.[1] ? JSON.parse(match[1].trim()) : null;
      if (json?.deckId && json.deckId !== deckId) continue;
      if (json?.engine) return json.engine;
    } catch {
      // Unreadable status files fall through to file-layout detection.
    }
  }
  return null;
}

export function marpSource(cwd, deckId) {
  const candidates = [
    path.join(cwd, 'slides', `${deckId}.md`),
    path.join(cwd, 'slides', deckId, 'index.md'),
  ];
  return candidates.find((file) => existsSync(file)) ?? candidates[0];
}

export function pptxgenjsScript(cwd, deckId) {
  const candidates = [
    path.join(cwd, 'slides', deckId, 'build.mjs'),
    path.join(cwd, 'slides', deckId, 'build.js'),
  ];
  return candidates.find((file) => existsSync(file)) ?? candidates[0];
}

export function detectEngine(cwd, deckId, explicit = 'auto') {
  if (explicit && explicit !== 'auto') return explicit;
  const fromStatus = readStatusEngine(cwd, deckId);
  if (fromStatus) return fromStatus;

  const deckDir = path.join(cwd, 'slides', deckId);
  if (existsSync(path.join(deckDir, 'outline.json')) || existsSync(path.join(deckDir, 'pages'))) {
    return 'genoffice';
  }
  if (
    existsSync(path.join(cwd, 'slides', `${deckId}.md`)) ||
    existsSync(path.join(deckDir, 'index.md'))
  ) {
    return 'marp';
  }
  if (existsSync(path.join(deckDir, 'build.mjs')) || existsSync(path.join(deckDir, 'build.js'))) {
    return 'pptxgenjs';
  }
  return 'open-slide';
}

export function assertEngine(engine) {
  if (!ENGINES.includes(engine)) {
    throw new Error(`Unknown engine "${engine}". Expected one of: ${ENGINES.join(', ')}`);
  }
}

export function resolveFormats(engine, format) {
  assertEngine(engine);
  const supported = ENGINE_FORMATS[engine];
  const requested =
    format === 'all'
      ? supported
      : format
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean);
  if (requested.length === 0) throw new Error('No export format requested');
  for (const value of requested) {
    if (!supported.includes(value)) {
      throw new Error(
        `Engine "${engine}" cannot export "${value}". Supported formats: ${supported.join(', ')}`,
      );
    }
  }
  return [...new Set(requested)];
}

function openSlideCli(cwd) {
  const localBins = [
    path.join(cwd, 'packages', 'core', 'bin.js'),
    path.join(cwd, 'node_modules', '@open-slide', 'core', 'bin.js'),
  ];
  const localBin = localBins.find((file) => existsSync(file));
  return localBin ? [process.execPath, localBin] : ['npx', '--yes', 'open-slide'];
}

const MARP = ['npx', '--yes', '@marp-team/marp-cli@latest'];

/**
 * Returns the ordered list of commands that export the deck.
 * Each step is { cmd, args, label, optional? }; `optional` steps are skipped
 * with a warning when the binary is missing.
 */
export function isExternalEngine(engine) {
  return EXTERNAL_ENGINES.includes(engine);
}

export function planExport({ cwd, deckId, engine, formats, outDir }) {
  assertEngine(engine);
  const out = (ext) => path.join(outDir, `${deckId}.${ext}`);
  const steps = [];

  if (engine === 'open-slide') {
    const [cmd, ...prefix] = openSlideCli(cwd);
    steps.push({
      label: 'open-slide export',
      cmd,
      args: [...prefix, 'export', deckId, `--format=${formats.join(',')}`, `--out-dir=${outDir}`],
    });
  } else if (engine === 'marp') {
    const source = marpSource(cwd, deckId);
    const [cmd, ...prefix] = MARP;
    for (const format of formats) {
      steps.push({
        label: `marp → ${format}`,
        cmd,
        args: [...prefix, source, '--allow-local-files', '-o', out(format)],
      });
    }
  } else if (SCRIPT_ENGINES.includes(engine)) {
    const script = pptxgenjsScript(cwd, deckId);
    // claude-pptx and codex-slides decks may be edited from a template instead
    // of a build script; then the .pptx is already in --out-dir and only the
    // PDF conversion runs.
    const hasScript = engine === 'pptxgenjs' || existsSync(script);
    // build.mjs reads DECK_OUT_DIR so --out-dir reaches the script.
    if (hasScript) steps.push({
      label: 'pptxgenjs build (writes the .pptx)',
      cmd: process.execPath,
      args: [pptxgenjsScript(cwd, deckId)],
      env: { DECK_OUT_DIR: outDir },
    });
    if (formats.includes('pdf')) {
      steps.push({
        label: 'LibreOffice → pdf',
        cmd: 'soffice',
        args: ['--headless', '--convert-to', 'pdf', '--outdir', outDir, out('pptx')],
        requiresBinary: true,
      });
    }
  } else if (engine === 'genoffice') {
    const deckDir = path.join(cwd, 'slides', deckId);
    const outline = path.join(deckDir, 'outline.json');
    steps.push({
      label: 'genoffice create pptx',
      cmd: 'genoffice',
      args: [
        'create',
        '--type',
        'pptx',
        '--spec',
        path.join(deckDir, 'pages'),
        ...(existsSync(outline) ? ['--outline', outline] : []),
        '--out',
        out('pptx'),
        '--force',
        '--json',
      ],
    });
    if (formats.includes('pdf')) {
      steps.push({
        label: 'genoffice convert → pdf',
        cmd: 'genoffice',
        args: ['convert', out('pptx'), '--to', 'pdf', '--out', out('pdf'), '--force', '--json'],
      });
    }
  }
  return steps;
}

/**
 * Returns the automated QA checks for the deck. Engines without a geometry
 * audit CLI get export-integrity checks; the manual checks remain in
 * adapters/<engine>/qa.md.
 */
export function planQa({ cwd, deckId, engine, outDir }) {
  assertEngine(engine);
  const out = (ext) => path.join(outDir, `${deckId}.${ext}`);
  if (engine === 'open-slide') {
    const [cmd, ...prefix] = openSlideCli(cwd);
    return [{ label: 'open-slide qa', cmd, args: [...prefix, 'qa', deckId, '-o', outDir] }];
  }
  if (engine === 'genoffice') {
    return [
      {
        label: 'genoffice slides audit',
        cmd: 'genoffice',
        args: ['slides', 'audit', out('pptx'), '--json'],
      },
      {
        label: 'genoffice slides read (notes parity)',
        cmd: 'genoffice',
        args: ['slides', 'read', out('pptx'), '--full', '--json'],
      },
    ];
  }
  return [];
}

/**
 * Each expected export lists the paths that satisfy it. HTML may be a single
 * file or a folder with index.html, depending on the engine.
 */
export function expectedExports({ deckId, formats, outDir, optional = [] }) {
  return formats.map((format) => ({
    format,
    optional: optional.includes(format),
    candidates:
      format === 'html'
        ? [path.join(outDir, `${deckId}.html`), path.join(outDir, deckId, 'index.html')]
        : [path.join(outDir, `${deckId}.${format}`)],
  }));
}

export function checkExports(expected) {
  return expected.map(({ format, optional = false, candidates }) => {
    const found = candidates.find((file) => existsSync(file));
    if (!found) return { format, file: candidates[0], ok: false, optional, problem: 'missing' };
    const size = statSync(found).size;
    return size > 0
      ? { format, file: found, ok: true, optional, size }
      : { format, file: found, ok: false, optional, problem: 'empty' };
  });
}

/** Prints export results; returns true when every required export is present. */
export function printExportResults(results, write = (line) => process.stdout.write(line)) {
  for (const result of results) {
    if (result.ok) write(`ok      ${result.file} (${result.size} bytes)\n`);
    else if (result.optional) write(`skipped ${result.file} (${result.problem}; optional for this engine)\n`);
    else write(`FAILED  ${result.file} (${result.problem})\n`);
  }
  return results.every((result) => result.ok || result.optional);
}

/**
 * Formats to export or check. `auto` means pptx + pdf, except that PptxGenJS
 * cannot write PDF itself: there the PDF is optional (made only when
 * LibreOffice is installed), as adapters/pptxgenjs/qa.md allows.
 */
export function resolveRequest(engine, format) {
  if (format !== 'auto') return { formats: resolveFormats(engine, format), optional: [] };
  return {
    formats: resolveFormats(engine, 'pdf,pptx'),
    optional: OPTIONAL_PDF.includes(engine) ? ['pdf'] : [],
  };
}

export function hasBinary(cmd) {
  if (path.isAbsolute(cmd)) return existsSync(cmd);
  const probe = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
  return !probe.error;
}

export function formatStep(step) {
  const quote = (value) => (/[\s"']/.test(value) ? JSON.stringify(value) : value);
  return [step.cmd, ...step.args].map(quote).join(' ');
}

export function runStep(step, cwd) {
  return new Promise((resolve, reject) => {
    const env = step.env ? { ...process.env, ...step.env } : process.env;
    const child = spawn(step.cmd, step.args, { cwd, stdio: 'inherit', env });
    child.on('error', (error) => {
      reject(new Error(`${step.label}: cannot run "${step.cmd}" (${error.message})`));
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.label}: "${formatStep(step)}" exited with code ${code}`));
    });
  });
}

export function parseFlags(args, defaults) {
  const flags = { ...defaults };
  let deckId = null;
  for (const arg of args) {
    const match = arg.match(/^--([a-z-]+)(?:=(.*))?$/);
    if (match) {
      const key = match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (!(key in defaults)) throw new Error(`Unknown option "--${match[1]}"`);
      if (typeof defaults[key] === 'boolean') {
        if (match[2] !== undefined) throw new Error(`Option "--${match[1]}" takes no value`);
        flags[key] = true;
      } else {
        if (match[2] === undefined || match[2].trim() === '') {
          throw new Error(`Option "--${match[1]}" needs a value: --${match[1]}=<value>`);
        }
        flags[key] = match[2].trim();
      }
    } else if (!deckId) {
      deckId = arg.trim();
    } else {
      throw new Error(`Unexpected argument "${arg}"`);
    }
  }
  return { deckId, flags };
}
