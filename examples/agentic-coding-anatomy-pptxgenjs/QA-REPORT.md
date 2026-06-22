# QA Report

## Context

- Mode: research-enhanced
- Pipeline or standalone: pipeline
- Engine: pptxgenjs
- Purpose / audience: Software developers and tech leads / technical education
- Main / backup range: Slides 1–5 / none

## Content

- The five-slide sequence keeps one dominant message per slide.
- Tool names on slide 3 are explicitly illustrative.
- Slide 4 frames the 2023 SWE-bench result as historical, with setup caveats.

## Evidence

- Per-slide fact check:
  - Slide 4 uses the original 2023 SWE-bench paper, arXiv:2310.06770v1, Table 5.
  - The 1.96% figure is identified as Claude 2 with BM25 retrieval on full SWE-bench.
  - The slide and notes state this is a historical baseline, not SWE-bench Lite, a current leaderboard result, or a controlled estimate of agent-loop uplift.
  - The iterative loop comparison is qualitative only.
- Claim safety:
  - `claim-01`: A — directly supportable historical fact with date/dataset/retrieval caveats.
  - `claim-02`: B — cautious qualitative interpretation, no numerical promise.

## Notes

- The build script (`slides/build.mjs`) attaches speaker notes to every slide via `addNotes(...)`.
- Verified the notes survive into the PPTX: each slide's `notesSlide` XML contains the script's notes text.
- 5 slides in the script = 5 slides in the PPTX (no orphans, no missing pages).

## Timing

- Estimated total presentation time: 5 minutes.
  - Slide 1: 30s · Slide 2: 60s · Slide 3: 60s · Slide 4: 90s · Slide 5: 60s

## Preview

- Produced the PPTX with `node slides/build.mjs` and inspected all five pages.
- Because PptxGenJS writes **native shapes**, each page's text is a real, selectable `<a:t>` run in the slide XML — verified by extracting `ppt/slides/slide1.xml` and `slide4.xml` and confirming the title, kicker, body, and caveat text all appear as editable runs (not images).
- Layout checked against the script's `x/y/w/h` coordinates: no text box clips its content; the 10×5.625in (16:9) layout renders with the intended margins.
- Type sizes are within the adapter's projector-safe range (kicker 14pt, heading 32pt, body 20pt, fine-print 16pt).

## Exports

Export method: **PptxGenJS `writeFile` (native-shape PPTX) + soffice PDF conversion**. Commands run:

```
node slides/build.mjs                                                       # → exports/agentic-coding-anatomy.pptx
soffice --headless --convert-to pdf exports/agentic-coding-anatomy.pptx     # → exports/agentic-coding-anatomy.pdf
```

- **PPTX** (`exports/agentic-coding-anatomy.pptx`, ~85KB): zip integrity verified (`unzip -t` → no errors). Opens cleanly. **Native-shape** — all text/objects are editable PowerPoint elements (the distinguishing property of this engine vs Marp's image-backed export). 5 slides, 16:9.
- **PDF** (`exports/agentic-coding-anatomy.pdf`, ~82KB): produced via `soffice --headless --convert-to pdf` (PptxGenJS does not write PDF directly). 5 pages, 16:9. Valid PDF.
- Note: if `soffice`/LibreOffice is unavailable in the target environment, the pipeline produces the PPTX only and the user converts to PDF externally — per the `pptxgenjs` adapter's `qa.md`.

## Remaining caveats

- The PDF is a soffice conversion, not a PptxGenJS-native export. Minor rendering differences from PowerPoint's own PDF export are possible (font substitution if a font is missing); the PPTX is the authoritative artifact.
- If the user needs the highest-fidelity visual PPTX (canvas-exact layout) rather than editable native shapes, the `open-slide` adapter is the better engine choice.
