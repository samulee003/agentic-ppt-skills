# agentic-ppt-skills

A portable set of **agent skills** that turn raw materials — a folder of notes, an existing deck, or just an idea — into a finished, stage-ready presentation through a disciplined 8-gate pipeline.

These are [agent skills](https://modelcontextprotocol.io) (markdown instructions + a zero-dependency status helper) for coding agents like Claude Code, Cursor, or any tool that loads `.agents/skills/` or `.claude/skills/`. Drop them in and your agent gains a repeatable presentation workflow: **source → product → evidence → story → prototype → stage → delivery**.

> Extracted from the [open-slide](https://github.com/1weiho/open-slide) framework. This repo ships the **presentation pipeline methodology** as standalone skills; the open-slide framework additionally provides the slide-authoring runtime (`create-slide`, `slide-authoring`) these skills are designed to pair with.

---

## The pipeline

One orchestrator routes eight focused gates, one at a time. Each gate has a single skill, a defined pass condition, and a named artifact.

```
source-intake → product-grill → evidence → story-architecture
      → story-grill → deck-prototype → stage-grill → production-qa
```

| Gate | Skill | Passes when | Produces |
| --- | --- | --- | --- |
| `source-intake` | `presentation-source-intake` | Materials inventoried, authoritative versions known, conflicts explicit | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | Audience, problem, outcome, promise, constraints all explicit | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | Every material claim supported, qualified, moved to notes, or rejected | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | Every chapter advances the outcome; each slide has one job + one message | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | The strongest opposing case considered, story still holds | `GRILL-LOG.md` |
| `deck-prototype` | `presentation-prototype` | Representative pages follow projector-safe typography rules | `slides/<deck-id>/` |
| `stage-grill` | `presentation-stage-grill` | Readable, speakable, timed, defensible, audience-appropriate | `SPEAKER-SCRIPT.md` |
| `production-qa` | `open-slide-deck-finalization` | Works in browser, PDF, and PowerPoint with no material defects | `QA-REPORT.md` + PPTX + PDF |

The orchestrator **never skips ahead** because an artifact exists — it resumes from the earliest unresolved gate, reuses equivalent work, and invalidates downstream gates when an upstream decision changes.

### Modes

- **`general`** — internal, creative, or low-risk decks. Evidence stays proportionate.
- **`research-enhanced`** — decks with consequential external claims, citations, datasets, statistics, policy, law, medicine, finance. Adds claim safety levels (A/B/C/D), primary-source preference, exact dates/units/denominators, stale-value checks, opposition critique, and per-slide fact checks. Re-evaluated after source intake; upgrading to it automatically invalidates reviewed evidence work.

## Install

```bash
# from the root of any agent-enabled project
cp -r skills/* .agents/skills/
# Claude Code also reads .claude/skills/ — symlink or copy there too if needed
```

The orchestrator lives at `make-presentation`. Once installed, just tell your agent what you want:

> "Make a presentation from the notes in `./research/`."

It will route itself through the gates, writing a `STATUS.md` tracker to `presentation-work/<deck-id>/` as it goes.

### The status helper

`make-presentation/scripts/status.mjs` is a zero-dependency Node script (Node 18+) that owns the pipeline state machine. Agents call it instead of hand-editing status:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> <mode> "<mode-reason>"
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # earliest unresolved gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
```

It validates gate order, enforces artifact provenance (a passed gate must record real `--artifact` paths), migrates legacy state, and renders both machine-readable JSON and a human-readable table into `STATUS.md`. See `skills/make-presentation/references/status-schema.md` for the full contract.

## Example: `agentic-coding-anatomy`

[`examples/agentic-coding-anatomy/`](./examples/agentic-coding-anatomy) is a **complete end-to-end run** of the pipeline: a short folder of raw notes ("The Anatomy of Agentic Coding") routed all the way through to a passed production-qa gate in `research-enhanced` mode.

Read it to see what each gate actually produces:

```
examples/agentic-coding-anatomy/
├── source/raw_notes.md      # the only input — rough notes + a SWE-bench stat
└── work/                    # everything the pipeline wrote
    ├── STATUS.md            # the tracker — start here: 8 gates, all passed
    ├── SOURCE-INVENTORY.md
    ├── PRESENTATION-BRIEF.md
    ├── EVIDENCE-LEDGER.md   # the SWE-bench 1.96% claim classified to safety level A
    ├── STORY.md
    ├── STORYBOARD.md
    ├── GRILL-LOG.md
    ├── SPEAKER-SCRIPT.md
    └── QA-REPORT.md
```

Verify the example's tracker is schema-valid against the shipped helper:

```bash
node skills/make-presentation/scripts/status.mjs validate examples/agentic-coding-anatomy/work
node skills/make-presentation/scripts/status.mjs next      examples/agentic-coding-anatomy/work   # → "complete"
```

## Relationship to open-slide

This repo is **pipeline methodology only**. Three skills reference open-slide's slide-authoring tools (`slide-authoring`, `create-slide`, `current-slide`) for the prototype and finalization gates — those provide the projector-safe typography rules, the slide component system, and the PPTX/PDF export that `production-qa` verifies. The pipeline still works without them (the story, evidence, and grilling gates are fully self-contained); pairing with open-slide gives you the authored deck and exports.

## License

MIT — same as open-slide. See [LICENSE](./LICENSE).
