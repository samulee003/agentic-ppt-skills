---
name: presentation-product-grill
description: Turns a source inventory into a presentation brief by resolving audience, problem, outcome, promise, constraints, and success decisions through round-based product grilling. Use when the product-grill gate is current for a presentation project or when a router asks for the presentation brief and consequential decision log.
---

# Grill the presentation product

Use when `product-grill` is the current gate.

- Read repo instructions, `SOURCE-INVENTORY.md`, and the cited source files before asking anything.
- Investigate discoverable answers in the sources instead of asking the user.
- Cover the full product model: audience, problem, outcome, promise, evidence threshold, constraints, **visual direction & rendering DNA**, success test, and out of scope.
- **Mandatory Visual Theme Grilling**: When visual direction or rendering style is unconfirmed, ask one focused question with concrete theme archetypes from `themes/*.md` or benchmark decks (e.g. `sticker-pop` / `macau-wellbeing-sketch` for physical sketch with 3px ink & hard shadows, `bright-sans` for Swiss minimal, `aurora` for dark glassmorphism). Never allow vague adjectives (e.g. "warm", "clean", "modern") to pass without binding them to a concrete rendering contract (border, shadow, typography scale).
- Before the first question, follow `../make-presentation/references/sharpen-playback.md`: sharpen the task, write a one-paragraph `## Playback` at the top of the brief, and proceed on recommended defaults (recorded as `Assumed`) for reversible choices.
- Grill in rounds per `../make-presentation/references/grilling-rounds.md` when a consequential decision is still unresolved and the sources cannot answer it: ask the whole frontier (every decision whose prerequisites are settled) in one round, numbered, each with a recommended answer worded so "yes" accepts it. Never ask a question that depends on another open one in the same round. Honor "ask one question at a time" if the user requests it.
- Include a recommended answer with each question, worded so "yes" accepts it.
- Explain what the decision would invalidate downstream when that impact exists.
- Use `references/autonomous-brief.md` for the autonomous fallback when the user is unavailable (headless run) or the remaining product decisions are resolvable from the sources — resolve each open field with a defensible value, its rationale, and a confidence level (defaulting visual direction to an explicit registered theme from `themes/*.md` rather than generic unstyled UI), and flag any low-confidence load-bearing decision for later human review instead of silently guessing.
- Let any consequential change to Audience, Problem, Outcome, Promise, Evidence threshold, Constraints, Visual direction, Success test, or Out of scope invalidate downstream gates.

Write `PRESENTATION-BRIEF.md` from `templates/PRESENTATION-BRIEF.md`.

- Update the brief as soon as a question is resolved.
- Keep the brief decision-oriented and concrete.
- Prefer short sentences, explicit tradeoffs, and measurable success tests.

Write only consequential decisions to `GRILL-LOG.md` from `templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions from story or stage grilling.
- Log decisions that materially change evidence, story, prototype, stage, or production work.
- Skip minor wording preferences and reversible drafting details.
- Stop once the brief is coherent enough for the evidence or story gate to proceed.
