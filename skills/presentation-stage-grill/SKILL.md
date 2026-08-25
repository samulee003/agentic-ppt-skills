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
- Use `references/autonomous-stage.md` for the autonomous fallback when the user is unavailable (headless run) or the remaining stage decisions are resolvable from the deck and upstream artifacts — apply `references/stage-questions.md` yourself, resolve each finding with a concrete change and confidence level, and flag any low-confidence load-bearing edit for later human review instead of silently rewriting it.
- When the user refers to the page they're currently viewing without naming it, resolve it through the engine's "current page" mechanism (e.g. `current-slide` for open-slide) before judging.
- Use actual renders and current speaker notes, not outline-only summaries.
- Apply `references/stage-questions.md` to representative prototype pages first, then to the full deck when available.
- Enforce presenter-language constraints, timed trimming, and existing-versus-remaining distinction.
- **Speakability & Spoken-First Phrasing**: Speaker notes must be written in natural, fluent spoken phrasing that the presenter can deliver aloud comfortably without stumbling (no dense academic paper sentences).
- **Strict 1:1 Note Parity**: Every slide must have exactly one corresponding speaker note matching its dominant message.
- **Adult Attention Management & Active Learning Resets**: In presentations longer than 30 minutes, verify that the delivery incorporates structured attention reset switches (e.g. audience polling/temperature checks, buzz-pair sharing, dialogue choral rehearsal, silent reflection) to combat the natural 15–20 minute adult attention decay.
- **Behavioral Scaffolding (Kirkpatrick Level 3 Transfer)**: Ensure actionable tools include verbal rehearsal opportunities and take-home scaffolds (checklists, pocket cards) so knowledge bridges into daily behavioral change.
- **Language Purity**: For international presentations (e.g. English summit), confirm 100% target language consistency across all notes and visible cues with zero stray translation leftovers.
- **Constructive Context Framing ("Not starting from zero")**: When presenting local policy or regional case studies, clearly separate what the community/system has already established from the next challenge, avoiding nihilistic or accusatory framing.
- Separate what the audience can see immediately from what only works after narration.
- Produce `SPEAKER-SCRIPT.md` from `templates/SPEAKER-SCRIPT.md` with approved wording, timing, likely audience challenge, and Q&A risk.
- Return pages for revision when density, wording, transition logic, or defensibility breaks the live talk.
- Return `passed` only when the talk is readable, speakable, timed, defensible, and audience-appropriate.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the stage-grill gate.
- Log only changes that materially affect wording, timing, page order, trims, likely objections, or presenter language.
