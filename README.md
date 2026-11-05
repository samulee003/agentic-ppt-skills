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
Prototype and production QA use an adapter. Eight are included: `open-slide`,
`genoffice`, `marp`, `pptxgenjs`, `claude-pptx` (Claude's own `pptx` skill),
`codex-slides` (Codex's `slides` skill), `google-slides`, and `handoff` (any tool
the agent cannot drive, such as ChatGPT, Gamma, or Canva). The standalone
`genoffice` skill creates, reads, audits, renders, and converts local Office
files.

Shared practices in `skills/make-presentation/references/` are adapted from
[`backnotprop/pstack`](https://github.com/backnotprop/pstack) (MIT): sharpen and
playback, unslop copy checks (`scripts/unslop-check.mjs`), review buckets,
prototype arena, and encode-lessons. Headless export runs each engine's own CLI through
`scripts/export-deck.mjs`; `scripts/qa-deck.mjs` runs the engine's audit (open-slide,
GenOffice) and checks export integrity for every engine.
Grilling in frontier rounds (the whole set of unblocked questions per round, "yes"
accepts the recommendation) comes from [`mattpocock/skills`](https://github.com/mattpocock/skills)
(MIT), alongside `grill-me`, `grilling`, and `to-questionnaire`.

### Which tool builds the slides

The pipeline decides *what* the deck says and *whether it is ready*. The slide
file can come from any of these, and every one goes through the same checks on
the exported `.pptx`/`.pdf`:

| You use | Engine | How the slides get built |
| --- | --- | --- |
| Claude (Claude Code or claude.ai) | `claude-pptx` | Claude's `pptx` skill writes a PptxGenJS script or edits a template; native, editable `.pptx`. In Claude Code, install it with `/plugin marketplace add anthropics/skills` and `/plugin install document-skills@anthropic-agent-skills`. |
| Codex | `codex-slides` | the `slides` skill from [`openai/skills`](https://github.com/openai/skills), with its render and overflow checks |
| Google Slides | `google-slides` | the Slides API or an agent's Google Slides connector, or a `.pptx` imported into Slides; exported back as `.pptx`/`.pdf` for QA |
| ChatGPT, Gamma, Canva, Copilot, Keynote, a designer | `handoff` | `build-packet.mjs` writes a `BUILD-PACKET.md` to paste into the tool; its exported `.pptx` comes back for QA |
| a script, no platform skill | `pptxgenjs` | a PptxGenJS `build.mjs` |
| an existing Office file whose master must survive | `genoffice` | the GenOffice CLI |
| a browser canvas / Markdown | `open-slide` / `marp` | their own CLIs |

Rules:

- The orchestrator owns the gates. A builder never marks a gate passed and
  never skips evidence, story, or stage review.
- Record the engine with `status.mjs set-engine` at the prototype gate and
  follow `adapters/<engine>/`. The theme, type scale, and storyboard win over a
  builder's own design defaults.
- Tools that export only images (or no `.pptx`) cannot pass note-parity and
  editability checks; say so before choosing them.

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
- `adapters/` — engine-specific prototype and QA instructions (`open-slide`, `genoffice`, `marp`, `pptxgenjs`, `claude-pptx`, `codex-slides`, `google-slides`, `handoff`)
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
