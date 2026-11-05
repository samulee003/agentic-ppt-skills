---
name: presentation-stage-grill
description: Tests a live prototype or deck as a talk by grilling actual renders, current notes, timing, transitions, and audience challenges, then produces a speaker script. Use when the stage-grill gate is current for a presentation project or when a router asks for speakability, trimming, audience-risk review, and `SPEAKER-SCRIPT.md`.
---

# Grill the talk on stage

Use when `stage-grill` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `STORY.md`, `STORYBOARD.md`, `GRILL-LOG.md`, current speaker notes, and actual page renders before judging the talk.
- Always explore the files instead of asking the user for discoverable facts.
- First, run the stage interrogation (`../make-presentation/references/interrogate.md`) on the renders, the current notes, and the exported file, and append it to `INTERROGATION.md` as `## Round: stage-grill`. Its kept findings drive the `challenges` node.
- Then settle the `stage-grill` nodes in `../make-presentation/references/grill-tree.md` (opening, timing, challenges, language, and resets for talks over 30 minutes, plus any profile nodes) in one round per `../make-presentation/references/grilling-rounds.md`, each question with a recommended answer worded so "yes" accepts it.
- Headless, or the user says "stop asking": use `references/autonomous-stage.md` and log the nodes `Assumed`; the load-bearing ones (opening, timing, challenges) must be confirmed before `production-qa`.
- When the user refers to the page they're currently viewing without naming it, resolve it through the engine's "current page" mechanism (e.g. `current-slide` for open-slide) before judging.
- Use actual renders and current speaker notes, not outline-only summaries.
- Apply `references/stage-questions.md` to representative prototype pages first, then to the full deck when available.
- Enforce presenter-language constraints, timed trimming, and existing-versus-remaining distinction.
- **Speakability & Spoken-First Phrasing**: Speaker notes must be written in natural, fluent spoken phrasing that the presenter can deliver aloud comfortably without stumbling (no dense academic paper sentences).
- **Strict 1:1 Note Parity**: Every slide must have exactly one corresponding speaker note matching its dominant message.
- **Attention resets**: in talks over 30 minutes, verify an attention reset (question, poll, pair discussion, demo, short pause) at least every 15–20 minutes.
- **Deck type**: check the talk against its deck type in `../make-presentation/references/deck-types.md`: a `decision` deck states the recommendation and the ask in the first two minutes; a `training` deck gives every tool a practice moment; a `pitch` ends on a specific next step.
- **Headline test**: read only the slide titles aloud, in order. If they do not carry the argument, return the affected pages.
- **Language**: one language per surface, in the register the profile sets, with no stray untranslated words in notes or visible cues.
- **Profile**: apply the profile's *Stage grill* section (for example, behaviour-transfer scaffolds and constructive framing for `training-zh-hant`).
- **Rehearsal timing**: when a rehearsal recording or timed read-through exists, use the measured time per slide instead of estimates, and trim to fit the brief's time with the "Trim if short on time" column.
- Separate what the audience can see immediately from what only works after narration.
- Run `node .agents/skills/make-presentation/scripts/unslop-check.mjs <work-root>/SPEAKER-SCRIPT.md <slide-folder>` and rewrite flagged notes using `../make-presentation/references/unslop-copy.md`. Spoken phrasing still comes first.
- Sort audience-challenge and trimming findings into Act on, Consider, Noted, or Dismissed using `../make-presentation/references/review-buckets.md`.
- Produce `SPEAKER-SCRIPT.md` from `templates/SPEAKER-SCRIPT.md` with approved wording, timing, likely audience challenge, and Q&A risk.
- Return pages for revision when density, wording, transition logic, or defensibility breaks the live talk.
- Return `passed` only when the talk is readable, speakable, timed, defensible, and audience-appropriate, and `interrogation-check.mjs <work-root> --round=stage-grill` and `grill-check.mjs <work-root> stage-grill` report no errors.

Log one `GRILL-LOG.md` row per stage node (template: `../presentation-product-grill/templates/GRILL-LOG.md`). Append; never delete rows from other phases or earlier runs.
