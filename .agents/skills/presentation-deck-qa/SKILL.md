---
name: presentation-deck-qa
description: Finalizes a complete presentation with aligned notes, verified evidence and timing, preview QA, and a fresh export of the chosen delivery format(s). Use when the production-qa gate is current, final downloads are requested, exports changed, or a deck must be proven stage-ready.
---

# Finalize the deck for delivery

Use when `production-qa` is the current gate or when a deck needs final delivery. Author to the engine's technical rules (from its adapter).

## Engine

This gate renders and exports, so it needs the **slide engine** chosen at the prototype gate. Resolve it before QA:

- Read the engine from the status tracker via `node .agents/skills/make-presentation/scripts/status.mjs next <work-root>` (the JSON block in `STATUS.md` carries an `engine` field set at the prototype gate). Fall back to the `## Engine` line in `PRESENTATION-BRIEF.md` if the tracker has no engine recorded.
- If no engine is recorded anywhere, ask the user now, one question, with a recommended default (see `.agents/adapters/`: `open-slide`, `genoffice`, `marp`, `pptxgenjs`, `claude-pptx`, `codex-slides`, `google-slides`, `handoff`; recommend the one the prototype was built with).
- Read `.agents/adapters/<engine>/qa.md` (or `adapters/<engine>/qa.md`) for that engine's preview surface, export command, export format(s), and inspection steps. The sections below are the engine-agnostic backbone; the adapter supplies the engine-specific surface and exports.

## Choose context

- Use pipeline mode when `presentation-work/<deck-id>/` exists. Validate its status with the shipped helper. Read the current mode from `STATUS.md`.
- Use standalone mode when pipeline artifacts and `STATUS.md` are absent.
- In standalone mode, derive a minimal QA context from the deck and notes: purpose, likely audience, material claims, main/backup range, timing assumptions, and unresolved risks.
- Do not create a pipeline work area solely for finalization; only create or update `STATUS.md` when a pipeline work area exists.

## Align content

- Read repo instructions, the full deck, notes, and unresolved QA risks. In pipeline mode also read available `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, `GRILL-LOG.md`, and `SPEAKER-SCRIPT.md`.
- Check visible claims, notes, timing, and delivery wording for consistency with the approved brief, evidence ledger, story, and script.
- Reject stale, unsupported, or contradictory claims instead of polishing around them.
- **Strict 1:1 Parity**: Confirm slide count equals note count, including backup pages (`Slide Count === Speaker Note Count === PDF Page Count === PPTX Slide Count`). `pptx-check.mjs` verifies this on the exported files.
- **Language**: one language per surface, in the register the profile sets; no stray untranslated words across slides and notes.
- **Assets**: every non-original image, icon set, and font appears in the ledger's *Assets* table with a licence that allows this use, and required attributions are on the slide or in a credits page.
- Check factual consistency across slides, notes, references, and exports.
- Run `node .agents/skills/make-presentation/scripts/unslop-check.mjs <slide-folder-or-notes> --strict`. Fix every finding or record an exception with its reason in `QA-REPORT.md`. See `../make-presentation/references/unslop-copy.md`.
- Confirm the main-talk range, backup range, total timing, and per-slide timing.
- Confirm one necessary job and one dominant message per slide.
- In research-enhanced mode, require a per-slide fact check plus a reference and Q&A backup plan before export approval.

## Verify the preview & visual integrity

- Run the relevant repo checks and target build.
- Review the complete deck in the engine's live preview surface.
- Inspect full-page renders or a contact sheet, then inspect changed, dense, and image-heavy pages at full size.
- Reject verbose paragraphs and nested text tiers. Split the slide rather than shrink text or hide overflow.
- **Rendering contract**:
  - Verify every page against the theme in `PRESENTATION-BRIEF.md` (`../make-presentation/themes/<id>.md`): palette, surfaces, and anti-patterns. When a brand template is named, verify its palette, fonts, logo, and title area instead.
  - Verify the type scale against `../make-presentation/references/typography.md`: no body text under the body floor, nothing under the hard floor.
  - Verify diagrams and illustrations follow the theme, with no raw generic boxes.
  - Verify each slide is built in its storyboard archetype and data slides follow `../make-presentation/references/data-slides.md`.
- **Accessibility**:
  - Body text and background reach 4.5:1 contrast; large display text 3:1 (`theme-check.mjs` covers the theme palette; check overrides and text on photos by eye).
  - Every meaningful image and chart has alt text; decorative images are marked decorative.
  - Meaning never depends on colour alone (labels or patterns on chart series, icons with text).
  - Slide titles are unique, so the outline and screen readers can navigate the deck.
  - Reading order on dense pages follows the visual order (check in PowerPoint's Selection Pane or the engine's equivalent).
- Treat clipping, unreadable type, generic AI slop styling, inconsistent page grammar, or notes drift as failed QA.

## Export and inspect

- After deck or exporter changes, produce a fresh export in each chosen delivery format; old downloads are not repaired.
- **Unified Export**: Run `node .agents/skills/make-presentation/scripts/export-deck.mjs <deck-id>` to export fresh deliverables to `exports/` (default `--format=auto`: PPTX + PDF, with the PDF optional for PptxGenJS when LibreOffice is missing; tell the user if it was skipped). The engine comes from `STATUS.md` (or `--engine=<name>`), and each engine runs its own CLI: `open-slide export`, the Marp CLI, `node slides/<deck-id>/build.mjs` plus `soffice` for a PptxGenJS PDF, or `genoffice create`/`convert`; `claude-pptx` and `codex-slides` rebuild from `build.mjs` like `pptxgenjs`; for `google-slides` and `handoff` the tool exports the files and the script only checks them. Add `--dry-run` to print the commands first. The script fails if an expected file is missing or empty.
- **Automated QA checks**: Run `node .agents/skills/make-presentation/scripts/qa-deck.mjs <deck-id> [--export]`. It runs `open-slide qa` for open-slide and `genoffice slides audit` + `slides read --full` for genoffice, checks export integrity for every engine, and runs `pptx-check.mjs` on the `.pptx` (slide/note/PDF parity, type floors, alt text, density, image-only slides). Every error blocks the gate. It does not replace the visual, unslop, and PowerPoint checks in this skill and `adapters/<engine>/qa.md`; record the gate yourself with `status.mjs result`.
- **Reading deck**: when the brief asks for one, export it as its own file (`exports/<deck-id>-reading.pptx`/`.pdf`) and check it with `pptx-check.mjs --no-notes`.
- Follow `adapters/<engine>/qa.md` for the engine's export steps, archive integrity, geometry, and any native-application inspection.
- **Visual-Faithful Verification**: Verify that the exported PPTX preserves visual layout without text box re-wrapping or bounding-box drift when opened in Microsoft PowerPoint.
- **Speaker Notes Verification**: Confirm speaker notes are properly embedded in the exported PPTX notes pane for every slide.
- If the preview and any export disagree, the export is not complete.

## Record and hand off

- Sort remaining findings into Act on, Consider, Noted, or Dismissed using `../make-presentation/references/review-buckets.md`. Any Act on finding blocks the gate.
- Complete `templates/QA-REPORT.md` with evidence for every section and any remaining caveats.
- In pipeline mode, update the `production-qa` gate in `STATUS.md` through `.agents/skills/make-presentation/scripts/status.mjs`.
- Provide direct links to every exported file, page/note counts, timing, inspected pages, and explicit export verification evidence.
