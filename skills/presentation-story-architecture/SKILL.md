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
- **Action titles**: write every main-talk slide title in `STORYBOARD.md` as a full-sentence takeaway, not a topic label, and make the titles pass the headline test in `../make-presentation/references/deck-types.md`.
- **Archetypes**: assign each slide one archetype so layouts vary on purpose and no three consecutive slides share one:
  1. `hero`: one dominant statement or number, no bullets (thesis, rule, turning point).
  2. `split`: asymmetric two columns, a visual on one side and the explanation or steps on the other.
  3. `diagram`: a system model or process filling most of the content area, with labels inside the drawing.
  4. `cards`: 2–4 parallel items with clear hierarchy.
  5. `data`: one chart, table, or hero figure that proves the action title (`../make-presentation/references/data-slides.md`).
  6. `section`: a chapter divider.
  7. `interaction`: a poll, discussion prompt, exercise, or demo cue.
- **Language**: on-screen copy uses the written register of the audience's language; spoken phrasing belongs in transitions and speaker notes. Apply the profile's *Language* section when it sets stricter rules.
- Split the slide rather than shrink text or pack distinct messages onto one page. Remove ornamental, duplicate, or "nice to have" pages.
- **Meaningful brevity**: cut filler and secondary clutter, but keep each takeaway a clear, complete thought. Do not reduce statements to cryptic two-word fragments.
- Run `node .agents/skills/make-presentation/scripts/storyboard-check.mjs <work-root>` and fix every error before finishing. It checks action titles, archetypes, archetype runs, evidence IDs against the ledger, and total main-talk time against the brief.

## Structure

- Start from the default structure for the deck type in `../make-presentation/references/deck-types.md`, then apply the profile's *Story architecture* section.
- For `training`, the 4MAT cycle applies: Why (relevance, acknowledge the learner's situation) → How it works (the mechanism behind the behaviour) → What to do (chunked, memorable tools) → Practice and transfer (rehearsal, templates, take-home scaffolds).
- Keep chapter order tied to the promised audience outcome, not to the order sources were found.
- Use another structure when it better fits the product, audience, and evidence, and record why in `STORY.md`.
- Stop once the thesis, audience journey, chapter roles, transitions, main/backup boundaries, and slide jobs are coherent enough for story grilling or prototyping.
