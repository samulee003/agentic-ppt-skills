# Skills catalog

This page is for people choosing or reviewing a skill. The corresponding
`SKILL.md` files are deliberately concise, imperative contracts for AI agents.
Shared references and templates contain the detailed domain material.

## Pipeline skills

| Gate | Skill | Use it when you need to… | Main output |
| --- | --- | --- | --- |
| 0 | [make-presentation](./make-presentation/SKILL.md) | route a project through the full workflow | `STATUS.md` |
| 1 | [presentation-source-intake](./presentation-source-intake/SKILL.md) | understand and reconcile source materials | `SOURCE-INVENTORY.md` |
| 2 | [presentation-product-grill](./presentation-product-grill/SKILL.md) | clarify audience, outcome, promise, and constraints | `PRESENTATION-BRIEF.md` |
| 3 | [presentation-evidence](./presentation-evidence/SKILL.md) | decide which claims are safe to make | `EVIDENCE-LEDGER.md` |
| 4 | [presentation-story-architecture](./presentation-story-architecture/SKILL.md) | turn decisions into a coherent slide journey | `STORY.md`, `STORYBOARD.md` |
| 5 | [presentation-story-grill](./presentation-story-grill/SKILL.md) | test the story against its strongest opposition | `GRILL-LOG.md` |
| 6 | [presentation-prototype](./presentation-prototype/SKILL.md) | test visual direction before building the full deck | prototype slides |
| 7 | [presentation-stage-grill](./presentation-stage-grill/SKILL.md) | make the deck speakable, timed, and audience-ready | `SPEAKER-SCRIPT.md` |
| 8 | [presentation-deck-qa](./presentation-deck-qa/SKILL.md) | verify previews, exports, notes, and delivery readiness | `QA-REPORT.md` |

## How the two audiences use this repository

- **AI agent:** read the selected `SKILL.md`, then only the references and
  templates it names. Record gate results through `status.mjs`.
- **Human collaborator:** start here to choose a gate, review its output, and
  answer the focused question asked by the agent.
- **Headless run:** follow the autonomous fallback guidance named by the skill;
  do not invent missing decisions silently.

The root [`AGENTS.md`](../AGENTS.md) covers installation and invocation. The
root [`README.md`](../README.md) covers the product overview and adapters.
