# open-slide: deck-qa gate

Engine rules for the `production-qa` gate when the deck is built with open-slide. The pipeline skill (`presentation-deck-qa`) calls this; the generic backbone (align content, verify preview, export, record) lives in that skill — this file supplies the open-slide-specific surface and exports.

## Preview surface — the live open-slide canvas

- Run the repo's build / checks, then `pnpm dev` (or the workspace's dev command) and review the complete deck in the **live open-slide canvas**.
- Inspect a contact sheet or full-page renders first, then changed, dense, and image-heavy pages at full size.
- The canvas is a fixed 1920×1080 — anything clipped below 1080px is gone, not scrolled. Treat clipping, unreadable type, inconsistent page grammar, or notes drift as failed QA.

## Exports — visual-faithful PPTX + PDF

open-slide exports a **visual-faithful PPTX** and a matching **PDF**. "Visual-faithful" means the PPTX preserves the canvas layout rather than re-flowing it as native PowerPoint shapes — so the browser preview and the PPTX should agree pixel-for-pixel.

- After deck or exporter changes, produce a **fresh** PPTX and PDF. Old downloads are not repaired by re-exporting.
- **PPTX:** validate the archive integrity and confirm it opens cleanly (a PPTX is a zip; a truncated/corrupt archive fails QA on its own).
- **PDF:** confirm page count and **16:9 geometry** match the final deck. open-slide decks are 16:9 (1920×1080); a mismatched aspect ratio means the wrong export was used.
- **PowerPoint:** open the PPTX in Microsoft PowerPoint and review wrapping, alignment, and notes. PPTX fidelity is high but PowerPoint's text engine differs from the browser — check that nothing re-wrapped or re-aligned.

## Agreement check

If the live canvas, the PPTX, and the PDF disagree on any page, the export is not complete. Resolve the disagreement (usually by re-exporting after the offending change) rather than shipping mismatched formats.

## Evidence to record

In the `QA-REPORT.md` `## Preview` and `## Exports` sections, capture:

- Preview: which pages were inspected at full size, and any defects found and fixed.
- Exports: direct links to the PPTX and PDF, page/note counts, the 16:9 confirmation, and explicit PowerPoint verification evidence (which pages were opened, what was checked).
