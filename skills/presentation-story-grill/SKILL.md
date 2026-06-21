---
name: presentation-story-grill
description: "Pressure-tests an approved story against audience relevance, evidence interpretation, counter-cases, repeated slides, and conclusion quality. Use when the story-grill gate is current for a presentation project or when a router asks for a story opposition pass that may return passed, needs_revision: product-grill, or needs_revision: evidence."
---

# Grill the story

Use when `story-grill` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, and cited source files before judging the story.
- Always explore the files instead of asking the user for discoverable facts.
- Use an interactive question path when a live consequential decision still needs human judgment.
- Ask one question at a time when a consequential story decision is unresolved.
- Include a recommended answer with each question.
- Use `references/opposition-review.md` for the autonomous opposition-review fallback when the user is unavailable or the remaining challenge is clear from the files.
- State the strongest reasonable case against the story and what the opposition must concede.
- Pressure-test why the audience should care, whether the thesis answers the right problem, whether the evidence supports the interpretation, what counter-evidence is missing, whether slides repeat or decorate, and whether the conclusion really follows.
- Return `needs_revision: product-grill` when the story exposes the wrong audience, problem, outcome, promise, or success test.
- Return `needs_revision: evidence` when the story needs unsupported claims, missing counter-evidence, or weaker wording.
- Return `passed` only when the remaining story is still useful, accurate, and distinctive after the strongest reasonable opposition.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing product or stage decisions.
- Log only decisions that materially change the brief, evidence, story order, prototype scope, or stage language.
