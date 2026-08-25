# open-slide: deck-qa gate

Engine rules for the `production-qa` gate when the deck is built with open-slide. The pipeline skill (`presentation-deck-qa`) calls this; the generic backbone (align content, verify preview, export, record) lives in that skill — this file supplies the open-slide-specific surface and exports.

## Prerequisites — read this first

This adapter assumes an open-slide workspace already exists and its dependencies are installed. If you have not scaffolded one yet:

```bash
npx @open-slide/cli init <deck-name>      # creates the workspace
cd <deck-name>
pnpm install                              # or the package manager the scaffold uses
```

open-slide needs **Node 18+** and a package manager (the scaffold defaults to pnpm). Its own authoring skills (`create-slide`, `slide-authoring`, `apply-comments`, `current-slide`) ship inside the scaffolded workspace — they are **not** bundled with this pipeline repo.

## Preview surface — the live open-slide canvas

- Start the dev server (the live canvas this gate reviews against):
  ```bash
  pnpm dev
  ```
  It serves the canvas on a local URL (printed in the terminal, typically `http://localhost:5173`). Wait until it reports "ready" before inspecting.
- Run the repo's build / checks (`pnpm build`, or whatever the workspace defines), then review the complete deck in the live canvas.
- Inspect a contact sheet or full-page renders first, then changed, dense, and image-heavy pages at full size.
- The canvas is a fixed 1920×1080 — anything clipped below 1080px is gone, not scrolled. Treat clipping, unreadable type, inconsistent page grammar, or notes drift as failed QA.

### Headless review (no browser)

If you are a headless agent, open-slide's dev-server canvas is a browser surface, so satisfy the visual review programmatically:

- Drive the running dev server with a headless browser (Playwright/Puppeteer): navigate to each slide route, capture a 1920×1080 screenshot per page, and inspect the PNGs with your image-inspection tool (vision capability). Confirm nothing is clipped below 1080px and type is projector-readable.
- If your runtime cannot drive a browser, **do not claim the review passed** — record in QA-REPORT that the live-canvas review was not performed, or ask the user to review in their browser. The gate forbids skipping the review; an honest "not verified" beats a false "passed".

## Exports — triggered from the dev-server UI (there is no export CLI command)

open-slide **does not have a CLI export subcommand.** PPTX and PDF are produced from the **running dev server's UI** — the export controls live in the canvas UI (an export / download affordance per deck). This matters for an automated agent: exporting is a **browser/UI action**, not a shell command.

- For a **human-in-the-loop** run: tell the user to open the dev-server URL in a browser and use the in-canvas export to produce a visual-faithful PPTX and a matching PDF. Collect the downloaded file paths.
- For a **fully automated (headless)** run: drive the dev server with a headless browser (e.g. Playwright/Puppeteer pointed at the served canvas URL) and trigger the export affordance programmatically, then read the produced files. If your runtime cannot drive a browser, **stop and ask the user to export manually** — do not fabricate an export command.

### Visual-faithful PPTX contract

"Visual-faithful" means the PPTX export renders the visual slide layout into an authoritative high-resolution presentation surface so PowerPoint cannot reflow, re-wrap, or drift text boxes.
- **Do not confuse with Native-editable PPTX**: A native-editable export would trade visual fidelity for freeform shape manipulation. Visual-faithful PPTX guarantees presentation stability when projected.
- **Safety buffer & bounding box**: Verify that text containers include width safety buffers to prevent unexpected line wrapping on different OS font rendering engines.
- **Font loading stability**: Confirm global Google Fonts load cleanly without hanging the export pipeline.

### Mandatory QA verification checklist

1. **Strict 1:1 Parity**:
   - `Slide Count === Speaker Note Count === PDF Page Count === PPTX Slide Count`.
   - Every slide (including title, transitions, and backup slides) must have a synchronized, speakable note in the PPTX notes pane.
2. **Language Hygiene & Purity**:
   - For English / International Summit presentations: 100% English check. Verify 0 stray non-English characters in slide titles, body cards, chart captions, and notes.
3. **PowerPoint Native Spot-Check**:
   - Open the PPTX in Microsoft PowerPoint (or inspect headless XML).
   - Spot-check dense, multi-card, and visual metaphor slides (e.g. 3-pillar framework, iceberg diagram, large stat callouts) to confirm no text boxes shifted downward or truncated.
4. **PDF 16:9 Geometry**:
   - Confirm PDF export matches standard 16:9 (1920×1080) aspect ratio.

## Agreement check

If the live canvas, the PPTX, and the PDF disagree on any page, the export is not complete. Resolve the disagreement (usually by re-exporting after the offending change) rather than shipping mismatched formats.

## Evidence to record

In the `QA-REPORT.md` `## Preview` and `## Exports` sections, capture:

- Preview: which pages were inspected at full size, and any defects found and fixed.
- Exports: direct links to the PPTX and PDF, page/note counts, the 16:9 confirmation, and explicit PowerPoint verification evidence (which pages were opened, what was checked). State explicitly whether the export was triggered manually by the user or driven headlessly.
