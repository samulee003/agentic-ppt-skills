---
name: presentation-stage-grill
description: Tests a live prototype or deck as a talk by grilling actual renders, current notes, timing, transitions, and audience challenges, then produces a speaker script. Use when the stage-grill gate is current for a presentation project or when a router asks for speakability, trimming, audience-risk review, and `SPEAKER-SCRIPT.md`.
---

# Grill the talk on stage

Use when `stage-grill` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `STORY.md`, `STORYBOARD.md`, `GRILL-LOG.md`, current speaker notes, and actual page renders before judging the talk.
- Always explore the files instead of asking the user for discoverable facts.
- Ask one question at a time when a consequential stage decision is unresolved.
- Include a recommended answer with each question.
- When the user refers to the page they're currently viewing without naming it, resolve it through the engine's "current page" mechanism (e.g. `current-slide` for open-slide) before judging.
- Use actual renders and current speaker notes, not outline-only summaries.
- Apply `references/stage-questions.md` to representative prototype pages first, then to the full deck when available.
- Enforce presenter-language constraints, timed trimming, and existing-versus-remaining distinction.
- Separate what the audience can see immediately from what only works after narration.
- Produce `SPEAKER-SCRIPT.md` from `templates/SPEAKER-SCRIPT.md` with approved wording, timing, likely audience challenge, and Q&A risk.
- Return pages for revision when density, wording, transition logic, or defensibility breaks the live talk.
- Return `passed` only when the talk is readable, speakable, timed, defensible, and audience-appropriate.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the stage-grill gate.
- Log only changes that materially affect wording, timing, page order, trims, likely objections, or presenter language.
