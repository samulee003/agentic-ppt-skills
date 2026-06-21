# PptxGenJS adapter

This adapter supplies the engine-specific rules for the **prototype** (`deck-prototype`) and **deck-qa** (`production-qa`) gates when the deck is built with [PptxGenJS](https://github.com/gitbrent/PptxGenJS) — a pure-JavaScript library that writes native PPTX directly, no browser or canvas required.

The pipeline skills (`skills/presentation-prototype`, `skills/presentation-deck-qa`) are engine-agnostic. When the user picks `pptxgenjs` as the engine, those skills read the two files in this folder:

- [`prototype.md`](./prototype.md) — authoring rules for the prototype gate: the Node script contract, the 10×5.625 inch (16:9) layout coordinate system, and projector-safe type sizes.
- [`qa.md`](./qa.md) — QA rules for the deck-qa gate: running the script to produce the PPTX, `writeFile` export, native-PowerPoint inspection.

PptxGenJS is the engine to pick when the deliverable must be a **fully editable, native-shape PowerPoint** (text re-flowable, objects selectable) and there is no browser/runtime available. Unlike Marp (image-backed PPTX from Markdown) or open-slide (visual-faithful PPTX from a React canvas), PptxGenJS writes real PPTX shapes from JavaScript.

## Prerequisites

PptxGenJS is an npm library, so it needs a tiny Node project with the dependency installed:

```bash
mkdir -p slides/<deck-id> && cd slides/<deck-id>
npm init -y
npm install pptxgenjs
```

**Node 18+** required. No dev server, no browser, no canvas — the script runs headlessly and writes a `.pptx` file to disk.

## Relationship to the pipeline

| Pipeline concept | PptxGenJS realization |
| --- | --- |
| "the real slide source" | a Node script: `slides/<deck-id>/build.mjs` |
| "live review surface" | render once (`node build.mjs`) and open the produced `.pptx` |
| "canonical authoring rules" | this adapter's `prototype.md` (10×5.625in layout, projector-safe type) |
| "export" | `node build.mjs` calls `pres.writeFile()` — the script IS the export |

See the repo root [README](../../README.md) for how the adapter slot fits into the pipeline.
