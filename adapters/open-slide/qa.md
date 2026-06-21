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

## Exports — triggered from the dev-server UI (there is no export CLI command)

open-slide **does not have a CLI export subcommand.** PPTX and PDF are produced from the **running dev server's UI** — the export controls live in the canvas UI (an export / download affordance per deck). This matters for an automated agent: exporting is a **browser/UI action**, not a shell command.

- For a **human-in-the-loop** run: tell the user to open the dev-server URL in a browser and use the in-canvas export to produce a visual-faithful PPTX and a matching PDF. Collect the downloaded file paths.
- For a **fully automated (headless)** run: drive the dev server with a headless browser (e.g. Playwright/Puppeteer pointed at the served canvas URL) and trigger the export affordance programmatically, then read the produced files. If your runtime cannot drive a browser, **stop and ask the user to export manually** — do not fabricate an export command.

"Visual-faithful" means the PPTX preserves the canvas layout rather than re-flowing it as native PowerPoint shapes — so the browser preview and the PPTX should agree pixel-for-pixel.

- After deck or exporter changes, produce a **fresh** PPTX and PDF. Old downloads are not repaired by re-exporting.
- **PPTX:** validate the archive integrity (a PPTX is a zip; a truncated/corrupt archive fails QA on its own) and confirm it opens cleanly.
- **PDF:** confirm page count and **16:9 geometry** match the final deck. open-slide decks are 16:9 (1920×1080); a mismatched aspect ratio means the wrong export was used.
- **PowerPoint:** open the PPTX in Microsoft PowerPoint and review wrapping, alignment, and notes. PPTX fidelity is high but PowerPoint's text engine differs from the browser — check that nothing re-wrapped or re-aligned.

## Agreement check

If the live canvas, the PPTX, and the PDF disagree on any page, the export is not complete. Resolve the disagreement (usually by re-exporting after the offending change) rather than shipping mismatched formats.

## Evidence to record

In the `QA-REPORT.md` `## Preview` and `## Exports` sections, capture:

- Preview: which pages were inspected at full size, and any defects found and fixed.
- Exports: direct links to the PPTX and PDF, page/note counts, the 16:9 confirmation, and explicit PowerPoint verification evidence (which pages were opened, what was checked). State explicitly whether the export was triggered manually by the user or driven headlessly.
