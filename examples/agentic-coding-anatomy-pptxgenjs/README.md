# Example: The Anatomy of Agentic Coding (PptxGenJS adapter)

The **same talk** as the sibling [`../agentic-coding-anatomy/`](../agentic-coding-anatomy) (open-slide) and [`../agentic-coding-anatomy-marp/`](../agentic-coding-anatomy-marp) (Marp) examples, but produced end-to-end through the **PptxGenJS adapter**. Same topic, audience, claims, and 5-slide structure — a third, structurally distinct engine. It exists to prove the adapter slot holds heterogeneous engines: identical pipeline, engine-specific artifacts.

> **Engine: this run used the [PptxGenJS adapter](../../adapters/pptxgenjs/).** Gate 6 produced `slides/build.mjs` (a Node script that calls the PptxGenJS API) and gate 8 exported via `node build.mjs` → a **native-shape** PPTX (editable text/objects), plus a PDF via `soffice`. This is the only engine of the three whose PPTX text is fully editable as real PowerPoint shapes — compare with Marp (image-backed pages) and open-slide (visual-faithful shapes from a canvas).

## What's here

```
examples/agentic-coding-anatomy-pptxgenjs/
├── slides/
│   ├── build.mjs                      # gate 6 artifact — the PptxGenJS deck script
│   ├── package.json                   # declares the pptxgenjs dependency
│   └── node_modules/                  # installed locally (gitignored)
├── exports/                           # gate 8 artifacts — real, produced by node build.mjs
│   ├── agentic-coding-anatomy.pptx    # native-shape PPTX (editable text, not images)
│   └── agentic-coding-anatomy.pdf     # 5-page 16:9, via soffice conversion
├── work/STATUS.md                     # the tracker — engine: "pptxgenjs", all 8 gates passed
├── PRESENTATION-BRIEF.md              # gates 1–2
├── EVIDENCE-LEDGER.md                 # gate 3
├── STORY.md                           # gate 4
├── GRILL-LOG.md                       # gates 2/5 (appended)
├── SPEAKER-SCRIPT.md                  # gate 7
├── QA-REPORT.md                       # gate 8
└── source-derivation.md               # how this example relates to the other two
```

## How it differs from the other two examples

| | open-slide | Marp | **PptxGenJS (this)** |
| --- | --- | --- | --- |
| Gate 6 artifact | `index.tsx` (React) | `.md` (Markdown) | `build.mjs` (Node script) |
| Gate 8 export | dev-server UI action | **CLI** `marp deck.md -o` | **`node build.mjs`** → native PPTX |
| PPTX character | visual-faithful shapes | image-backed (each page = image) | **native shapes (editable `<a:t>` text)** |
| PDF | dev-server UI | CLI | soffice conversion |
| Browser needed? | yes | no | **no** |
| Gates 1–5, 7 | identical | identical | identical |

## Reproduce the export

```bash
cd slides
npm install                               # installs pptxgenjs locally
node build.mjs                            # writes ../exports/agentic-coding-anatomy.pptx
# PDF (optional — PptxGenJS does not write PDF directly):
soffice --headless --convert-to pdf ../exports/agentic-coding-anatomy.pptx
```

## Verify the tracker

```bash
node skills/make-presentation/scripts/status.mjs validate work   # → "validate ok"
node skills/make-presentation/scripts/status.mjs next      work   # → "complete"
```

The `STATUS.md` here was generated entirely by the real status helper (not hand-written) — `engine: "pptxgenjs"` is recorded via `set-engine`, and every passed gate carries real `--artifact` paths.
