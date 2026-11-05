import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const exportScript = path.resolve(
  new URL('../skills/make-presentation/scripts/export-deck.mjs', import.meta.url).pathname,
);
const qaScript = path.resolve(
  new URL('../skills/make-presentation/scripts/qa-deck.mjs', import.meta.url).pathname,
);

test('export-deck.mjs reports usage when called without deck-id', async () => {
  await assert.rejects(
    async () => {
      await execFileAsync(process.execPath, [exportScript]);
    },
    (err) => {
      assert.match(err.stderr, /Usage: export-deck\.mjs <deck-id>/);
      return true;
    },
  );
});

test('qa-deck.mjs reports usage when called without deck-id', async () => {
  await assert.rejects(
    async () => {
      await execFileAsync(process.execPath, [qaScript]);
    },
    (err) => {
      assert.match(err.stderr, /Usage: qa-deck\.mjs <deck-id>/);
      return true;
    },
  );
});

async function withDeck(layout, callback) {
  const { mkdtemp, mkdir, writeFile, rm } = await import('node:fs/promises');
  const os = await import('node:os');
  const root = await mkdtemp(path.join(os.tmpdir(), 'agentic-ppt-cli-'));
  try {
    for (const [file, content] of Object.entries(layout)) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), content);
    }
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function run(script, cwd, ...args) {
  return execFileAsync(process.execPath, [script, ...args], { cwd });
}

test('export-deck dispatches marp decks to the Marp CLI per format', async () => {
  await withDeck({ 'slides/demo.md': '# Demo\n' }, async (root) => {
    const { stdout } = await run(exportScript, root, 'demo', '--format=all', '--dry-run');
    assert.match(stdout, /engine \[marp\] → pdf, pptx, html/);
    assert.match(stdout, /@marp-team\/marp-cli@latest .*slides\/demo\.md .*-o .*exports\/demo\.pdf/);
    assert.match(stdout, /-o .*exports\/demo\.pptx/);
    assert.match(stdout, /-o .*exports\/demo\.html/);
    assert.doesNotMatch(stdout, /open-slide/);
  });
});

test('export-deck runs the PptxGenJS build script and converts PDF with soffice', async () => {
  await withDeck({ 'slides/demo/build.mjs': '' }, async (root) => {
    const { stdout } = await run(exportScript, root, 'demo', '--dry-run');
    assert.match(stdout, /engine \[pptxgenjs\]/);
    assert.match(stdout, /slides\/demo\/build\.mjs/);
    assert.match(stdout, /soffice --headless --convert-to pdf --outdir .*exports .*demo\.pptx/);
  });
});

test('export-deck drives the genoffice CLI for genoffice decks', async () => {
  await withDeck(
    { 'slides/demo/outline.json': '{}', 'slides/demo/pages/01.json': '{}' },
    async (root) => {
      const { stdout } = await run(exportScript, root, 'demo', '--dry-run');
      assert.match(stdout, /genoffice create --type pptx --spec .*slides\/demo\/pages --outline/);
      assert.match(stdout, /genoffice convert .*demo\.pptx --to pdf/);
    },
  );
});

test('export-deck prefers the engine recorded in STATUS.md', async () => {
  const status = [
    '<!-- presentation-status:start -->',
    '```json',
    JSON.stringify({ deckId: 'demo', engine: 'open-slide' }),
    '```',
    '<!-- presentation-status:end -->',
  ].join('\n');
  await withDeck(
    { 'presentation-work/demo/STATUS.md': status, 'slides/demo.md': '# Demo\n' },
    async (root) => {
      const { stdout } = await run(exportScript, root, 'demo', '--dry-run');
      assert.match(stdout, /engine \[open-slide\]/);
      assert.match(stdout, /open-slide export demo --format=pdf,pptx/);
    },
  );
});

test('export-deck rejects formats the engine cannot produce', async () => {
  await withDeck({ 'slides/demo/build.mjs': '' }, async (root) => {
    await assert.rejects(run(exportScript, root, 'demo', '--format=html', '--dry-run'), (err) => {
      assert.match(err.stderr, /Engine "pptxgenjs" cannot export "html"/);
      return true;
    });
  });
});

test('export-deck rejects unknown engines and options', async () => {
  await withDeck({}, async (root) => {
    await assert.rejects(run(exportScript, root, 'demo', '--engine=keynote'), (err) => {
      assert.match(err.stderr, /Unknown engine "keynote"/);
      return true;
    });
    await assert.rejects(run(exportScript, root, 'demo', '--bogus'), (err) => {
      assert.match(err.stderr, /Unknown option "--bogus"/);
      return true;
    });
  });
});

test('qa-deck audits genoffice decks and only checks exports for marp', async () => {
  await withDeck({ 'slides/demo/pages/01.json': '{}' }, async (root) => {
    const { stdout } = await run(qaScript, root, 'demo', '--dry-run');
    assert.match(stdout, /genoffice slides audit .*demo\.pptx --json/);
    assert.match(stdout, /genoffice slides read .*demo\.pptx --full --json/);
  });
  await withDeck({ 'slides/demo.md': '# Demo\n' }, async (root) => {
    const { stdout } = await run(qaScript, root, 'demo', '--export', '--dry-run');
    assert.match(stdout, /marp-cli/);
    assert.doesNotMatch(stdout, /open-slide qa/);
  });
});

test('qa-deck fails when expected exports are missing', async () => {
  await withDeck({ 'slides/demo.md': '# Demo\n' }, async (root) => {
    await assert.rejects(run(qaScript, root, 'demo'), (err) => {
      assert.match(err.stdout, /FAILED .*demo\.pdf \(missing\)/);
      assert.match(err.stderr, /Export integrity check failed/);
      return true;
    });
  });
});

test('qa-deck runs pptx-check on existing exports', async () => {
  const { readFile } = await import('node:fs/promises');
  const exportsDir = path.resolve(
    new URL('../examples/agentic-coding-anatomy-pptxgenjs/exports', import.meta.url).pathname,
  );
  await withDeck(
    {
      'slides/agentic-coding-anatomy/build.mjs': '',
      'exports/agentic-coding-anatomy.pptx': await readFile(
        path.join(exportsDir, 'agentic-coding-anatomy.pptx'),
      ),
      'exports/agentic-coding-anatomy.pdf': await readFile(
        path.join(exportsDir, 'agentic-coding-anatomy.pdf'),
      ),
    },
    async (root) => {
      const { stdout } = await run(qaScript, root, 'agentic-coding-anatomy');
      assert.match(stdout, /pptx-check: 5 slides, 5 with notes, PDF 5 pages/);
    },
  );
});


test('options that need a value reject a bare flag', async () => {
  await withDeck({ 'slides/demo.md': '# Demo\n' }, async (root) => {
    await assert.rejects(run(exportScript, root, 'demo', '--format', '--dry-run'), (err) => {
      assert.match(err.stderr, /Option "--format" needs a value/);
      return true;
    });
    await assert.rejects(run(qaScript, root, 'demo', '--dry-run=yes'), (err) => {
      assert.match(err.stderr, /Option "--dry-run" takes no value/);
      return true;
    });
  });
});

test('pptxgenjs build receives --out-dir as DECK_OUT_DIR', async () => {
  const build = [
    "import { writeFileSync, mkdirSync } from 'node:fs';",
    "import path from 'node:path';",
    'mkdirSync(process.env.DECK_OUT_DIR, { recursive: true });',
    "writeFileSync(path.join(process.env.DECK_OUT_DIR, 'demo.pptx'), 'pptx');",
  ].join('\n');
  await withDeck({ 'slides/demo/build.mjs': build }, async (root) => {
    const { stdout } = await run(exportScript, root, 'demo', '--format=pptx', '--out-dir=dist');
    assert.match(stdout, /ok {6}.*dist\/demo\.pptx/);
  });
});

test('pptxgenjs QA treats a missing PDF as optional by default', async () => {
  const { readFile } = await import('node:fs/promises');
  const exportsDir = path.resolve(
    new URL('../examples/agentic-coding-anatomy-pptxgenjs/exports', import.meta.url).pathname,
  );
  await withDeck(
    {
      'slides/agentic-coding-anatomy/build.mjs': '',
      'exports/agentic-coding-anatomy.pptx': await readFile(
        path.join(exportsDir, 'agentic-coding-anatomy.pptx'),
      ),
    },
    async (root) => {
      const { stdout } = await run(qaScript, root, 'agentic-coding-anatomy');
      assert.match(stdout, /skipped .*agentic-coding-anatomy\.pdf \(missing; optional/);
      await assert.rejects(run(qaScript, root, 'agentic-coding-anatomy', '--format=pdf,pptx'));
    },
  );
});

test('an HTML export may be a folder with index.html', async () => {
  const { checkExports, expectedExports } = await import(
    '../skills/make-presentation/scripts/deck-engines.mjs'
  );
  await withDeck({ 'out/demo/index.html': '<html></html>' }, async (root) => {
    const [result] = checkExports(
      expectedExports({ deckId: 'demo', formats: ['html'], outDir: path.join(root, 'out') }),
    );
    assert.equal(result.ok, true);
    assert.match(result.file, /demo\/index\.html$/);
  });
});

test('claude-pptx and codex-slides rebuild from build.mjs like pptxgenjs', async () => {
  await withDeck({ 'slides/demo/build.mjs': '' }, async (root) => {
    for (const engine of ['claude-pptx', 'codex-slides']) {
      const { stdout } = await run(exportScript, root, 'demo', `--engine=${engine}`, '--dry-run');
      assert.match(stdout, new RegExp(`engine \\[${engine}\\]`));
      assert.match(stdout, /slides\/demo\/build\.mjs/);
    }
  });
});

test('a template-edited claude-pptx deck skips the build step', async () => {
  await withDeck({}, async (root) => {
    const { stdout } = await run(exportScript, root, 'demo', '--engine=claude-pptx', '--dry-run');
    assert.doesNotMatch(stdout, /build\.mjs/);
    assert.match(stdout, /soffice --headless --convert-to pdf/);
  });
});

test('google-slides and handoff decks are exported by their own tool', async () => {
  await withDeck({}, async (root) => {
    for (const engine of ['google-slides', 'handoff']) {
      const { stdout } = await run(exportScript, root, 'demo', `--engine=${engine}`, '--dry-run');
      assert.match(stdout, /is exported by its own tool/);
      assert.doesNotMatch(stdout, /^\$ /m);
    }
  });
});

test('handoff QA accepts a PPTX without PDF; google-slides requires the PDF', async () => {
  const { readFile } = await import('node:fs/promises');
  const pptx = await readFile(
    path.resolve(
      new URL(
        '../examples/agentic-coding-anatomy-pptxgenjs/exports/agentic-coding-anatomy.pptx',
        import.meta.url,
      ).pathname,
    ),
  );
  await withDeck({ 'exports/agentic-coding-anatomy.pptx': pptx }, async (root) => {
    const { stdout } = await run(qaScript, root, 'agentic-coding-anatomy', '--engine=handoff');
    assert.match(stdout, /pptx-check: 5 slides, 5 with notes/);
    await assert.rejects(
      run(qaScript, root, 'agentic-coding-anatomy', '--engine=google-slides'),
      (err) => {
        assert.match(err.stdout, /FAILED .*agentic-coding-anatomy\.pdf \(missing\)/);
        return true;
      },
    );
  });
});
