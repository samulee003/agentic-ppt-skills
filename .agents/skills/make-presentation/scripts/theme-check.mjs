#!/usr/bin/env node
// Checks the `json theme` block of theme files: required fields, valid hex
// colours, WCAG AA contrast for body pairs (4.5:1) and large-text pairs (3:1).
// Usage: theme-check.mjs <theme.md>... (defaults to every theme next to this skill)

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BODY_MIN = 4.5;
export const LARGE_MIN = 3;

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function parseTheme(markdown) {
  const match = markdown.match(/```json theme\s*\n([\s\S]*?)```/);
  if (!match) throw new Error('missing a ```json theme block');
  return JSON.parse(match[1]);
}

export function checkTheme(theme) {
  const errors = [];
  if (!theme.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(theme.id)) errors.push('id must be kebab-case');
  const palette = theme.palette ?? {};
  for (const [name, value] of Object.entries(palette)) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(value)) errors.push(`palette.${name} is not a #RRGGBB colour`);
  }
  if (!Array.isArray(theme.bodyPairs) || theme.bodyPairs.length === 0) {
    errors.push('bodyPairs must list at least the main text/background pair');
  }
  const pairs = [
    ...(theme.bodyPairs ?? []).map((pair) => [pair, BODY_MIN, 'body']),
    ...(theme.largeOnlyPairs ?? []).map((pair) => [pair, LARGE_MIN, 'large-text']),
  ];
  for (const [[fg, bg], min, kind] of pairs) {
    if (!palette[fg] || !palette[bg]) {
      errors.push(`${kind} pair ${fg}/${bg} names a colour missing from the palette`);
      continue;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(palette[fg]) || !/^#[0-9A-Fa-f]{6}$/.test(palette[bg])) continue;
    const ratio = contrast(palette[fg], palette[bg]);
    if (ratio < min) {
      errors.push(`${kind} pair ${fg}/${bg} is ${ratio.toFixed(2)}:1, below ${min}:1`);
    }
  }
  return errors;
}

function main(argv) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const themeDir = path.join(here, '..', 'themes');
  const files = argv.length
    ? argv
    : readdirSync(themeDir)
        .filter((name) => name.endsWith('.md') && name !== 'README.md')
        .map((name) => path.join(themeDir, name));
  let failed = 0;
  for (const file of files) {
    let errors;
    try {
      errors = checkTheme(parseTheme(readFileSync(file, 'utf8')));
    } catch (error) {
      errors = [error instanceof Error ? error.message : String(error)];
    }
    if (errors.length === 0) process.stdout.write(`ok      ${file}\n`);
    else {
      failed += 1;
      for (const error of errors) process.stdout.write(`error   ${file}: ${error}\n`);
    }
  }
  if (failed > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main(process.argv.slice(2));
}
