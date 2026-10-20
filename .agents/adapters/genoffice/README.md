# GenOffice adapter

This adapter supplies the engine-specific rules for the **prototype** (`deck-prototype`) and **deck-qa** (`production-qa`) gates when the deck is built with [GenOffice](https://github.com/genspark-ai/genoffice) — the open-source AI Office suite with a local, byte-preserving `.pptx` engine, staged spec builder, geometry auditor, and headless renderer.

The pipeline skills (`skills/presentation-prototype`, `skills/presentation-deck-qa`) are engine-agnostic. When the user picks `genoffice` as the engine, those skills read the two files in this folder:

- [`prototype.md`](./prototype.md) — authoring rules for the prototype gate: the staged `style.md` → `outline.json` → `pages/NN.json` contract, the 1280×720 px canvas, CJK/Latin text-box sizing math, `slides check` validation, and `slides render` / `slides audit` review.
- [`qa.md`](./qa.md) — QA rules for the deck-qa gate: assembling the final `.pptx`, attaching 1:1 speaker notes via `setNotes`, running `slides audit` for zero geometry defects, rendering contact sheets (`render --grid`), and exporting a companion `.pdf`.

GenOffice is the engine to pick when the deliverable must be a **native, byte-preserving, fully editable PowerPoint (`.pptx`)** with built-in CLI geometry auditing (`out_of_bounds`, `text_overflow`, `overlap`, `picture_distorted`), automatic layout checks against a style sheet and outline, and on-device PDF/PNG rendering.

## Prerequisites

GenOffice ships the `genoffice` CLI inside the desktop application (or via its MCP server `genoffice mcp`). Locate the CLI first:

```bash
# 1. Try PATH first
genoffice --version

# 2. Or read the launcher path written by GenOffice on start
cat ~/.genoffice/launcher   # Windows: %USERPROFILE%\.genoffice\launcher

# 3. Or use the default platform binary path:
# macOS:   /Applications/GenOffice.app/Contents/Resources/cli/genoffice
# Windows: %LOCALAPPDATA%\Programs\GenOffice\resources\cli\genoffice.cmd
# Linux:   /opt/GenOffice/resources/cli/genoffice
```

You can also install the standalone `genoffice` skill into any coding agent with:

```bash
npx skills add genspark-ai/genoffice
# or: genoffice skill install all
```

## Relationship to the pipeline

| Pipeline concept | GenOffice realization |
| --- | --- |
| "the real slide source" | `slides/<deck-id>/style.md`, `slides/<deck-id>/outline.json`, and `slides/<deck-id>/pages/NN.json` (one JSON spec per slide on a 1280×720 px canvas) |
| "live review surface" | `genoffice slides check` + `genoffice render <deck.pptx> --out <shots-dir> --grid --json` + `genoffice slides audit <deck.pptx> --json` (or `genoffice open <deck.pptx>` when the user wants to view it in the app) |
| "canonical authoring rules" | `genoffice guide slides design` and `genoffice guide slides spec`, distilled in [`prototype.md`](./prototype.md) |
| "export" | `genoffice create --type pptx --spec ...` (native `.pptx`) + `genoffice convert <deck.pptx> --to pdf` (companion `.pdf`) |

See the repo root [README](../../README.md) for how the adapter slot fits into the pipeline.
