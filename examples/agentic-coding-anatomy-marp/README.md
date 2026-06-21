# Example: The Anatomy of Agentic Coding (Marp adapter)

The **same talk** as the sibling [`../agentic-coding-anatomy/`](../agentic-coding-anatomy) example, but produced end-to-end through the **Marp adapter** instead of open-slide. Same topic, audience, claims, and 5-slide structure — different engine. It exists to prove the adapter slot holds a heterogeneous engine: identical pipeline, engine-specific artifacts.

> **Engine: this run used the [Marp adapter](../../adapters/marp/).** Gate 6 produced `slides/agentic-coding-anatomy.md` (Markdown) and gate 8 exported via the `marp` CLI to `exports/*.pptx` + `.pdf` + `.html`. Compare with the open-slide example, where gate 6 produced `index.tsx` (React) and gate 8 exported via the dev-server UI.

## What's here

```
examples/agentic-coding-anatomy-marp/
├── slides/agentic-coding-anatomy.md   # gate 6 artifact — the Marp deck (single Markdown file)
├── exports/                           # gate 8 artifacts — real, produced by the marp CLI
│   ├── agentic-coding-anatomy.pptx    # image-backed PPTX (visual-faithful, not text-editable)
│   ├── agentic-coding-anatomy.pdf     # 5-page, 16:9
│   └── agentic-coding-anatomy.html    # self-contained, arrow-key navigation
├── work/STATUS.md                     # the tracker — engine: "marp", all 8 gates passed
├── PRESENTATION-BRIEF.md              # gates 1–2
├── EVIDENCE-LEDGER.md                 # gate 3
├── STORY.md                           # gate 4
├── GRILL-LOG.md                       # gates 2/5 (appended)
├── SPEAKER-SCRIPT.md                  # gate 7
├── QA-REPORT.md                       # gate 8
└── source-derivation.md               # how this example relates to the open-slide one
```

## How it differs from the open-slide example

| | open-slide example | this Marp example |
| --- | --- | --- |
| Gate 6 artifact | `apps/demo/slides/.../index.tsx` (React) | `slides/...md` (Markdown) |
| Gate 8 export | dev-server UI action | **CLI**: `marp deck.md -o deck.pptx` |
| PPTX character | visual-faithful shapes | image-backed (each page = one image) |
| Gates 1–5, 7 | identical content | identical content |

## Reproduce the export

```bash
npx @marp-team/marp-cli@latest slides/agentic-coding-anatomy.md -o exports/agentic-coding-anatomy.pptx
npx @marp-team/marp-cli@latest slides/agentic-coding-anatomy.md -o exports/agentic-coding-anatomy.pdf
```

## Verify the tracker

```bash
node skills/make-presentation/scripts/status.mjs validate work   # → "validate ok"
node skills/make-presentation/scripts/status.mjs next      work   # → "complete"
```

The `STATUS.md` here was generated entirely by the real status helper (not hand-written) — `engine: "marp"` is recorded via `set-engine`, and every passed gate carries real `--artifact` paths.
