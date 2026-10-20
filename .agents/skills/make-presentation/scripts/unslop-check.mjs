#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const TEXT_EXTENSIONS = new Set(['.md', '.txt', '.tsx', '.ts', '.json']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'exports', 'shots']);

export const RULES = [
  {
    id: 3,
    name: 'superficial -ing phrase',
    pattern: /,\s+(?:highlighting|ensuring|reflecting|showcasing|fostering|underscoring)\b/gi,
    fix: 'delete it or name the real source',
  },
  {
    id: 7,
    name: 'AI vocabulary',
    pattern:
      /\b(?:additionally|crucial|delve[sd]?|pivotal|tapestry|testament|underscores?|vibrant|intricate|interplay|garner(?:s|ed)?)\b/gi,
    fix: 'use the plain word',
  },
  {
    id: 8,
    name: 'fancy "is"',
    pattern: /\b(?:serves as|stands as|boasts)\b/gi,
    fix: 'say "is" or "has"',
  },
  {
    id: 9,
    name: '"not just X, but Y"',
    pattern: /\bnot (?:just|only|merely)\b[^.\n]{0,80}\bbut(?: also)?\b/gi,
    fix: 'state the point directly',
  },
  {
    id: 13,
    name: 'em dash',
    pattern: /—/g,
    fix: 'use a period or comma',
    englishOnly: true,
  },
  {
    id: 20,
    name: 'chatbot phrase',
    pattern: /\b(?:i hope this helps|let me know if|certainly!|of course!)/gi,
    fix: 'remove',
  },
  {
    id: 23,
    name: 'filler phrase',
    pattern:
      /\b(?:in order to|due to the fact that|it is important to note that|it(?:'|’)s worth noting that)\b/gi,
    fix: 'shorten or delete',
  },
  {
    id: 25,
    name: 'generic conclusion',
    pattern: /\b(?:the future looks bright|only time will tell|exciting times ahead)\b/gi,
    fix: 'state a specific next step, date, or number',
  },
  {
    id: 26,
    name: 'abstract metaphor noun',
    pattern: /\b(?:substrate|nexus|paradigm|bedrock|north star|flywheel|tapestry)\b/gi,
    fix: 'use the concrete word',
  },
  {
    id: 31,
    name: 'inflated verb',
    pattern: /\b(?:utili[sz]e[sd]?|leverag(?:e|es|ed|ing)|facilitat(?:e|es|ed|ing))\b/gi,
    fix: 'use "use" or "help"',
  },
  {
    id: 'zh-1',
    name: 'Chinese contrast frame',
    pattern: /不僅僅?是[^。\n]{0,40}(?:更是|而是|也是)/g,
    fix: '直接說結論，不用「不僅…更是」',
  },
  {
    id: 'zh-2',
    name: 'Chinese filler or AI idiom',
    pattern: /值得注意的是|需要指出的是|綜上所述|總而言之|讓我們一起|賦能|閉環|抓手|顆粒度/g,
    fix: '刪掉，或換成具體的數字與動作',
  },
];

function hasCjk(line) {
  return /[\u3400-\u9fff]/.test(line);
}

export function scanText(text) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  let inFence = false;
  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    for (const rule of RULES) {
      if (rule.englishOnly && hasCjk(line)) continue;
      rule.pattern.lastIndex = 0;
      for (const match of line.matchAll(rule.pattern)) {
        findings.push({
          line: index + 1,
          rule: rule.id,
          name: rule.name,
          text: match[0],
          fix: rule.fix,
        });
      }
    }
  });
  return findings;
}

async function collect(target, files) {
  const info = await stat(target);
  if (info.isDirectory()) {
    for (const entry of await readdir(target, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
      await collect(path.join(target, entry.name), files);
    }
  } else if (TEXT_EXTENSIONS.has(path.extname(target))) {
    files.push(target);
  }
}

async function main(argv) {
  const strict = argv.includes('--strict');
  const targets = argv.filter((arg) => arg !== '--strict');
  if (targets.length === 0) {
    throw new Error('Usage: unslop-check.mjs <file-or-dir>... [--strict]');
  }
  const files = [];
  for (const target of targets) await collect(target, files);

  let total = 0;
  for (const file of files) {
    const findings = scanText(await readFile(file, 'utf8'));
    for (const finding of findings) {
      total += 1;
      process.stdout.write(
        `${file}:${finding.line}  rule ${finding.rule} (${finding.name})  "${finding.text}"  -> ${finding.fix}\n`,
      );
    }
  }
  process.stdout.write(`unslop-check: ${total} finding(s) in ${files.length} file(s)\n`);
  if (strict && total > 0) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  });
}
