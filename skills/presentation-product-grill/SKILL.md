---
name: presentation-product-grill
description: Turns a source inventory into a presentation brief by resolving audience, problem, outcome, promise, constraints, and success decisions through one-question-at-a-time product grilling. Use when the product-grill gate is current for a presentation project or when a router asks for the presentation brief and consequential decision log.
---

# Grill the presentation product

Use when `product-grill` is the current gate.

- Read repo instructions, `SOURCE-INVENTORY.md`, and the cited source files before asking anything.
- Investigate discoverable answers in the sources instead of asking the user.
- Cover the full product model: audience, problem, outcome, promise, evidence threshold, constraints, success test, and out of scope.
- Ask one question at a time when a consequential decision is still unresolved.
- Include a recommended answer with each question.
- Explain what the decision would invalidate downstream when that impact exists.
- Let any consequential change to Audience, Problem, Outcome, Promise, Evidence threshold, Constraints, Success test, or Out of scope invalidate downstream gates.

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
