// Shared engine detection and command planning for export-deck.mjs and qa-deck.mjs.
// Every engine is driven by its own CLI, matching adapters/<engine>/qa.md.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export const ENGINES = ['open-slide', 'genoffice', 'marp', 'pptxgenjs'];

const ENGINE_FORMATS = {
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
  } else if (engine === 'pptxgenjs') {
    steps.push({
      label: 'pptxgenjs build (writes the .pptx)',
      cmd: process.execPath,
      args: [pptxgenjsScript(cwd, deckId)],
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

export function expectedExports({ deckId, formats, outDir }) {
  return formats.map((format) => path.join(outDir, `${deckId}.${format}`));
}

export function checkExports(files) {
  return files.map((file) => {
    if (!existsSync(file)) return { file, ok: false, problem: 'missing' };
    const size = statSync(file).size;
    return size > 0 ? { file, ok: true, size } : { file, ok: false, problem: 'empty' };
  });
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
    const child = spawn(step.cmd, step.args, { cwd, stdio: 'inherit' });
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
      flags[key] = match[2] === undefined ? true : match[2].trim();
    } else if (!deckId) {
      deckId = arg.trim();
    } else {
      throw new Error(`Unexpected argument "${arg}"`);
    }
  }
  return { deckId, flags };
}
