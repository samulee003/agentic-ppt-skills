---
name: presentation-story-architecture
description: Turns an approved brief and supported claims into a thesis, audience journey, chapter roles, transitions, and slide-by-slide jobs for the main talk and backup. Use when the story-architecture gate is current for a presentation project or when a router asks for the story and storyboard.
---

# Build the story architecture

Use when `story-architecture` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, and the cited source files before structuring the talk.
- Require one memorable thesis.
- Require an explicit audience change from where the talk starts to where it should end.
- Write `STORY.md` from `templates/STORY.md`.
- Write `STORYBOARD.md` from `templates/STORYBOARD.md`.
- Build the story from the approved brief and supported evidence claims only.
- If a chapter needs unsupported evidence, return the work to evidence instead of letting the chapter enter the story.
- Assign each chapter a role such as context, tension, proof, decision, action, or closing commitment.
- Write spoken transitions that explain why the next chapter or slide must exist.
- Separate the main-talk range from backup or Q&A material.
- Confirm one necessary job and one dominant message per slide.
- Run `node .agents/skills/make-presentation/scripts/unslop-check.mjs <work-root>/STORYBOARD.md` and fix findings using `../make-presentation/references/unslop-copy.md` before finishing.
- **Mandatory Page Archetype Assignment**: In `STORYBOARD.md`, assign each slide explicitly to one of the 4 visual archetypes to guarantee visual dynamic rhythm and prevent repetitive box layouts:
  1. `[大字流]`: Hero thesis, golden rules, safeguard statements (e.g. 100px+ punchline cards).
  2. `[半圖半文]`: Split editorial grid 1.1:0.9 (visual vignette on one side, structured action steps on the other).
  3. `[大圖流]`: Full-canvas vector diagram (70%+ canvas occupied by 3px ink stroke SVG system model).
  4. `[物理卡片流]`: 2~3 multi-card grid with micro-rotations and `<Steps>` progressive reveal.
- **Language Separation Contract**: Ensure all storyboard on-screen draft copy is standard **Traditional Written Chinese (繁體書面語)**; keep spoken colloquialisms exclusively for spoken transitions and speaker notes.
- Split the slide rather than shrink text or pack distinct messages onto one page. Remove ornamental, duplicate, or “nice to have” pages.
- **Meaningful Brevity (Anti-Over-Pruning)**: Text pruning must eliminate fluff and secondary clutter while preserving clear, grammatically sound, and intellectually substantive core takeaways. Do not reduce statements to cryptic 2-word fragments.

## Instructional design & 4MAT learning cycle

Incorporate adult learning dynamics (ATD / 4MAT / Kirkpatrick Level 2 & 3 behavior transfer):
1. **Why (Relevance & Emotional Safety)**: Open with visceral pain points and validation to establish psychological safety before introducing solutions.
2. **How / Logic (Underlying Cognitive Insight)**: Deconstruct the psychological and systemic mechanisms (e.g. dignity defense, family subsystems) so the audience understands the *why* behind behaviors.
3. **What (Actionable Tool Chunking)**: Deliver chunked, memorable tools, role definitions, and boundary frameworks with high memory stickiness.
4. **Action / What If (Behavioral Rehearsal & Transfer)**: Provide concrete dialogue templates, case vignettes, and takeaway scaffolding so learning converts into immediate real-world practice.

- Keep chapter order tied to the promised audience outcome, not to the order sources were found.
- Allow SCQA but never force it.
- Use another structure when it better fits the product, audience, and evidence.
- Stop once the thesis, audience journey, chapter roles, transitions, main/backup boundaries, and slide jobs are coherent enough for story grilling or prototyping.
