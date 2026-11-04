---
name: presentation-product-grill
description: Turns a source inventory into a presentation brief by resolving audience, problem, outcome, promise, constraints, and success decisions through round-based product grilling. Use when the product-grill gate is current for a presentation project or when a router asks for the presentation brief and consequential decision log.
---

# Grill the presentation product

Use when `product-grill` is the current gate.

- Read repo instructions, `SOURCE-INVENTORY.md`, and the cited source files before asking anything.
- Investigate discoverable answers in the sources instead of asking the user.
- Read the profile named by the user or the source (default: `../make-presentation/profiles/default.md`) and apply its *Product grill* section.
- Cover the full product model: deck type (`../make-presentation/references/deck-types.md`), audience, problem, outcome, promise, evidence threshold, constraints, deliverables (presenting deck, reading deck, or both; whether the `.pptx` must be natively editable), brand template, visual direction, success test, and out of scope.
- **Editability decides the engine family**: if the audience must edit the delivered `.pptx` in PowerPoint, record "native editable" so the prototype gate offers `pptxgenjs` or `genoffice` first; Marp exports image-backed slides and open-slide favours visual fidelity.
- **Brand template**: if the organisation has a `.potx`/`.pptx` master or brand guide, record its path. It overrides the theme's palette and fonts.
- **Visual direction must be a contract**: when it is unconfirmed, offer the themes in `../make-presentation/themes/README.md` (or a benchmark deck the user supplies) with a recommendation. Never let vague adjectives ("warm", "clean", "modern") pass without binding them to a theme or a custom contract with the same fields.
- Before the first question, follow `../make-presentation/references/sharpen-playback.md`: sharpen the task, write a one-paragraph `## Playback` at the top of the brief, and proceed on recommended defaults (recorded as `Assumed`) for reversible choices.
- Grill in rounds per `../make-presentation/references/grilling-rounds.md` when a consequential decision is still unresolved and the sources cannot answer it: ask the whole frontier (every decision whose prerequisites are settled) in one round, numbered, each with a recommended answer worded so "yes" accepts it. Never ask a question that depends on another open one in the same round. Honor "ask one question at a time" if the user requests it.
- Include a recommended answer with each question, worded so "yes" accepts it.
- Explain what the decision would invalidate downstream when that impact exists.
- Use `references/autonomous-brief.md` for the autonomous fallback when the user is unavailable (headless run) or the remaining product decisions are resolvable from the sources — resolve each open field with a defensible value, its rationale, and a confidence level (defaulting visual direction to the profile's theme, or `editorial-minimal`, rather than generic unstyled UI), and flag any low-confidence load-bearing decision for later human review instead of silently guessing.
- Let any consequential change to Deck type, Audience, Problem, Outcome, Promise, Evidence threshold, Constraints, Deliverables, Brand template, Visual direction, Success test, or Out of scope invalidate downstream gates.

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
