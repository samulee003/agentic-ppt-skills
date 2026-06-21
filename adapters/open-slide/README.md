# open-slide adapter

This adapter supplies the engine-specific rules for the **prototype** (`deck-prototype`) and **deck-qa** (`production-qa`) gates when the deck is built with [open-slide](https://github.com/1weiho/open-slide) — "the slide framework built for agents."

The pipeline skills (`skills/presentation-prototype`, `skills/presentation-deck-qa`) are engine-agnostic. When the user picks `open-slide` as the engine, those skills read the two files in this folder:

- [`prototype.md`](./prototype.md) — authoring rules for the prototype gate: the 1920×1080 canvas, type scale, the `slides/<id>/index.tsx` file contract, and the live-review surface.
- [`qa.md`](./qa.md) — QA rules for the deck-qa gate: the live canvas, the visual-faithful PPTX + PDF export, 16:9 geometry, and PowerPoint inspection.

## Prerequisites

This adapter assumes an open-slide workspace already exists — either scaffolded fresh or pre-existing:

```bash
npx @open-slide/cli init my-deck
cd my-deck
pnpm dev   # the live canvas this adapter reviews against
```

open-slide ships its own authoring skills (`create-slide`, `slide-authoring`, `apply-comments`, `current-slide`). Where this adapter says "follow `slide-authoring`" or "use `current-slide`", it means those open-slide-native skills inside the workspace. This repo does **not** bundle them — install open-slide to get them.

## Relationship to the pipeline

| Pipeline concept | open-slide realization |
| --- | --- |
| "the real slide source" | `slides/<id>/index.tsx` (one file per slide) |
| "live review surface" | the open-slide dev server canvas + in-browser inspector |
| "canonical authoring rules" | the `slide-authoring` skill (projector-safe typography, 1920×1080 overflow math) |
| "export" | visual-faithful PPTX + PDF via open-slide's exporter |

See the repo root [README](../../README.md) for how the adapter slot fits into the pipeline.
