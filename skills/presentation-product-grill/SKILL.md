---
name: presentation-product-grill
description: Grills the user, in rounds over the presentation grill tree, until audience, deck type, outcome, promise, evidence threshold, constraints, deliverables, and success test are settled, then writes the presentation brief. Use when the product-grill gate is current for a presentation project or when a router asks for the presentation brief and consequential decision log.
---

# Grill the presentation product

Use when `product-grill` is the current gate. This gate is the heart of the
pipeline: the deck is only as good as the decisions made here, and the agent
must not guess them.

## Before the first question

- Read repo instructions, `SOURCE-INVENTORY.md`, and the cited source files.
- Read the profile named by the user or the source (default: `../make-presentation/profiles/default.md`) and apply its *Product grill* section.
- Open `../make-presentation/references/grill-tree.md`. Every `product-grill` node must end with a row in `GRILL-LOG.md`.
- Settle what the sources answer. Log those nodes `Decided`, naming the source in *Reason*, and confirm the load-bearing ones in one line in round 1 ("From the email: the audience is the leadership team. Right?").
- Play back the goal in one paragraph per `../make-presentation/references/sharpen-playback.md` and put it at the top of the brief as `## Playback`.

## Grill in rounds

- Work the tree per `../make-presentation/references/grilling-rounds.md`. Round 1 is every unsettled node with no open prerequisite (usually profile, deck type, audience, and anything the sources made answerable). Each later round is the new frontier.
- Number every question, give a recommended answer worded so "yes" accepts it, and say what it would change downstream.
- Ask, do not assume, every load-bearing node (deck type, audience, outcome, promise, evidence threshold, constraints, success test) while a person can answer.
- Reversible nodes (profile, deliverables, brand, visual, out of scope) may carry a recommended default the user can accept with "yes to all". Log them `Assumed` only when the user did not answer that question, with the reason.
- Honor "ask one question at a time" if the user requests it.
- When an answer must come from someone else, log the node `Deferred` and use the `to-questionnaire` skill. A `Deferred` node blocks the gate.

## Domain rules while grilling

- **Deck type** sets the default structure (`../make-presentation/references/deck-types.md`); ask it early.
- **Editability decides the engine family**: if the audience must edit the delivered `.pptx`, record "native editable" so the prototype gate offers `claude-pptx`, `codex-slides`, `pptxgenjs`, `genoffice`, or `google-slides` first; Marp exports image-backed slides and open-slide favours visual fidelity. Ask where the team edits (PowerPoint, Google Slides, or another tool such as ChatGPT or Gamma).
- **Brand template**: record its path; it overrides the theme's palette and fonts.
- **Visual direction is a contract**: offer the themes in `../make-presentation/themes/README.md` (or a benchmark deck) with a recommendation. Never let "clean", "warm", or "modern" pass without binding it to a theme.
- **Evidence threshold**: ask which numbers or claims the audience will challenge; those become hard-support rows at the evidence gate.

## Headless or "just do it"

Only when no person can answer (headless run) or the user explicitly says to stop asking: resolve the remaining nodes per `references/autonomous-brief.md`, log each `Assumed` with its reason and confidence, and list the load-bearing ones at the top of the brief under `## Unconfirmed`. They must be confirmed before `production-qa` (`grill-check.mjs` enforces this).

## Write the artifacts

- `PRESENTATION-BRIEF.md` from `templates/PRESENTATION-BRIEF.md`, updated as each round settles nodes. Keep it decision-oriented, with explicit tradeoffs and a measurable success test.
- `GRILL-LOG.md` from `templates/GRILL-LOG.md`: one row per node (`Phase`, `Node`, question, recommended answer, decision, `Status`, reason, invalidates). Append; never delete rows from other phases or earlier runs.
- Any later change to a load-bearing node invalidates downstream gates (`status.mjs invalidate`).

## Pass

Run `node .agents/skills/make-presentation/scripts/grill-check.mjs <work-root> product-grill`. Pass only when it reports no errors and the user has confirmed the playback.
