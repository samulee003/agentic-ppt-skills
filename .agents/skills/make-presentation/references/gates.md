# Presentation router gates

| Gate | Pass when | Artifact owner |
| --- | --- | --- |
| `source-intake` | Every listed path exists (`source-check.mjs`); material is inventoried, primary versions are known, reuse candidates are mapped, and missing/conflicting inputs are explicit. | `presentation-source-intake` → `SOURCE-INVENTORY.md` |
| `product-grill` | Every `product-grill` node in `grill-tree.md` is settled (`grill-check.mjs`), the user confirmed the playback, and profile, deck type, audience, problem, outcome, promise, constraints, deliverables (presenting/reading deck, editability), brand template, visual direction, success test, and out-of-scope boundaries are explicit and consistent. | `presentation-product-grill` → `PRESENTATION-BRIEF.md` |
| `evidence` | Every material claim is supported, qualified, moved to notes/backup, or rejected, every non-original asset has a recorded licence, and `ledger-check.mjs` reports no errors. | `presentation-evidence` → `EVIDENCE-LEDGER.md` |
| `story-architecture` | Every chapter advances the audience outcome, every planned slide has one necessary job, one dominant message, an action title, and an archetype, and `storyboard-check.mjs` and `ledger-check.mjs` (no C/D claim in the main talk) report no errors. | `presentation-story-architecture` → `STORY.md` + `STORYBOARD.md` |
| `story-grill` | The interrogation's verified findings are resolved (`interrogation-check.mjs --round=story-grill`), the titles pass the headline test, the story nodes are settled (`grill-check.mjs`), and the story is still useful, accurate, and distinctive. | `presentation-story-grill` → `INTERROGATION.md` + `GRILL-LOG.md` |
| `deck-prototype` | Representative pages follow the theme and the canonical typography (`typography.md`) and overflow rules, reject verbose paragraphs and nested text tiers, and split the slide rather than shrink text. | `presentation-prototype` → representative slide source for the chosen engine (`adapters/<engine>/prototype.md`) |
| `stage-grill` | The stage interrogation is resolved, the stage nodes are settled, and the presentation is readable, speakable, timed, defensible, and audience-appropriate. | `presentation-stage-grill` → `SPEAKER-SCRIPT.md` + `GRILL-LOG.md` + `INTERROGATION.md` |
| `production-qa` | The talk preserves one necessary job and one dominant message per slide, passes `qa-deck.mjs` (including `pptx-check.mjs` and `plan-check.mjs`) and `grill-check.mjs production-qa` (no unconfirmed load-bearing assumption) with no errors, meets the accessibility checks, and works in the preview, PDF, and PowerPoint with no material content or visual defects. | `presentation-deck-qa` → `QA-REPORT.md` + PPTX + PDF (PDF only where the engine can produce one; see `adapters/<engine>/qa.md`) |

Exporter changes invalidate PPTX/PDF proof and require a fresh re-export.

`status.mjs` refuses to pass a gate whose `--artifact` paths do not exist (relative to the work root or the current folder).

In `fast-track` mode, passing `source-intake` also passes `product-grill`, and passing `story-architecture` also passes `story-grill`, with the same artifacts; the helper refuses when the paired grill gate's checks fail (see `modes.md`).
