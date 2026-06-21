# QA Report

## Context

- Mode: research-enhanced
- Pipeline or standalone: pipeline
- Engine: marp
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

- The Markdown source contains exactly 5 speaker-note blocks for 5 pages.
- Slide 4 notes include the source, retrieval setup, denominator, and caveats.

## Timing

- Estimated total presentation time: 5 minutes.
  - Slide 1: 30s · Slide 2: 60s · Slide 3: 60s · Slide 4: 90s · Slide 5: 60s

## Preview

- Rendered the Markdown to HTML (`marp deck.md -o preview.html`) and inspected all five pages at full size.
- Pagination verified: each `---` produces a clean page break; 5 pages total.
- Type is projector-readable at the default theme size; no page overflows.
- Speaker notes present on every page in the source.

## Exports

Export method: **Marp CLI** (real shell command, no browser UI). Commands run:

```
npx @marp-team/marp-cli slides/agentic-coding-anatomy.md -o exports/agentic-coding-anatomy.pptx
npx @marp-team/marp-cli slides/agentic-coding-anatomy.md -o exports/agentic-coding-anatomy.pdf
npx @marp-team/marp-cli slides/agentic-coding-anatomy.md -o exports/agentic-coding-anatomy.html
```

- **PPTX** (`exports/agentic-coding-anatomy.pptx`, ~733KB): zip integrity verified (`unzip -t` → no errors). Opens cleanly. Note: Marp's PPTX is **image-backed** — each page is a rendered image inside the slide, so text is not re-editable as native PowerPoint shapes. This is expected for Marp, not a defect.
- **PDF** (`exports/agentic-coding-anatomy.pdf`, ~107KB): valid PDF v1.7, 5 pages, 16:9.
- **HTML** (`exports/agentic-coding-anatomy.html`, ~114KB): self-contained, opens without a server, arrow-key navigation.

## Remaining caveats

- The PPTX is image-backed (visual-faithful but not text-editable). If the user needs a native-shape editable PPTX, the `pptxgenjs` adapter is the right engine choice instead.
