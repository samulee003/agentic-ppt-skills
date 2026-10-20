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

## Engine & document skills

| Skill | Use it when you need to… |
| --- | --- |
| [genoffice](./genoffice/SKILL.md) | create, convert, read, audit, render, and edit native `.pptx`, `.docx`, `.xlsx`, and `.pdf` files locally via the GenOffice CLI or MCP server |
| [open-slide-deck-finalization](./open-slide-deck-finalization/SKILL.md) | standalone finalization shortcut specifically for `open-slide` workspaces |

## Shared practices (`make-presentation/references/`)

Adapted from [`backnotprop/pstack`](https://github.com/backnotprop/pstack) (MIT).

| Reference | Use it when you need to… |
| --- | --- |
| [sharpen-playback.md](./make-presentation/references/sharpen-playback.md) | avoid interrogation fatigue at `product-grill` |
| [unslop-copy.md](./make-presentation/references/unslop-copy.md) + [`unslop-check.mjs`](./make-presentation/scripts/unslop-check.mjs) | remove AI tells from slide copy and notes |
| [review-buckets.md](./make-presentation/references/review-buckets.md) | turn review findings into Act on / Consider / Noted / Dismissed |
| [arena-prototype.md](./make-presentation/references/arena-prototype.md) | compare 2 to 3 prototype directions and graft the best parts |
| [encode-lessons.md](./make-presentation/references/encode-lessons.md) | stop repeated mistakes with checks instead of docs |

## Bundled engine adapters (`.agents/adapters/`)

| Engine | Adapter | Output |
| --- | --- | --- |
| `open-slide` | [`adapters/open-slide/`](../adapters/open-slide/README.md) | React `1920×1080` live canvas + visual-faithful `.pptx` & `.pdf` |
| `genoffice` | [`adapters/genoffice/`](../adapters/genoffice/README.md) | Staged `style.md` + `outline.json` + `pages/NN.json` (`1280×720` px) → native byte-preserving `.pptx`, `slides audit`, grid PNGs, and `.pdf` |
| `marp` | [`adapters/marp/`](../adapters/marp/README.md) | Markdown slide deck → Marp CLI `.pptx` & `.pdf` |
| `pptxgenjs` | [`adapters/pptxgenjs/`](../adapters/pptxgenjs/README.md) | Node script (`build.mjs`) → native-shape `.pptx` |

## How the two audiences use this repository

- **AI agent:** read the selected `SKILL.md`, then only the references and
  templates it names. Record gate results through `status.mjs`.
- **Human collaborator:** start here to choose a gate, review its output, and
  answer the focused question asked by the agent.
- **Headless run:** follow the autonomous fallback guidance named by the skill;
  do not invent missing decisions silently.

The root [`AGENTS.md`](../AGENTS.md) covers installation and invocation. The
root [`README.md`](../README.md) covers the product overview and adapters.
