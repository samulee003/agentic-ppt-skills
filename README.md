# agentic-ppt-skills

Engine-agnostic agent skills for turning notes, an existing deck, or an idea
into a finished, stage-ready presentation.

## For people

The repository provides an eight-gate workflow:

```text
source → product → evidence → story → prototype → stage → delivery
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

The pipeline supports `general` and `research-enhanced` modes. Prototype and
production QA use an adapter; `open-slide`, `marp`, and `pptxgenjs` are included.

### Install

From the root of a project where an agent should use these skills:

```bash
SRC=/absolute/path/to/agentic-ppt-skills
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

Then ask your agent to make a presentation, for example:

> Make a presentation from the notes in `./research/`.

The orchestrator resumes from the earliest unresolved gate and records state in
`presentation-work/<deck-id>/STATUS.md`.

### Repository layout

- `skills/` — distributable, engine-agnostic skills
- `adapters/` — engine-specific prototype and export instructions
- `examples/` — a complete pipeline run
- `.agents/` — bundled development/reference copies

## For AI agents

Operational installation and invocation instructions are intentionally kept in
[`AGENTS.md`](./AGENTS.md). Read that file before installing or starting the
pipeline. The individual `SKILL.md` files are the source of truth for gate
execution.

## License

MIT. See [`LICENSE`](./LICENSE).
