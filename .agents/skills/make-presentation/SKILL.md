---
name: make-presentation
description: Turns a source folder, existing deck, or presentation idea into a complete presentation product by routing through source intake, product grilling, evidence, story, prototype, stage review, and final delivery. Use when starting a presentation from materials, rebuilding a deck, resuming a partial presentation project, or asking for an end-to-end PPT/PDF workflow.
---

# Make a presentation product

Read repo instructions first. Route the project from the earliest unresolved gate instead of recreating work.

## Workspace & Runtime Preflight (Gate 0)

Before executing presentation workflows, verify the execution environment:

1. **Dependency Preflight**:
   - Check if `@open-slide/core` is installed in `node_modules`. If missing or if running in a fresh repo, run `npm.cmd i @open-slide/core` (or `npm i @open-slide/core` on Unix).
   - Ensure the official dev server runs via `npx.cmd open-slide dev` (or `open-slide dev`) so that in-browser **Inspect Mode (I)**, **Design Panel (D)**, **Notes**, and real-time **Slide Drawer** are fully active.
2. **Design System Source**:
   - Extract design tokens (palette, typography, lighting mood, aspect ratios) from Stitch MCP (`DESIGN.md` / `projects/<id>`).
3. **Workspace Organization**:
   - Derive or confirm `deck-id`, then use `presentation-work/<deck-id>/`.
   - Slide code lives strictly in `slides/<deck-id>/index.tsx`.
   - Image & icon assets live in `slides/<deck-id>/assets/`.

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
- Choose `research-enhanced` when the deck depends on consequential external claims, research, citations, datasets, policy, law, medicine, psychology, finance, safety, or statistics.
- Re-evaluate mode after source intake. If later evidence triggers research safeguards, run `node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"`.
- Read the current mode from `STATUS.md` before invoking Evidence or Finalization.
- Under deadline pressure, reduce scope; never silently waive evidence, readability, or export integrity.

## Route one gate at a time

Read `references/gates.md` for pass conditions and artifact owners. Invoke focused skills in sequence:

0. `preflight-check` → Verify `@open-slide/core` runtime & Stitch MCP design tokens.
1. `source-intake` → `presentation-source-intake`
2. `product-grill` → `presentation-product-grill`
3. `evidence` → `presentation-evidence`
4. `story-architecture` → `presentation-story-architecture` (Categorize every slide: 大字流 / 半圖流 / 全圖流).
4.5. `visual-assets` → **Visual Asset Generator Subagent**:
   - For **Mechanisms / Frameworks / Comparisons**: Generate **High-End Flat Vector / Flat Icon sets** matching Stitch MCP palette (`#FAF7F2`, `#B45309`, `#0F172A`, `#047857`, `#BE123C`). No cheap emojis, no floating cards.
   - For **Emotional Resonance / Life Dramas / Climax**: Generate **Cinematic 35mm Photography** (Portra 400, 3500K golden hour lighting).
   - Save generated assets to `slides/<deck-id>/assets/` and use ESM `import` in `slides/<deck-id>/index.tsx`.
5. `story-grill` → `presentation-story-grill`
6. `deck-prototype` → `presentation-prototype`
7. `stage-grill` → `presentation-stage-grill`
8. `production-qa` → `presentation-deck-qa`

- Do not skip ahead because a PPTX, PDF, or other artifact already exists.
- Read `references/gate-results.md`, then translate a passed focused-skill result with `node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]... [--input <value>]... [--decision <value>]...`.
- Use `node .agents/skills/make-presentation/scripts/status.mjs set` when recording a reviewed artifact path, inputs, or decisions outside the result handoff.
- If product decisions remain unresolved, stop for one-question-at-a-time grilling with a recommended answer.
- If upstream decisions change, invalidate downstream gates and resume from the earliest invalidated gate.

## Handoff

Report the chosen mode, current gate, reused artifacts, and next focused skill.
