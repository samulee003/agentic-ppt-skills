---
name: presentation-prototype
description: Builds a representative prototype in the real slide source so the team can test tone, density, visual system, and page grammar before producing the full deck. Use when the deck-prototype gate is current for a presentation project or when a router asks for representative opening, thesis, evidence, dense-page, and ending pages plus live review in the chosen slide engine.
---

# Build the presentation prototype

Use when `deck-prototype` is the current gate.

## Engine

This gate renders slides, so it needs a **slide engine**. Resolve it before authoring:

- If `PRESENTATION-BRIEF.md` records an engine preference, confirm it against the *Deliverables* line (a natively editable `.pptx` needs `pptxgenjs` or `genoffice`).
- Otherwise ask the user, one question, with a recommended default that follows the brief: natively editable `.pptx` → `pptxgenjs` or `genoffice`; otherwise `open-slide`. Offer installed engines first (see `.agents/adapters/`: `open-slide`, `genoffice`, `marp`, `pptxgenjs`); the default reference adapter is `open-slide` (or `genoffice` when the user wants a native byte-preserving Office `.pptx` via GenOffice).
- **Verify the adapter exists before recording the engine:** run `test -d .agents/adapters/<engine>` (or `ls .agents/adapters/` to list installed ones). If it fails, tell the user there is no adapter for that engine and offer the installed ones — do not record an engine with no adapter, and do not invent the adapter's rules inline.
- Read `.agents/adapters/<engine>/README.md` **first** for that engine's prerequisites and setup, then `.agents/adapters/<engine>/prototype.md` for its authoring rules, canvas contract, and live-review surface. Author to that adapter — do not invent engine-specific rules here.
- Record the choice so downstream gates (`stage-grill`, `production-qa`) inherit it: set it in the status tracker via `node .agents/skills/make-presentation/scripts/status.mjs set-engine <work-root> <engine>`, and add an `## Engine` line to `PRESENTATION-BRIEF.md`.

## Core design principles & anti-pitfall rules

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, cited source files, and existing slide files before editing.
- Always explore the files instead of asking the user for discoverable facts.
- Grill in rounds per `../make-presentation/references/grilling-rounds.md` when consequential prototype decisions are unresolved: ask the whole frontier in one round, each question with a recommended answer worded so "yes" accepts it.
- Follow the engine's authoring rules (from `.agents/adapters/<engine>/prototype.md`) before editing any page in the real slide source.
- **Flexible Deck Length (No Arbitrary Page Limit)**: The final presentation length is unconstrained by arbitrary page count caps (e.g. not fixed to 18 slides). The total slide count scales organically with lecture duration, audience interaction, and narrative depth. At the prototype gate, build the representative set in `references/prototype-set.md` (or the full draft if appropriate) to prove the visual language and page grammar.
- Use real assets, real type scale, and the intended visual direction rather than placeholder visuals or compressed mini-layouts.
- Author to the canonical typography (`../make-presentation/references/typography.md`) as converted by the engine adapter. Do not create a separate type scale in this workflow.
- Confirm one necessary job and one dominant message per slide.
- Reject verbose paragraphs and nested text tiers.
- Split the slide rather than shrink text or hide overflow.

### Aesthetic guardrails (learned from production)
1. **No AI text walls**: never `Title + Subtitle + 3–4 dense bullet paragraphs`. One dominant message per slide; detail goes to the speaker notes.
2. **Action titles**: every content slide title is the full-sentence takeaway from `STORYBOARD.md`.
3. **Optical centre**: keep visual weight between 35% and 65% of the height. Do not sink conclusions to the bottom edge. Cover and section slides use the whole canvas.
4. **Icons and imagery**: no OS emoji and no single-character boxed glyphs as icons. Use one consistent vector icon set or drawn illustrations, and record non-original assets in the ledger's *Assets* table.
5. **Integrated diagrams**: put labels inside the diagram's structure (iceberg layers, funnel stages, pillars) instead of a lazy 50/50 text-beside-picture split, and never crop a diagram's key landmarks.
6. **Balanced grids**: five items go 3 + 2 (or 2 + 3), never five thin stripes.
7. **Data slides** follow `../make-presentation/references/data-slides.md`: one point per chart, accent on the series the title names, source line on every chart.
8. **Type**: follow the canonical scale in `../make-presentation/references/typography.md` through the engine adapter. Split the slide rather than go under the body floor.
9. **Language**: one language per surface, in the register set by the profile; no stray untranslated words.
10. **Archetypes**: build each page in the archetype assigned in `STORYBOARD.md` (`hero`, `split`, `diagram`, `cards`, `data`, `section`, `interaction`). Cards need committed surfaces from the theme, not faint 1 px grey dashboard boxes.
11. **Theme and brand**: apply the theme contract from `../make-presentation/themes/<id>.md`. When the brief names a brand template, its palette, fonts, and title area win; build on the template's master where the engine allows (see the adapter's *Brand template* note).
12. **Profile**: apply the profile's *Prototype* section (for example, interaction layouts for training).

- **Arena (optional)**: when the visual direction is unsettled, the deck is high stakes, or the first prototype was rejected twice, follow `../make-presentation/references/arena-prototype.md` to build 2 to 3 competing directions, pick a base, and graft. Skip in `fast-track` mode.
- **Unslop**: run `node .agents/skills/make-presentation/scripts/unslop-check.mjs <slide-folder>` on the prototype pages and fix findings per `../make-presentation/references/unslop-copy.md`.
- **Export check**: when the engine produces a `.pptx` at this stage, run `node .agents/skills/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes` and fix any type-floor errors before the live review.
- Keep the prototype in the real slide source so later work can revise the actual pages instead of rebuilding from mockups.
- Require a live review in the chosen engine before calling the gate passed.
- Return to story or evidence if representative pages fail because the narrative job, proof, or density is wrong rather than merely unpolished.

Write only consequential decisions to `GRILL-LOG.md` from `../presentation-product-grill/templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions when revisiting the prototype gate.
- Log changes that materially affect visual system, page grammar, asset direction, representative scope, or what later full-deck work must preserve.
