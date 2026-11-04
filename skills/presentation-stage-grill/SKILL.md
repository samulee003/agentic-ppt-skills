---
name: presentation-stage-grill
description: Tests a live prototype or deck as a talk by grilling actual renders, current notes, timing, transitions, and audience challenges, then produces a speaker script. Use when the stage-grill gate is current for a presentation project or when a router asks for speakability, trimming, audience-risk review, and `SPEAKER-SCRIPT.md`.
---

# Grill the talk on stage

Use when `stage-grill` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `STORY.md`, `STORYBOARD.md`, `GRILL-LOG.md`, current speaker notes, and actual page renders before judging the talk.
- Always explore the files instead of asking the user for discoverable facts.
- Grill in rounds per `../make-presentation/references/grilling-rounds.md` when consequential stage decisions are unresolved: ask the whole frontier in one round.
- Include a recommended answer with each question, worded so "yes" accepts it.
- Use `references/autonomous-stage.md` for the autonomous fallback when the user is unavailable (headless run) or the remaining stage decisions are resolvable from the deck and upstream artifacts — apply `references/stage-questions.md` yourself, resolve each finding with a concrete change and confidence level, and flag any low-confidence load-bearing edit for later human review instead of silently rewriting it.
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
- Return `passed` only when the talk is readable, speakable, timed, defensible, and audience-appropriate.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the stage-grill gate.
- Log only changes that materially affect wording, timing, page order, trims, likely objections, or presenter language.
