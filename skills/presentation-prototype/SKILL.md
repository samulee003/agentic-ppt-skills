---
name: presentation-prototype
description: Builds a representative prototype in the real slide source so the team can test tone, density, visual system, and page grammar before producing the full deck. Use when the deck-prototype gate is current for a presentation project or when a router asks for representative opening, thesis, evidence, dense-page, and ending pages plus live review in the chosen slide engine.
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

## Core design principles & anti-pitfall rules

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, cited source files, and existing slide files before editing.
- Always explore the files instead of asking the user for discoverable facts.
- Ask one question at a time when a consequential prototype decision is unresolved. Include a recommended answer.
- Follow the engine's authoring rules (from `adapters/<engine>/prototype.md`) before editing any page in the real slide source.
- **Flexible Deck Length (No Arbitrary Page Limit)**: The final presentation length is unconstrained by arbitrary page count caps (e.g. not fixed to 18 slides). The total slide count scales organically with lecture duration, audience interaction, and narrative depth. At the prototype gate, build the representative set in `references/prototype-set.md` (or the full draft if appropriate) to prove the visual language and page grammar.
- Use real assets, real type scale, and the intended visual direction rather than placeholder visuals or compressed mini-layouts.
- Author to the engine's canonical projector-safe typography and overflow rules. Do not create a separate type scale in this workflow.

### Aesthetic guardrails (learned from production)
1. **Reject AI 3-tier text walls**: Do not generate `Title + Subtitle + 3-4 dense bullet paragraphs`. Maximize Signal-to-Noise Ratio (SNR). One dominant message per slide.
2. **Balanced eyeline centering**: Keep visual weight centered along the optical middle (y: 35%–65%). Never collapse all content or concluding punchlines down to the bottom border. Cover/title slides must boldly command the entire canvas.
3. **High-craft iconography**: Strictly forbid OS emojis (🚀, 💡, 🔥, 👶) and single-character boxed glyphs ("寫", "參"). Use vector Flat SVG icons or dedicated custom illustrations.
4. **Integrated visual metaphors**: In complex diagrams (e.g. iceberg, funnel, 3-pillar framework), embed callouts directly into the visual structure; do not resort to lazy 50/50 side-by-side splits or crop critical diagram landmarks.
5. **Balanced multi-item grids**: For 5 items, use 3-top / 2-bottom (or 2-top / 3-bottom), never a vertical stack of 5 narrow stripes.
6. **Split over shrink**: When space is tight, split the concept across multiple slides rather than shrinking fonts below 28px–32px.
7. **Instructional interaction layouts**: Provide clean visual templates for active audience engagement (e.g., audience polling/temperature cards, buzz-pair discussion prompts, step-by-step dialogue flows, and takeaway scaffolding).
8. **Language purity**: Guarantee 100% target language consistency (zero stray untranslated characters).

- Keep the prototype in the real slide source so later work can revise the actual pages instead of rebuilding from mockups.
- Require a live review in the chosen engine before calling the gate passed.
- Return to story or evidence if representative pages fail because the narrative job, proof, or density is wrong rather than merely unpolished.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the prototype gate.
- Log changes that materially affect visual system, page grammar, asset direction, representative scope, or what later full-deck work must preserve.
