---
name: presentation-story-grill
description: "Interrogates the story with adversarial audience members whose findings must be proven, runs the headline test, then grills the user on what survived. Use when the story-grill gate is current for a presentation project or when a router asks for a story opposition pass that may return passed, needs_revision: product-grill, or needs_revision: evidence."
---

# Grill the story

Use when `story-grill` is the current gate. The story is interrogated first,
then the user is grilled on what the interrogation found.

## 1. Interrogate the story

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, and cited source files.
- Run `node .agents/skills/make-presentation/scripts/storyboard-check.mjs <work-root>`; its errors are findings with proof type `check`.
- Run the interrogation in `../make-presentation/references/interrogate.md`: at least three adversaries for the deck type, the newcomer among them; every finding quotes the storyboard or story verbatim and carries a proof; you verify each proof and drop what does not hold.
- Run the **headline test** (`../make-presentation/references/deck-types.md`): list only the action titles in order. A title that adds nothing is a cut candidate; a gap is a missing slide.
- Write `INTERROGATION.md` from `templates/INTERROGATION.md` and run `node .agents/skills/make-presentation/scripts/interrogation-check.mjs <work-root> --round=story-grill`.

## 2. Grill the user on the result

- Settle the `story-grill` nodes in `../make-presentation/references/grill-tree.md` (opposition, headline test, counter-evidence, cuts, structure) in one round per `../make-presentation/references/grilling-rounds.md`. Each question cites the finding IDs behind it and carries a recommended answer worded so "yes" accepts it.
- Facts are yours: fix in place what needs no decision, then ask only what does.
- Headless, or the user says "stop asking": use `references/opposition-review.md` and log the nodes `Assumed`.

## 3. Decide

- Sort findings with `../make-presentation/references/review-buckets.md`. An unresolved **Act on** finding blocks `passed`.
- Return `needs_revision: product-grill` when the story exposes the wrong audience, problem, outcome, promise, or success test.
- Return `needs_revision: evidence` when the story needs unsupported claims, missing counter-evidence, or weaker wording.
- Return `passed` only when the story is still useful, accurate, and distinctive after the interrogation, and these all report no errors:
  - `storyboard-check.mjs <work-root>`
  - `interrogation-check.mjs <work-root> --round=story-grill`
  - `grill-check.mjs <work-root> story-grill`

Log one `GRILL-LOG.md` row per node (template: `../presentation-product-grill/templates/GRILL-LOG.md`). Append; never delete rows from other phases or earlier runs.
