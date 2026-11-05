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

## Grilling skills (from [`mattpocock/skills`](https://github.com/mattpocock/skills), MIT)

| Skill | Use it when you need to… |
| --- | --- |
| [grilling](./grilling/SKILL.md) | stress-test a plan in frontier rounds, each question with a recommended answer |
| [grill-me](./grill-me/SKILL.md) | run the same interview on demand (user-invoked only) |
| [to-questionnaire](./to-questionnaire/SKILL.md) | turn open decisions that someone else must answer into a fill-in questionnaire |

## Profiles, deck types, and themes

| Path | Use it when you need to… |
| --- | --- |
| [`make-presentation/profiles/`](./make-presentation/profiles/README.md) | apply a bundle of defaults for recurring work (`default`, `training-zh-hant`) |
| [`references/deck-types.md`](./make-presentation/references/deck-types.md) | pick the story structure for a decision, update, pitch, training, keynote, or technical deck; presenting vs reading deck; action titles |
| [`make-presentation/themes/`](./make-presentation/themes/README.md) | choose a visual rendering contract (`editorial-minimal`, `bright-sans`, `aurora`, `sticker-pop`) |
| [`references/typography.md`](./make-presentation/references/typography.md) | one type scale and two floors for every engine, as a share of slide height |
| [`references/data-slides.md`](./make-presentation/references/data-slides.md) | turn numbers into honest, one-point charts |
| [`references/revise-existing.md`](./make-presentation/references/revise-existing.md) | polish, rebrand, translate, or restructure an existing deck |

## Shared practices (`make-presentation/references/`)

Adapted from [`backnotprop/pstack`](https://github.com/backnotprop/pstack) (MIT).

| Reference | Use it when you need to… |
| --- | --- |
| [grill-tree.md](./make-presentation/references/grill-tree.md) | the presentation decision tree the grill gates work through, with load-bearing nodes |
| [grilling-rounds.md](./make-presentation/references/grilling-rounds.md) | grill the user in frontier rounds instead of one question per turn (from [`mattpocock/skills`](https://github.com/mattpocock/skills)) |
| [interrogate.md](./make-presentation/references/interrogate.md) | attack the deck with adversarial audience members; only proven findings survive (from pstack `interrogate`) |
| [retro.md](./make-presentation/references/retro.md) | after the talk, grill the user about what happened and route learnings into checks, the tree, profiles, or themes (from pstack `reflect`) |
| [sharpen-playback.md](./make-presentation/references/sharpen-playback.md) | avoid interrogation fatigue at `product-grill` |
| [unslop-copy.md](./make-presentation/references/unslop-copy.md) + [`unslop-check.mjs`](./make-presentation/scripts/unslop-check.mjs) | remove AI tells from slide copy and notes |
| [review-buckets.md](./make-presentation/references/review-buckets.md) | turn review findings into Act on / Consider / Noted / Dismissed |
| [arena-prototype.md](./make-presentation/references/arena-prototype.md) | compare 2 to 3 prototype directions and graft the best parts |
| [encode-lessons.md](./make-presentation/references/encode-lessons.md) | stop repeated mistakes with checks instead of docs |

## Scripts (`make-presentation/scripts/`, zero dependencies)

| Script | Gate | What it checks or does |
| --- | --- | --- |
| [`status.mjs`](./make-presentation/scripts/status.mjs) | all | pipeline state, gate order, invalidation; `brief` prints a resume capsule (from pstack `recall`) |
| [`source-check.mjs`](./make-presentation/scripts/source-check.mjs) | source-intake | every path in `SOURCE-INVENTORY.md` exists |
| [`ledger-check.mjs`](./make-presentation/scripts/ledger-check.mjs) | evidence, story-architecture, story-grill | claim rows complete; no safety C/D claim in the main talk; numbers cite evidence; assets licensed |
| [`plan-check.mjs`](./make-presentation/scripts/plan-check.mjs) | production-qa (via `qa-deck`) | the export matches the plan: slide count, action titles, speaker notes |
| [`grill-check.mjs`](./make-presentation/scripts/grill-check.mjs) | every grill gate, production-qa | every tree node settled; no reasonless, Deferred, or unconfirmed load-bearing decision |
| [`interrogation-check.mjs`](./make-presentation/scripts/interrogation-check.mjs) | story-grill, stage-grill | adversary cast, verbatim quotes, claim IDs, buckets, Act-on resolutions |
| [`storyboard-check.mjs`](./make-presentation/scripts/storyboard-check.mjs) | story-architecture, story-grill | action titles, archetypes, archetype runs, evidence IDs, timing vs brief |
| [`unslop-check.mjs`](./make-presentation/scripts/unslop-check.mjs) | story through QA | AI-tell phrasing in slide copy and notes |
| [`theme-check.mjs`](./make-presentation/scripts/theme-check.mjs) | when a theme changes | theme fields and WCAG contrast |
| [`pptx-check.mjs`](./make-presentation/scripts/pptx-check.mjs) | deck-prototype, production-qa | slide/note/PDF parity, type floors, alt text, density, image-only slides |
| [`build-packet.mjs`](./make-presentation/scripts/build-packet.mjs) | deck-prototype (`handoff`, `google-slides`) | writes `BUILD-PACKET.md` for an external slide tool |
| [`export-deck.mjs`](./make-presentation/scripts/export-deck.mjs) | production-qa | export through each engine's own CLI (`--dry-run` to preview) |
| [`qa-deck.mjs`](./make-presentation/scripts/qa-deck.mjs) | production-qa | engine audit + export integrity + `pptx-check` |

## Engine adapters (`adapters/`)

| Engine | Adapter | Output |
| --- | --- | --- |
| `open-slide` | [`adapters/open-slide/`](../adapters/open-slide/README.md) | React `1920×1080` live canvas + visual-faithful `.pptx` & `.pdf` |
| `genoffice` | [`adapters/genoffice/`](../adapters/genoffice/README.md) | Staged `style.md` + `outline.json` + `pages/NN.json` (`1280×720` px) → native byte-preserving `.pptx`, `slides audit`, grid PNGs, and `.pdf` |
| `marp` | [`adapters/marp/`](../adapters/marp/README.md) | Markdown slide deck → Marp CLI `.pptx` & `.pdf` |
| `pptxgenjs` | [`adapters/pptxgenjs/`](../adapters/pptxgenjs/README.md) | Node script (`build.mjs`) → native-shape `.pptx` |
| `claude-pptx` | [`adapters/claude-pptx/`](../adapters/claude-pptx/README.md) | Claude's `pptx` skill: PptxGenJS script or template edit → native `.pptx`, validator, thumbnail grid |
| `codex-slides` | [`adapters/codex-slides/`](../adapters/codex-slides/README.md) | Codex's `slides` skill: PptxGenJS → native `.pptx`, render and overflow checks |
| `google-slides` | [`adapters/google-slides/`](../adapters/google-slides/README.md) | Slides API / connector or `.pptx` import → Google Slides file, exported `.pptx` + `.pdf` for QA |
| `handoff` | [`adapters/handoff/`](../adapters/handoff/README.md) | `BUILD-PACKET.md` for ChatGPT, Gamma, Canva, Copilot, or a designer → their exported `.pptx` |

## How the two audiences use this repository

- **AI agent:** read the selected `SKILL.md`, then only the references and
  templates it names. Record gate results through `status.mjs`.
- **Human collaborator:** start here to choose a gate, review its output, and
  answer the focused question asked by the agent.
- **Headless run:** follow the autonomous fallback guidance named by the skill;
  do not invent missing decisions silently.

The root [`AGENTS.md`](../AGENTS.md) covers installation and invocation. The
root [`README.md`](../README.md) covers the product overview and adapters.
