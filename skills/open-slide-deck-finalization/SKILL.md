---
name: open-slide-deck-finalization
description: Finalizes a complete open-slide presentation with aligned notes, verified evidence and timing, browser QA, a fresh visual-faithful PPTX, a matching PDF, and real PowerPoint inspection. Use when the production-qa gate is current, final downloads are requested, exports changed, or a deck must be proven stage-ready.
---

# Finalize an open-slide deck

Use when `production-qa` is the current gate or when a quick `create-slide` deck needs final delivery. Consult `slide-authoring` for technical authoring rules.

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

## Verify the browser

- Run the relevant repo checks and target build.
- Review the complete deck in the live open-slide canvas.
- Inspect full-page renders or a contact sheet, then inspect changed, dense, and image-heavy pages at full size.
- Reject verbose paragraphs and nested text tiers. Split the slide rather than shrink text or hide overflow.
- Treat clipping, unreadable type, inconsistent page grammar, or notes drift as failed QA.

## Export and inspect

- After deck or exporter changes, create a fresh visual-faithful PPTX and matching PDF; old downloads are not repaired.
- Validate PPTX archive integrity and confirm the archive opens cleanly.
- Confirm PDF page count and 16:9 geometry match the final deck.
- Open the PPTX in Microsoft PowerPoint and review wrapping, alignment, and notes.
- If PowerPoint, PDF, and the browser disagree, the export is not complete.

## Record and hand off

- Complete `templates/QA-REPORT.md` with evidence for every section and any remaining caveats.
- In pipeline mode, update the `production-qa` gate in `STATUS.md` through `.agents/skills/make-presentation/scripts/status.mjs`.
- Provide direct links to both PPTX and PDF, page/note counts, timing, inspected pages, and explicit PowerPoint verification evidence.
