---
name: presentation-deck-qa
description: Finalizes a complete presentation with aligned notes, verified evidence and timing, preview QA, and a fresh export of the chosen delivery format(s). Use when the production-qa gate is current, final downloads are requested, exports changed, or a deck must be proven stage-ready.
---

# Finalize the deck for delivery

Use when `production-qa` is the current gate or when a deck needs final delivery. Author to the engine's technical rules (from its adapter).

## Engine

This gate renders and exports, so it needs the **slide engine** chosen at the prototype gate. Resolve it before QA:

- Read the engine from `PRESENTATION-BRIEF.md` (recorded at the prototype gate) or from `STATUS.md` if present.
- If no engine is recorded, ask the user now, one question, with a recommended default (see `adapters/`; the bundled reference adapter is `open-slide`).
- Read `adapters/<engine>/qa.md` for that engine's preview surface, export command, export format(s), and inspection steps. The sections below are the engine-agnostic backbone; the adapter supplies the engine-specific surface and exports.

## Choose context

- Use pipeline mode when `presentation-work/<deck-id>/` exists. Validate its status with the shipped helper. Read the current mode from `STATUS.md`.
- Use standalone mode when pipeline artifacts and `STATUS.md` are absent.
- In standalone mode, derive a minimal QA context from the deck and notes: purpose, likely audience, material claims, main/backup range, timing assumptions, and unresolved risks.
- Do not create a pipeline work area solely for finalization; only create or update `STATUS.md` when a pipeline work area exists.

## Align content

- Read repo instructions, the full deck, notes, and unresolved QA risks. In pipeline mode also read available `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, `STORY.md`, `STORYBOARD.md`, `GRILL-LOG.md`, and `SPEAKER-SCRIPT.md`.
- Check visible claims, notes, timing, and delivery wording for consistency with the approved brief, evidence ledger, story, and script.
- Reject stale, unsupported, or contradictory claims instead of polishing around them.
- Confirm slide count equals note count, including backup pages.
- Check factual consistency across slides, notes, references, and exports.
- Confirm the main-talk range, backup range, total timing, and per-slide timing.
- Confirm one necessary job and one dominant message per slide.
- In research-enhanced mode, require a per-slide fact check plus a reference and Q&A backup plan before export approval.

## Verify the preview

- Run the relevant repo checks and target build.
- Review the complete deck in the engine's live preview surface.
- Inspect full-page renders or a contact sheet, then inspect changed, dense, and image-heavy pages at full size.
- Reject verbose paragraphs and nested text tiers. Split the slide rather than shrink text or hide overflow.
- Treat clipping, unreadable type, inconsistent page grammar, or notes drift as failed QA.

## Export and inspect

- After deck or exporter changes, produce a fresh export in each chosen delivery format; old downloads are not repaired.
- Follow `adapters/<engine>/qa.md` for the engine's export steps, archive integrity, geometry, and any native-application inspection.
- If the preview and any export disagree, the export is not complete.

## Record and hand off

- Complete `templates/QA-REPORT.md` with evidence for every section and any remaining caveats.
- In pipeline mode, update the `production-qa` gate in `STATUS.md` through `.agents/skills/make-presentation/scripts/status.mjs`.
- Provide direct links to every exported file, page/note counts, timing, inspected pages, and explicit export verification evidence.
