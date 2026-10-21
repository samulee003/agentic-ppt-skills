# Presentation router gates

| Gate | Pass when | Artifact owner |
| --- | --- | --- |
| `source-intake` | Material is inventoried, primary versions are known, reuse candidates are mapped, and missing/conflicting inputs are explicit. | `presentation-source-intake` → `SOURCE-INVENTORY.md` |
| `product-grill` | Audience, problem, outcome, promise, constraints, success test, and out-of-scope boundaries are explicit and consistent. | `presentation-product-grill` → `PRESENTATION-BRIEF.md` |
| `evidence` | Every material claim is supported, qualified, moved to notes/backup, or rejected. | `presentation-evidence` → `EVIDENCE-LEDGER.md` |
| `story-architecture` | Every chapter advances the audience outcome and every planned slide has one necessary job and one dominant message per slide. | `presentation-story-architecture` → `STORY.md` + `STORYBOARD.md` |
| `story-grill` | The strongest reasonable opposing case has been considered and the remaining story is still useful, accurate, and distinctive. | `presentation-story-grill` → `GRILL-LOG.md` |
| `deck-prototype` | Representative pages follow canonical projector-safe typography and overflow rules, reject verbose paragraphs and nested text tiers, and split the slide rather than shrink text. | `presentation-prototype` → `slides/<deck-id>/index.tsx` |
| `stage-grill` | The presentation is readable, speakable, timed, defensible, and audience-appropriate. | `presentation-stage-grill` → `SPEAKER-SCRIPT.md` + `GRILL-LOG.md` |
| `production-qa` | The talk preserves one necessary job and one dominant message per slide and works in the browser, PDF, and PowerPoint with no material content or visual defects. | `open-slide-deck-finalization` → `QA-REPORT.md` + PPTX + PDF |

Exporter changes invalidate PPTX/PDF proof and require fresh visual-faithful PPTX/PDF re-export.
