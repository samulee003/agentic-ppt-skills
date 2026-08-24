# Marp: deck-qa gate

Engine rules for the `production-qa` gate when the deck is built with Marp. The pipeline skill (`presentation-deck-qa`) calls this; the generic backbone (align content, verify preview, export, record) lives in that skill — this file supplies the Marp-specific surface and exports.

## Prerequisites — read this first

Same as the prototype gate: Marp runs through `npx`, **Node 18+** required, no workspace scaffold. The first CLI invocation downloads `@marp-team/marp-cli`.

## Preview surface — rendered HTML

Marp has no live dev server in the pipeline sense. Preview by rendering the Markdown to HTML and opening it:

```bash
npx @marp-team/marp-cli@latest slides/<deck-id>.md -o /tmp/preview.html
```

Inspect a contact sheet (scroll through all pages) and the changed/dense/image-heavy pages at full size in a browser. Treat cut-off content, unreadable type, broken pagination (a `---` not producing a page break), or notes drift as failed QA.

### Headless review (no browser)

If you are a headless agent with no browser, satisfy the visual review programmatically rather than skipping it:

- Render the deck to PDF (`marp deck.md -o preview.pdf`), then rasterize pages to PNG with `pdftoppm` (poppler) or `magick`/`convert` (ImageMagick): `pdftoppm -png -r 100 preview.pdf page`.
- Open the resulting PNGs with your image-inspection tool (vision capability) and confirm: each page is 16:9, text is not clipped at the bottom edge, no page is blank, and `---` separators each produced exactly one page.
- If you have no image-inspection tool at all, **do not claim the review passed** — record in QA-REPORT that visual review was not performed and flag it for a human, or ask the user to open the HTML/PDF. The gate forbids skipping the review; an honest "not verified" beats a false "passed".

## Exports — CLI (there IS an export command)

Unlike the open-slide adapter, Marp exports via a **real CLI command** — no browser UI action required. This makes it the easiest engine for a fully headless agent.

```bash
# PowerPoint (PPTX) — editable, opens in Microsoft PowerPoint
npx @marp-team/marp-cli@latest slides/<deck-id>.md -o exports/<deck-id>.pptx

# PDF — print-ready
npx @marp-team/marp-cli@latest slides/<deck-id>.md -o exports/<deck-id>.pdf

# HTML — self-contained, shareable, no server
npx @marp-team/marp-cli@latest slides/<deck-id>.md -o exports/<deck-id>.html
```

Produce at least the formats the user asked for; if unspecified, produce PPTX + PDF (the pipeline's default deliverables). Marp infers the format from the `-o <file>.<ext>` output extension — `.pptx`, `.pdf`, `.html`.

- **PPTX:** confirm the file opens cleanly in PowerPoint. Marp's PPTX export renders each page as an image-backed slide (visual fidelity is high; text is not re-editable as native shapes — that is expected for Marp, not a defect).
- **PDF:** confirm page count matches the slide count and the aspect is 16:9.
- **HTML:** optional; confirm it opens without a server and pages navigate with arrow keys.
- After Markdown changes, re-run the export commands. Old files are not repaired.

## Agreement check

If the rendered HTML preview and the PPTX/PDF disagree on any page, re-export after the offending change. Marp's exports are deterministic from the same Markdown, so disagreement usually means a stale export.

## Evidence to record

In the `QA-REPORT.md` `## Preview` and `## Exports` sections, capture:

- Preview: which pages were inspected, any defects found and fixed.
- Exports: the exact export commands run, direct links to the PPTX/PDF, page counts, and the 16:9 confirmation. Note that Marp PPTX is image-backed (visual-faithful, not native-shape editable) so reviewers know what to expect in PowerPoint.
