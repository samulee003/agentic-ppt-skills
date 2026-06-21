#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const GATES = [
  'source-intake',
  'product-grill',
  'evidence',
  'story-architecture',
  'story-grill',
  'deck-prototype',
  'stage-grill',
  'production-qa',
];

export const STATUSES = ['pending', 'in_progress', 'passed', 'needs_revision', 'blocked'];

const SCHEMA_VERSION = 3;
const MODES = ['general', 'research-enhanced'];
const RESULTS = ['passed', 'blocked', 'needs_revision: product-grill', 'needs_revision: evidence'];

function statusPath(root) {
  return path.join(path.resolve(root), 'STATUS.md');
}

function assertOneOf(value, allowed, label) {
  if (!allowed.includes(value)) {
    throw new Error(`Invalid ${label} "${value}". Expected one of: ${allowed.join(', ')}`);
  }
}

function assertRequiredString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing ${label}`);
  }
}

function assertDeckId(value) {
  assertRequiredString(value, 'deckId');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`Invalid deckId "${value}". Expected a safe kebab-case deck id`);
  }
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|');
}

function render(state) {
  const rows = GATES.map((gate) => {
    const item = state.gates[gate];
    return [
      gate,
      item.status,
      item.artifacts.join('<br>'),
      item.inputs.join('<br>'),
      item.decisions.join('<br>'),
      item.invalidatedBy.join('<br>'),
      item.reviewedAt ?? '',
      item.reason,
      item.invalidatedAt ?? '',
      item.invalidationReason,
    ]
      .map(escapeCell)
      .join(' | ');
  }).join('\n');

  return `# Presentation Status

<!-- presentation-status:start -->
\`\`\`json
${JSON.stringify(state, null, 2)}
\`\`\`
<!-- presentation-status:end -->

**Deck:** ${state.deckId} · **Mode:** ${state.mode} · **Engine:** ${state.engine ?? '(not chosen yet — picked at the deck-prototype gate)'}

| Gate | Status | Artifacts | Inputs | Decisions | Invalidated by | Reviewed | Review reason | Invalidated | Invalidation reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ${rows.split('\n').join(' |\n| ')} |
`;
}

function normalizeState(state) {
  if (state.schemaVersion === SCHEMA_VERSION) return state;
  if (state.schemaVersion !== 1 && state.schemaVersion !== 2) {
    throw new Error('Unsupported presentation status schema');
  }
  const migratedAt = new Date().toISOString();
  const v2 = state.schemaVersion === 2 ? state : {
    ...state,
    schemaVersion: 2,
    modeReviewedAt:
      typeof state.modeReviewedAt === 'string' && state.modeReviewedAt
        ? state.modeReviewedAt
        : migratedAt,
    modeReason:
      typeof state.modeReason === 'string' && state.modeReason
        ? state.modeReason
        : 'Migrated from schema version 1',
    gates: Object.fromEntries(
      GATES.map((gate) => {
        const item = state.gates?.[gate] ?? {};
        const artifacts = Array.isArray(item.artifacts)
          ? item.artifacts
          : typeof item.artifact === 'string' && item.artifact
            ? [item.artifact]
            : [];
        return [
          gate,
          {
            status: item.status ?? 'pending',
            artifacts,
            reviewedAt: item.reviewedAt ?? null,
            invalidatedAt: item.invalidatedAt ?? null,
            inputs: Array.isArray(item.inputs) ? item.inputs : [],
            decisions: Array.isArray(item.decisions) ? item.decisions : [],
            invalidatedBy: Array.isArray(item.invalidatedBy) ? item.invalidatedBy : [],
            reason: typeof item.reason === 'string' ? item.reason : '',
            invalidationReason:
              typeof item.invalidationReason === 'string'
                ? item.invalidationReason
                : item.status === 'needs_revision' && typeof item.reason === 'string'
                  ? item.reason
                  : '',
          },
        ];
      }),
    ),
  };
  return {
    ...v2,
    schemaVersion: SCHEMA_VERSION,
    engine: typeof v2.engine === 'string' && v2.engine ? v2.engine : null,
  };
}

async function load(root) {
  const markdown = await readFile(statusPath(root), 'utf8');
  const match = markdown.match(
    /<!-- presentation-status:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- presentation-status:end -->/,
  );
  if (!match) throw new Error('STATUS.md is missing its presentation status block');
  return normalizeState(JSON.parse(match[1]));
}

async function save(root, state, options = {}) {
  await mkdir(path.resolve(root), { recursive: true });
  await writeFile(statusPath(root), render(state), { flag: options.exclusive ? 'wx' : 'w' });
}

function createState(deckId, sourceRoot, mode, modeReason) {
  assertDeckId(deckId);
  assertRequiredString(sourceRoot, 'sourceRoot');
  const resolvedMode = mode && mode.trim() ? mode : 'general';
  assertOneOf(resolvedMode, MODES, 'mode');
  const resolvedReason =
    modeReason && modeReason.trim() ? modeReason : `Initial mode: ${resolvedMode}`;
  return {
    schemaVersion: SCHEMA_VERSION,
    deckId,
    mode: resolvedMode,
    modeReviewedAt: new Date().toISOString(),
    modeReason: resolvedReason,
    engine: null,
    sourceRoot: path.resolve(sourceRoot),
    gates: Object.fromEntries(
      GATES.map((gate) => [
        gate,
        {
          status: 'pending',
          artifacts: [],
          reviewedAt: null,
          invalidatedAt: null,
          inputs: [],
          decisions: [],
          invalidatedBy: [],
          reason: '',
          invalidationReason: '',
        },
      ]),
    ),
  };
}

function validateState(state) {
  state = normalizeState(state);
  if (state.schemaVersion !== SCHEMA_VERSION) {
    throw new Error('Unsupported presentation status schema');
  }
  assertDeckId(state.deckId);
  const mode = state.mode && state.mode.trim() ? state.mode : 'general';
  assertOneOf(mode, MODES, 'mode');
  if (!state.sourceRoot || typeof state.sourceRoot !== 'string' || state.sourceRoot.trim() === '') {
    throw new Error('Missing sourceRoot');
  }
  if (state.engine !== null && (typeof state.engine !== 'string' || state.engine.trim() === '')) {
    throw new Error('Invalid engine');
  }
  if (JSON.stringify(Object.keys(state.gates)) !== JSON.stringify(GATES)) {
    throw new Error('STATUS.md gate order does not match the presentation pipeline');
  }
  for (const gate of GATES) {
    const item = state.gates[gate];
    assertOneOf(item.status, STATUSES, `status for ${gate}`);
    if (!Array.isArray(item.artifacts)) throw new Error(`Invalid artifacts for ${gate}`);
    for (const artifact of item.artifacts) assertRequiredString(artifact, `artifact for ${gate}`);
    if (item.status === 'passed' && item.artifacts.length === 0) {
      throw new Error(`Passed gate ${gate} is missing artifact provenance`);
    }
    if (item.reviewedAt !== null && typeof item.reviewedAt !== 'string') {
      throw new Error(`Invalid reviewedAt for ${gate}`);
    }
    if (item.invalidatedAt !== null && typeof item.invalidatedAt !== 'string') {
      throw new Error(`Invalid invalidatedAt for ${gate}`);
    }
    if (!Array.isArray(item.inputs)) throw new Error(`Invalid inputs for ${gate}`);
    if (!Array.isArray(item.decisions)) throw new Error(`Invalid decisions for ${gate}`);
    if (!Array.isArray(item.invalidatedBy)) throw new Error(`Invalid invalidatedBy for ${gate}`);
    if (typeof item.reason !== 'string') throw new Error(`Invalid reason for ${gate}`);
    if (typeof item.invalidationReason !== 'string') {
      throw new Error(`Invalid invalidationReason for ${gate}`);
    }
  }
  return state;
}

async function init(root, deckId, sourceRoot, mode, modeReason, force) {
  const state = createState(deckId, sourceRoot, mode, modeReason);
  try {
    await save(root, state, { exclusive: !force });
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'EEXIST') {
      throw new Error(`STATUS.md already exists at ${statusPath(root)}. Use --force to reset it`);
    }
    throw error;
  }
  return state;
}

function parseMetadataOptions(args) {
  const metadata = {};
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!value) throw new Error(`Missing value for ${flag}`);
    if (flag === '--artifact') {
      metadata.artifacts ??= [];
      metadata.artifacts.push(value);
    } else if (flag === '--input') {
      metadata.inputs ??= [];
      metadata.inputs.push(value);
    } else if (flag === '--decision') {
      metadata.decisions ??= [];
      metadata.decisions.push(value);
    } else {
      throw new Error(`Unknown set option "${flag}"`);
    }
  }
  return metadata;
}

function applyGateState(state, gate, status, reason, metadata = {}) {
  assertOneOf(gate, GATES, 'gate');
  assertOneOf(status, STATUSES, 'status');
  assertRequiredString(reason, 'reason');
  const item = state.gates[gate];
  const artifacts = metadata.artifacts ?? item.artifacts;
  if (status === 'passed' && artifacts.length === 0) {
    throw new Error('Passed result requires at least one --artifact <path>');
  }
  state.gates[gate] = {
    ...item,
    status,
    artifacts,
    reviewedAt: new Date().toISOString(),
    inputs: metadata.inputs ?? item.inputs,
    decisions: metadata.decisions ?? item.decisions,
    invalidatedBy: status === 'passed' ? [] : item.invalidatedBy,
    invalidatedAt: status === 'passed' ? null : item.invalidatedAt,
    reason,
    invalidationReason: status === 'passed' ? '' : item.invalidationReason,
  };
  return state;
}

async function setGate(root, gate, status, reason, metadata) {
  const state = validateState(await load(root));
  applyGateState(state, gate, status, reason, metadata);
  await save(root, state);
  return state;
}

function invalidateFrom(state, gate, reason, invalidatedBy = gate) {
  assertOneOf(gate, GATES, 'gate');
  assertRequiredString(reason, 'reason');
  const start = GATES.indexOf(gate);
  for (const affected of GATES.slice(start)) {
    const item = state.gates[affected];
    if (item.status === 'pending' && item.reviewedAt === null) continue;
    state.gates[affected] = {
      ...item,
      status: 'needs_revision',
      invalidatedAt: new Date().toISOString(),
      invalidatedBy: [...new Set([...item.invalidatedBy, invalidatedBy])],
      invalidationReason: reason,
    };
  }
  return state;
}

async function invalidate(root, gate, reason) {
  const state = validateState(await load(root));
  invalidateFrom(state, gate, reason);
  await save(root, state);
  return state;
}

async function setMode(root, mode, reason) {
  assertOneOf(mode, MODES, 'mode');
  assertRequiredString(reason, 'reason');
  const state = validateState(await load(root));
  const previousMode = state.mode;
  state.mode = mode;
  state.modeReviewedAt = new Date().toISOString();
  state.modeReason = reason;
  if (previousMode !== 'research-enhanced' && mode === 'research-enhanced') {
    invalidateFrom(state, 'evidence', reason, 'mode:research-enhanced');
  }
  await save(root, state);
  return state;
}

async function setEngine(root, engine) {
  assertRequiredString(engine, 'engine');
  const state = validateState(await load(root));
  state.engine = engine;
  await save(root, state);
  return state;
}

async function applyResult(root, gate, result, reason, metadata) {
  assertOneOf(gate, GATES, 'gate');
  assertOneOf(result, RESULTS, 'result');
  if (result === 'passed' && (!metadata.artifacts || metadata.artifacts.length === 0)) {
    throw new Error('Passed result requires at least one --artifact <path>');
  }
  const state = validateState(await load(root));
  if (result === 'passed' || result === 'blocked') {
    applyGateState(state, gate, result, reason, metadata);
  } else if (result === 'needs_revision: product-grill') {
    invalidateFrom(state, 'product-grill', reason, gate);
  } else if (result === 'needs_revision: evidence') {
    invalidateFrom(state, 'evidence', reason, gate);
  }
  await save(root, state);
  return state;
}

async function nextGate(root) {
  const state = validateState(await load(root));
  return GATES.find((gate) => state.gates[gate].status !== 'passed') ?? 'complete';
}

async function main(argv) {
  const [command, root, ...args] = argv;
  if (command === 'init') {
    const deckId = args[0];
    const sourceRoot = args[1];
    const mode = args[2] ?? 'general';
    const modeReason = args[3] ?? '';
    const hasForce = args[args.length - 1] === '--force';
    const positional = hasForce ? args.slice(0, -1) : args;
    if (
      !root ||
      positional.length < 2 ||
      positional.length > 4 ||
      (hasForce && args.length - 1 > 4) ||
      (args.length > 5)
    ) {
      throw new Error(
        'Usage: status.mjs init <root> <deck-id> <source-root> [mode] [mode-reason] [--force]',
      );
    }
    await init(root, deckId, sourceRoot, mode, modeReason, hasForce);
  } else if (command === 'validate') {
    if (!root || args.length !== 0) throw new Error('Usage: status.mjs validate <root>');
    validateState(await load(root));
  } else if (command === 'set') {
    if (!root || args.length < 3) {
      throw new Error(
        'Usage: status.mjs set <root> <gate> <status> <reason> [--artifact <path>]... [--input <value>]... [--decision <value>]...',
      );
    }
    await setGate(root, args[0], args[1], args[2], parseMetadataOptions(args.slice(3)));
  } else if (command === 'invalidate') {
    if (!root || args.length !== 2) {
      throw new Error('Usage: status.mjs invalidate <root> <gate> <reason>');
    }
    await invalidate(root, args[0], args[1]);
  } else if (command === 'set-mode') {
    if (!root || args.length !== 2) {
      throw new Error('Usage: status.mjs set-mode <root> <mode> <reason>');
    }
    await setMode(root, args[0], args[1]);
  } else if (command === 'set-engine') {
    if (!root || args.length !== 1) {
      throw new Error('Usage: status.mjs set-engine <root> <engine>');
    }
    await setEngine(root, args[0]);
  } else if (command === 'result') {
    if (!root || args.length < 3) {
      throw new Error(
        'Usage: status.mjs result <root> <gate> <result> <reason> [--artifact <path>]... [--input <value>]... [--decision <value>]...',
      );
    }
    await applyResult(root, args[0], args[1], args[2], parseMetadataOptions(args.slice(3)));
  } else if (command === 'next') {
    if (!root || args.length !== 0) throw new Error('Usage: status.mjs next <root>');
    process.stdout.write(`${await nextGate(root)}\n`);
    return;
  } else {
    throw new Error('Expected command: init, validate, set, invalidate, set-mode, set-engine, result, or next');
  }
  process.stdout.write(`${command} ok\n`);
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
