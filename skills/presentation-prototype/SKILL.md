---
name: presentation-prototype
description: Builds a small representative prototype in the real slide source so the team can test tone, density, visual system, and page grammar before producing the full deck. Use when the deck-prototype gate is current for a presentation project or when a router asks for representative opening, thesis, evidence, dense-page, and ending pages plus live review in the chosen slide engine.
---

# Build the presentation prototype

Use when `deck-prototype` is the current gate.

## Engine

This gate renders slides, so it needs a **slide engine**. Resolve it before authoring:

- If `PRESENTATION-BRIEF.md` (or the gate-1 intake) already records the engine, use it.
- Otherwise ask the user, one question, with a recommended default. Offer installed engines first (see `adapters/`); the bundled reference adapter is `open-slide`. The user may also name a self-supplied engine.
- **Verify the adapter exists before recording the engine:** run `test -d .agents/adapters/<engine>` (or `ls .agents/adapters/` to list installed ones). If it fails, tell the user there is no adapter for that engine and offer the installed ones — do not record an engine with no adapter, and do not invent the adapter's rules inline.
- Read `adapters/<engine>/README.md` **first** for that engine's prerequisites and setup, then `adapters/<engine>/prototype.md` for its authoring rules, canvas contract, and live-review surface. Author to that adapter — do not invent engine-specific rules here.
- Record the choice so downstream gates (stage-grill, deck-qa) inherit it: set it in the status tracker via `node .agents/skills/make-presentation/scripts/status.mjs set-engine <work-root> <engine>`, and add an `## Engine` line to `PRESENTATION-BRIEF.md`.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, cited source files, and existing slide files before editing.
- Always explore the files instead of asking the user for discoverable facts.
- Ask one question at a time when a consequential prototype decision is unresolved.
- Include a recommended answer with each question.
- Follow the engine's authoring rules (from `adapters/<engine>/prototype.md`) before editing any page in the real slide source.
- Build only the representative set in `references/prototype-set.md`; do not build the full deck at this gate.
- Use real assets, real type scale, and the intended visual direction rather than placeholder visuals or compressed mini-layouts.
- Author to the engine's canonical projector-safe typography and overflow rules. Do not create a separate type scale in this workflow.
- Preserve one necessary job and one dominant message per slide. Reject verbose paragraphs and nested text tiers. Split the slide rather than shrink text or pack multiple messages onto one page.
- Keep the prototype in the real slide source so later work can revise the actual pages instead of rebuilding from mockups.
- Require a live review in the chosen engine before calling the gate passed.
- Return to story or evidence if representative pages fail because the narrative job, proof, or density is wrong rather than merely unpolished.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the prototype gate.
- Log changes that materially affect visual system, page grammar, asset direction, representative scope, or what later full-deck work must preserve.
