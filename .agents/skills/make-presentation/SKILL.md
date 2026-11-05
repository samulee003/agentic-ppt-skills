---
name: make-presentation
description: Turns notes, a source folder, an existing deck, or an idea into a stage-ready presentation through eight gates (source intake, brief, evidence, story, story review, prototype, stage review, QA) with machine checks on the exported file. Works with any slide tool (Claude pptx, Codex slides, PptxGenJS, Google Slides, GenOffice, open-slide, Marp, or a handoff to ChatGPT/Gamma/Canva). Use whenever the user asks for slides, a deck, a PowerPoint/PPTX, a pitch deck, a talk, a training deck, a keynote, or 簡報/投影片/演示文稿, wants an existing deck improved, translated, or rebranded, or wants to resume a presentation project.
---

# Make a presentation product

Read repo instructions first. Route the project from the earliest unresolved gate instead of recreating work.

## Paths

Every command in these skills is written for skills installed at `.agents/skills/` with adapters at `.agents/adapters/`. When they live elsewhere, substitute the real folder in every command and path, in every skill:

- Claude Code project install: `.claude/skills/` and `.claude/adapters/`.
- Claude Code plugin: `${CLAUDE_PLUGIN_ROOT}/skills/` and `${CLAUDE_PLUGIN_ROOT}/adapters/` (if this line still shows the literal `${CLAUDE_PLUGIN_ROOT}`, you are not running as a plugin).
- Find the real folder by locating this `SKILL.md`: the skills folder is its parent's parent, and `adapters/` sits next to it.

## Workspace

- Derive or confirm `deck-id`, then use `presentation-work/<deck-id>/`.
- Original presentation source folders are read-only by default.
- Inspect existing artifacts in the source folder, work area, and slide folder before creating anything new.
- Reuse equivalent artifacts when they already satisfy the current gate.
- **Writing artifacts:** every gate that specifies writing an artifact from a template (e.g. from a named template path) means create that file in the work area using your runtime's file-write tool (the `Write`/`Edit` tool, or shell redirection if that is all you have). Start from the named template, fill it with real content for this deck, and write it to the path the gate specifies. There is no separate build script — file creation is your responsibility.

## Status

- Use the shipped helper at `.agents/skills/make-presentation/scripts/status.mjs`.
- If `presentation-work/<deck-id>/STATUS.md` exists, run `node .agents/skills/make-presentation/scripts/status.mjs validate presentation-work/<deck-id>`.
- Otherwise initialize it with `node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> <mode> <mode-reason>`.
- Never reset an existing status file unless the user explicitly requests a reset; only then append `--force`.
- Treat artifact existence as a clue, not proof that a gate passed.
- Run `node .agents/skills/make-presentation/scripts/status.mjs next <work-root>` and resume from the returned earliest unresolved gate.
- Follow `references/status-schema.md` for gate names, status values, and update commands.

## Mode

Read `references/modes.md` before routing.

- Choose `general` for internal, creative, or low-risk decks without consequential external claims.
- Choose `fast-track` for lightweight, agile decks (< 10 slides) when speed is prioritized.
- Choose `research-enhanced` when the deck depends on consequential external claims, research, citations, datasets, policy, law, medicine, psychology, finance, safety, or statistics.
- Re-evaluate mode after source intake. If later evidence triggers research safeguards, run `node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"`.
- Read the current mode from `STATUS.md` before invoking Evidence or Finalization.
- Under deadline pressure, reduce scope; never silently waive evidence, readability, or export integrity.

## Profile, deck type, and theme

- A **profile** (`profiles/`) bundles defaults for a recurring kind of work (language, deck type, theme, extra checks). Use `default` unless the user or the source names one; record it in `PRESENTATION-BRIEF.md`.
- The **deck type** (`references/deck-types.md`) sets the story structure and whether a reading deck is needed.
- The **theme** (`themes/`) is the visual rendering contract; a brand template overrides its palette and fonts.
- All engines share one type scale (`references/typography.md`).

## Route one gate at a time

Read `references/gates.md` for pass conditions and artifact owners. Invoke exactly one focused skill for the earliest unresolved gate:

1. `source-intake` → `presentation-source-intake`
2. `product-grill` → `presentation-product-grill`
3. `evidence` → `presentation-evidence`
4. `story-architecture` → `presentation-story-architecture`
5. `story-grill` → `presentation-story-grill`
6. `deck-prototype` → `presentation-prototype`
7. `stage-grill` → `presentation-stage-grill`
8. `production-qa` → `presentation-deck-qa`

- Do not skip ahead because a PPTX, PDF, or other artifact already exists.
- Read `references/gate-results.md`, then translate a passed focused-skill result with `node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]... [--input <value>]... [--decision <value>]...`.
- Use `node .agents/skills/make-presentation/scripts/status.mjs set` when recording a reviewed artifact path, inputs, or decisions outside the result handoff.
- If product decisions remain unresolved, stop and grill in rounds over `references/grill-tree.md` per `references/grilling-rounds.md`: the whole frontier per round, each question with a recommended answer.
- If upstream decisions change, invalidate downstream gates and resume from the earliest invalidated gate.

## Cross-cutting practices

Read the named reference only when its trigger applies.

- **Grilling rounds** (`references/grilling-rounds.md` over the tree in `references/grill-tree.md`): the core of the pipeline. Every grill gate asks the whole frontier of the tree per round, with "yes"-accepts recommendations. Load-bearing decisions are asked, never silently assumed.
- **Interrogation** (`references/interrogate.md`): at `story-grill` and `stage-grill`, adversarial audience members attack the deck; only findings with a verified proof survive.
- **Sharpen and play back** (`references/sharpen-playback.md`): at `product-grill`, play the goal back in one paragraph and proceed on recommended defaults for reversible choices instead of asking every question.
- **Unslop** (`references/unslop-copy.md`): at `story-architecture`, `deck-prototype`, `stage-grill`, and `production-qa`, run `node .agents/skills/make-presentation/scripts/unslop-check.mjs <path>... [--strict]` on slide copy and speaker notes, then rewrite by hand.
- **Review buckets** (`references/review-buckets.md`): at `story-grill`, `stage-grill`, and `production-qa`, sort every review finding into Act on, Consider, Noted, or Dismissed.
- **Arena** (`references/arena-prototype.md`): at `deck-prototype`, build 2 to 3 competing directions for high-stakes or unsettled visual direction, pick a base, and graft the best parts. Skip in `fast-track`.
- **Deterministic checks** (`scripts/`): `grill-check.mjs` at every grill gate and at `production-qa`; `interrogation-check.mjs` at `story-grill` and `stage-grill`; `storyboard-check.mjs` at `story-architecture` and `story-grill`; `theme-check.mjs` when a theme is added or changed; `pptx-check.mjs` at `deck-prototype` (when a `.pptx` exists) and `production-qa` (through `qa-deck.mjs`). `build-packet.mjs` at `deck-prototype` for the `handoff` engine (and `google-slides` when a person builds the slides). An error from any check blocks the gate.
- **Data slides** (`references/data-slides.md`): at `evidence`, `story-architecture`, `deck-prototype`, and `production-qa` whenever a slide shows numbers.
- **Revising an existing deck** (`references/revise-existing.md`): when the source is a finished deck and the user wants it improved rather than rebuilt.
- **Encode lessons** (`references/encode-lessons.md`): when the user corrects the same mistake twice, fix it in the template or a check first, a test next, and a doc last. Keep the rule table current.

## Handoff

Report the chosen mode, profile, deck type, theme, selected engine (once resolved at prototype), current gate, reused artifacts, and next focused skill.
