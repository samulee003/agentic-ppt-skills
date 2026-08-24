---
name: presentation-stage-grill
description: Tests a live prototype or deck as a talk by grilling actual renders, current notes, timing, transitions, and audience challenges through round-by-round frontier grilling, then produces a speaker script using human-writing authenticity standards. Use when the stage-grill gate is current for a presentation project or when a router asks for speakability, trimming, audience-risk review, and `SPEAKER-SCRIPT.md`.
---

# Grill the talk on stage

Use when `stage-grill` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `STORY.md`, `STORYBOARD.md`, `GRILL-LOG.md`, current speaker notes, and actual page renders before judging the talk.
- Always explore files and check timing/renders instead of asking the user for discoverable facts.
- When live consequential stage decisions need human judgment, conduct **round-by-round frontier grilling**:
  - Ask open stage challenges in structured rounds (`❓ **Q[N]**` + `➡️ <recommended trim/scripting>`).
- Use `references/autonomous-stage.md` for the autonomous fallback when the user is unavailable (headless run) or remaining stage decisions are resolvable from the deck and upstream artifacts — apply `references/stage-questions.md` yourself, resolve each finding with a concrete change and confidence level, and flag low-confidence load-bearing edits for human review.
- When the user refers to the page they're currently viewing without naming it, resolve it through the engine's "current page" mechanism (e.g. `current-slide` for open-slide) before judging.
- Use actual renders and current speaker notes, not outline-only summaries.
- Apply `references/stage-questions.md` to representative prototype pages first, then to the full deck when available.
- Enforce presenter-language constraints, timed trimming, and existing-versus-remaining distinction.
- Separate what the audience can see immediately from what only works after narration.

## Human-Writing & Spoken Script Standards (`human-writing`)

In `SPEAKER-SCRIPT.md`:
- **Living Human Voice**: Write as an experienced practitioner talking directly to the room. Use natural pauses, conversational cadence, and concrete storytelling.
- **Zero Robotic Recitation**: Never read bullet points off the slide verbatim. The slide carries the visual anchor; the speaker carries the context, human intention, and nuance.
- **Direct Tone**: Strip away opening pleasantries ("今天非常荣幸..."), artificial rhetorical pivots ("正如我们所知..."), and hollow slogans. Start immediately with the core problem or tension.

## Wang Yong-Fu (福哥) Interactive Stage Delivery (`wang-yongfu-teaching-craft`)

In `SPEAKER-SCRIPT.md` and live delivery planning:
- **4-Step Questioning Method (問答四步法)**: In Q&A and interactive checkpoints, format responses as:
  1. `Cue (點名/引導)` -> 2. `Mirror (鏡像重述學員原話)` -> 3. `Praise (具體讚美不批評)` -> 4. `Insight (提出核心洞見)`.
- **PESOS Practice Flow**: When guiding audience workshops or exercises, structure the script as:
  - `P (Prepare)`: Prepare the context & clear goal
  - `E (Explain)`: "我說給你聽" (Explain the rationale in 60 seconds)
  - `S (Show)`: "我做給你看" (Demonstrate with a concrete sample/roleplay)
  - `O (Observe)`: "讓你做做看" (Timeboxed audience exercise)
  - `S (Supervise)`: "成效追蹤與反饋" (Actionable wrap-up).
- **Sandwich Feedback (三明治回饋法)**: Positive Strength -> Constructive Polish -> Final Encouragement (eliminate adversarial "但是").
- **Commitment & Consistency (要求承諾原則)**: Guide the audience from simple agreement (nodding/raising hand) to committing to actionable next steps.

## Confirmation Gate & Output

- Produce `SPEAKER-SCRIPT.md` from `templates/SPEAKER-SCRIPT.md` with approved wording, timing, likely audience challenge, and Q&A risk.
- Return pages for revision when density, wording, transition logic, or defensibility breaks the live talk.
- **Confirmation Gate**: Confirm the talk's flow, pacing, and presenter script with the user before finalizing the gate.
- Return `passed` only when the talk is readable, speakable, timed, defensible, and audience-appropriate.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the stage-grill gate.
- Log only changes that materially affect wording, timing, page order, trims, likely objections, or presenter language.