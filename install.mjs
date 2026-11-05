#!/usr/bin/env node
// One-command installer for agentic-ppt-skills.
//   npx --yes github:samulee003/agentic-ppt-skills [target-dir] [--runtime=agents|claude|workbuddy] [--to=<folder>] [--force]
//   node install.mjs [target-dir] [--runtime=agents|claude|workbuddy] [--to=<folder>] [--force]
// Copies skills/ and adapters/ into <target>/.agents/ (most runtimes, Codex
// included), <target>/.claude/ (Claude Code), ~/.workbuddy/ (WorkBuddy), or any
// <folder> whose skills/ subfolder your runtime reads, then verifies the install.

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const USAGE = 'Usage: install.mjs [target-dir] [--runtime=agents|claude|workbuddy] [--to=<folder>] [--force]\n';

export function expandHome(value) {
  return path.resolve(value.replace(/^~(?=$|[\\/])/, os.homedir()));
}

/** The folder that receives skills/ and adapters/. */
export function installRoot({ target, runtime, to }) {
  if (to) return to;
  if (runtime === 'workbuddy') return path.join(os.homedir(), '.workbuddy');
  return path.join(target, runtime === 'claude' ? '.claude' : '.agents');
}

export function parseArgs(argv) {
  const options = { target: process.cwd(), runtime: 'agents', force: false, to: null };
  for (const arg of argv) {
    if (arg === '--force') options.force = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--runtime=')) options.runtime = arg.slice('--runtime='.length);
    else if (arg.startsWith('--to=')) options.to = expandHome(arg.slice('--to='.length));
    else if (arg.startsWith('-')) throw new Error(`Unknown option "${arg}"`);
    else options.target = path.resolve(arg);
  }
  if (!['agents', 'claude', 'workbuddy'].includes(options.runtime)) {
    throw new Error(`--runtime must be "agents", "claude", or "workbuddy", not "${options.runtime}"`);
  }
  return options;
}

export function install({ target, runtime, force, to = null }, log = (line) => process.stdout.write(line)) {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 18) throw new Error(`Node 18 or newer is required (found ${process.versions.node})`);
  if (!to && runtime !== 'workbuddy' && path.resolve(target) === path.resolve(SRC)) {
    throw new Error('Run the installer from your project folder (or pass it as target-dir), not from this repository');
  }

  const root = installRoot({ target, runtime, to });
  if (path.resolve(root).startsWith(path.resolve(SRC) + path.sep)) {
    throw new Error('Install into your project or runtime folder, not into this repository');
  }
  const other = path.join(target, runtime === 'claude' ? '.agents' : '.claude');
  const orchestrator = (base) => path.join(base, 'skills', 'make-presentation', 'SKILL.md');
  const source = readFileSync(orchestrator(SRC), 'utf8');

  if (existsSync(orchestrator(root)) && readFileSync(orchestrator(root), 'utf8') !== source && !force) {
    throw new Error(
      `${orchestrator(root)} differs from this version (local edits or an older install). Re-run with --force to replace the installed skills and adapters.`,
    );
  }
  if (!to && runtime !== 'workbuddy' && existsSync(orchestrator(other)) && readFileSync(orchestrator(other), 'utf8') !== source) {
    log(
      `warning  ${orchestrator(other)} also exists with different content; agents may load the wrong copy. Remove one of them.\n`,
    );
  }

  for (const dir of ['skills', 'adapters']) {
    mkdirSync(path.join(root, dir), { recursive: true });
    for (const entry of readdirSync(path.join(SRC, dir), { withFileTypes: true })) {
      const destination = path.join(root, dir, entry.name);
      // Replace each shipped skill or adapter whole, so files a newer version
      // dropped do not linger. Other skills in the folder are left alone.
      rmSync(destination, { recursive: true, force: true });
      cpSync(path.join(SRC, dir, entry.name), destination, { recursive: true });
    }
  }

  const status = path.join(root, 'skills', 'make-presentation', 'scripts', 'status.mjs');
  const probe = spawnSync(process.execPath, [status], { encoding: 'utf8' });
  if (!/Expected command/.test(probe.stderr)) {
    throw new Error(`Installed, but the status helper did not run: ${probe.stderr || probe.stdout}`);
  }
  const adapters = readdirSync(path.join(root, 'adapters')).sort();
  log(`installed  ${path.join(root, 'skills')} (${readdirSync(path.join(root, 'skills')).length} entries)\n`);
  log(`installed  ${path.join(root, 'adapters')} (${adapters.join(', ')})\n`);
  log('verified   status helper runs\n');
  log(
    `\nNext: ask your agent, for example "Make a presentation from the notes in ./notes".\n` +
      (runtime === 'claude'
        ? 'Claude Code reads .claude/skills/; commands in the skills use .agents/skills/ paths, so substitute .claude/skills/.\n'
        : runtime === 'workbuddy'
          ? 'WorkBuddy routes PPT requests to its built-in skill: say "use make-presentation" explicitly. Build engine: workbuddy-pptx.\n'
          : ''),
  );
  return { root, adapters };
}

// npx runs the bin through a symlink, so compare real paths.
const invokedDirectly =
  process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
if (invokedDirectly) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) process.stdout.write(USAGE);
    else install(options);
  } catch (error) {
    process.stderr.write(`install error: ${error instanceof Error ? error.message : error}\n${USAGE}`);
    process.exit(1);
  }
}
