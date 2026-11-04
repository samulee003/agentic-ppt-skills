# agentic-ppt-skills

[English](./README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md)

Engine-agnostic agent skills for turning notes, an existing deck, or an idea
into a finished, stage-ready presentation.

## For people

The repository provides an eight-gate workflow:

```text
source → product → evidence → story → story review → prototype → stage → delivery
```

Each gate has one focused skill and a named deliverable:

| Gate | Skill | Deliverable |
| --- | --- | --- |
| Source intake | `presentation-source-intake` | `SOURCE-INVENTORY.md` |
| Product definition | `presentation-product-grill` | `PRESENTATION-BRIEF.md` |
| Evidence | `presentation-evidence` | `EVIDENCE-LEDGER.md` |
| Story architecture | `presentation-story-architecture` | `STORY.md`, `STORYBOARD.md` |
| Story review | `presentation-story-grill` | `GRILL-LOG.md` |
| Prototype | `presentation-prototype` | Representative deck |
| Stage review | `presentation-stage-grill` | `SPEAKER-SCRIPT.md` |
| Production QA | `presentation-deck-qa` | `QA-REPORT.md`, exports |

### What makes it different

- **Product first.** The brief fixes the deck type (decision, update, pitch,
  training, keynote, technical), audience, promise, deliverables (presenting or
  reading deck, editable `.pptx` or not), brand template, and theme before any
  slide exists.
- **Every claim has a source.** The evidence ledger holds one row per claim and
  one row per non-original asset with its licence.
- **Titles carry the argument.** Each slide has a full-sentence action title and
  a layout archetype; reading the titles alone must tell the story.
- **Machine-checked, not self-certified.** Zero-dependency scripts check the
  storyboard (titles, archetypes, evidence IDs, timing), theme contrast, and the
  exported `.pptx` (slide/note/PDF parity, type floors, alt text, density).
- **Neutral core, pluggable style.** Language rules, story structure, and visual
  style live in profiles (`default`, `training-zh-hant`) and themes
  (`editorial-minimal`, `bright-sans`, `aurora`, `sticker-pop`), on one
  engine-independent type scale.

The pipeline supports `general`, `fast-track`, and `research-enhanced` modes.
Prototype and production QA use an adapter; `open-slide`, `genoffice`, `marp`,
and `pptxgenjs` are included, alongside the standalone `genoffice` skill for
creating, reading, auditing, rendering, and converting local Office files.

Shared practices in `skills/make-presentation/references/` are adapted from
[`backnotprop/pstack`](https://github.com/backnotprop/pstack) (MIT): sharpen and
playback, unslop copy checks (`scripts/unslop-check.mjs`), review buckets,
prototype arena, and encode-lessons. Headless export runs each engine's own CLI through
`scripts/export-deck.mjs`; `scripts/qa-deck.mjs` runs the engine's audit (open-slide,
GenOffice) and checks export integrity for every engine.
Grilling in frontier rounds (the whole set of unblocked questions per round, "yes"
accepts the recommendation) comes from [`mattpocock/skills`](https://github.com/mattpocock/skills)
(MIT), alongside `grill-me`, `grilling`, and `to-questionnaire`.

### Pairing with platform PPT skills

These skills decide *what* the deck says and *whether it is ready*; they can
work alongside a runtime's own PowerPoint skill, which handles *how the file
is built*:

| Runtime | Platform skill | Where it fits |
| --- | --- | --- |
| Claude Code | `pptx` from [`anthropics/skills`](https://github.com/anthropics/skills) (`document-skills` plugin; source-available, not open source) | `source-intake`: read text and structure from an existing `.pptx`. `deck-prototype` / `production-qa`: build and edit the file under the `pptxgenjs` adapter, which uses the same library. |
| Codex | `slides` from [`openai/skills`](https://github.com/openai/skills) (PptxGenJS plus render and overflow checks) | Same slots. Its render and overflow checks can supply evidence for `QA-REPORT.md`. |

Rules when combining them:

- The orchestrator still owns the gates. A platform skill never marks a gate
  passed and never skips evidence, story, or stage review.
- Record the engine as `pptxgenjs` with `set-engine` and follow
  `adapters/pptxgenjs/` for canvas budgets, typography, and notes. The platform
  skill's own design defaults give way to those rules.
- Choose one runtime directory (`.agents/skills/` or `.claude/skills/`) and keep
  only one presentation-building skill active per gate, so two skills do not
  write the same file.

### Install

From the root of a project where an agent should use these skills:

```bash
SRC=/absolute/path/to/agentic-ppt-skills  # replace with this checkout's path
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

Then ask your agent to make a presentation, for example:

> Make a presentation from the notes in `./research/`.

The orchestrator resumes from the earliest unresolved gate and records state in
`presentation-work/<deck-id>/STATUS.md`.

### Repository layout

- `skills/` — distributable, engine-agnostic skills (including `genoffice`, `grilling`, `grill-me`, and `to-questionnaire`)
- `adapters/` — engine-specific prototype and export instructions (`open-slide`, `genoffice`, `marp`, `pptxgenjs`)
- `examples/` — a complete pipeline run
- `.agents/` — the maintainers' own agent setup: mirrors of `skills/` and `adapters/` (checked by `npm test`) plus third-party skills that are not installed; see [`.agents/README.md`](./.agents/README.md)

## For AI agents

Operational installation and invocation instructions are intentionally kept in
[`AGENTS.md`](./AGENTS.md). Read that file before installing or starting the
pipeline. The individual `SKILL.md` files are the source of truth for gate
execution.

## License

MIT. See [`LICENSE`](./LICENSE).

## Tests

Run the zero-dependency tests (status helper, storyboard/theme/PPTX checks, export/QA dispatch, unslop checker, and `.agents/` mirror checks) with:

```bash
npm test
```
