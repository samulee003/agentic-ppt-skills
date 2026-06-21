# PptxGenJS: deck-qa gate

Engine rules for the `production-qa` gate when the deck is built with PptxGenJS. The pipeline skill (`presentation-deck-qa`) calls this; the generic backbone (align content, verify preview, export, record) lives in that skill — this file supplies the PptxGenJS-specific surface and exports.

## Prerequisites — read this first

Same as the prototype gate: the deck's Node project exists with `pptxgenjs` installed (`slides/<deck-id>/package.json` + `node_modules`), **Node 18+** present. No dev server, no browser.

## Preview surface — the produced PPTX

PptxGenJS has no live canvas. The "preview" IS the PPTX the script writes. Produce it fresh, then inspect:

```bash
node slides/<deck-id>/build.mjs        # writes exports/<deck-id>.pptx
```

Inspect the produced `.pptx`: page count, then the changed/dense/image-heavy pages at full size in PowerPoint or a previewer. Because PptxGenJS writes **native shapes** (not image-backed pages), check that text boxes do not clip their content and that the layout matches the script's `x/y/w/h` coordinates. Treat clipped text, unreadable type, or notes drift as failed QA.

## Exports — the script writes the PPTX directly (native shapes)

The build script **is** the export: `pres.writeFile({ fileName: ... })` writes a native, fully-editable PPTX. This is PptxGenJS's distinguishing property — text and objects are real PowerPoint shapes, not images.

- **PPTX:** produced by `node build.mjs`. Confirm it opens cleanly in PowerPoint and every text box shows its full content (no clipping).
- **PDF:** PptxGenJS does not write PDF directly. To produce a PDF, open the PPTX in PowerPoint/LibreOffice and "Save as PDF", or convert headlessly (e.g. `libreoffice --headless --convert-to pdf exports/<deck-id>.pptx`). If no PDF path is available in the environment, produce the PPTX only and tell the user — do not fabricate a PDF.
- After script changes, re-run `node build.mjs`. The old `.pptx` is overwritten; a stale PDF (if one exists) must be regenerated separately.

## Agreement check

Because the PPTX is the primary artifact (there is no separate preview surface to disagree with), the main risk is internal: the script's coordinates vs. how PowerPoint actually renders them. Open the PPTX and confirm each page matches the intended layout. If a text box clips, adjust its `w`/`h` or `fontSize` in the script and re-run.

## Evidence to record

In the `QA-REPORT.md` `## Preview` and `## Exports` sections, capture:

- Preview: which pages were inspected in the PPTX, any clipping/layout defects found and fixed in the script.
- Exports: the `node build.mjs` command, direct link to the `.pptx`, page count, and the 16:9 confirmation. If a PDF was produced, name the conversion method used; if not, state that PptxGenJS writes PPTX only and the user should convert if needed.
