# Example: The Anatomy of Agentic Coding

A complete end-to-end run of the presentation pipeline, included so you can see exactly what each gate produces.

## How to read it

Start with [`work/STATUS.md`](./work/STATUS.md) — the pipeline tracker. All eight gates are `passed` in `research-enhanced` mode. Each row links the gate to its artifacts, inputs, decisions, and review reason, so you can trace how an upstream choice flowed downstream.

Then read the artifacts in pipeline order:

| Order | File | Which gate wrote it |
| --- | --- | --- |
| input | [`source/raw_notes.md`](./source/raw_notes.md) | (the only human input — rough notes + a SWE-bench stat) |
| 1 | [`work/SOURCE-INVENTORY.md`](./work/SOURCE-INVENTORY.md) | source-intake |
| 2 | [`work/PRESENTATION-BRIEF.md`](./work/PRESENTATION-BRIEF.md) | product-grill |
| 3 | [`work/EVIDENCE-LEDGER.md`](./work/EVIDENCE-LEDGER.md) | evidence |
| 4 | [`work/STORY.md`](./work/STORY.md) + [`work/STORYBOARD.md`](./work/STORYBOARD.md) | story-architecture |
| 5 | [`work/GRILL-LOG.md`](./work/GRILL-LOG.md) | story-grill (appends here too) |
| 6 | *(deck prototype — not included; would live in a slide source)* | deck-prototype |
| 7 | [`work/SPEAKER-SCRIPT.md`](./work/SPEAKER-SCRIPT.md) | stage-grill |
| 8 | [`work/QA-REPORT.md`](./work/QA-REPORT.md) | production-qa |

## What it demonstrates

- **Mode escalation.** The source notes contained a sourced academic benchmark (SWE-bench) and a numerical comparison, so intake escalated the deck to `research-enhanced` — which triggered A/B/C/D claim-safety classification of the benchmark figure in the evidence ledger.
- **Evidence discipline.** The 1.96% Claude 2 BM25 figure was kept main-talk safe *only* with date, dataset, and retrieval caveats; an unsupported "current comparison number" was explicitly rejected.
- **Provenance.** Every passed gate in `STATUS.md` records real artifact paths, inputs, and the consequential decisions behind it.

## Verify the tracker

```bash
# from the repo root
node skills/make-presentation/scripts/status.mjs validate examples/agentic-coding-anatomy/work   # → "validate ok"
node skills/make-presentation/scripts/status.mjs next      examples/agentic-coding-anatomy/work   # → "complete"
```
