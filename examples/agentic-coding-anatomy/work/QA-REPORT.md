# QA Report

## Context

- Mode: research-enhanced
- Pipeline or standalone: pipeline
- Purpose / audience: Software developers and tech leads / technical education
- Main / backup range: Slides 1-5 / none

## Content

- The five-slide sequence keeps one dominant message per slide.
- Neutral Open-slide demo labeling replaces vendor attribution.
- Slide 2 descriptions use 30px type.
- Slide 3 tool names are explicitly illustrative.
- Slide 5 uses risk-based human review rather than universal approval claims.

## Evidence

- Per-slide fact check:
  - Slide 4 uses the original 2023 SWE-bench paper, arXiv:2310.06770v1, Table 5.
  - The 1.96% figure is identified as Claude 2 with BM25 retrieval on full SWE-bench.
  - The slide and notes state that this is a historical baseline, not SWE-bench Lite, a current leaderboard result, or a controlled estimate of agent-loop uplift.
  - The iterative loop comparison is qualitative only: observe, edit, test, retry.
- Reference and Q&A backup:
  - Benchmark setup, loop stopping, command permissions, and risk-based approvals are documented in `STORY.md` and `SPEAKER-SCRIPT.md`.
- Claim safety:
  - `claim-01`: A — directly supportable historical fact with setup and date caveats.
  - `claim-02`: B — cautious interpretation of the loop mechanism with no numerical performance promise.

## Notes

- Source and exported presentation both contain exactly 5 note entries for 5 slides.
- Slide 4 notes include the source, retrieval setup, denominator, and caveats.
- Microsoft PowerPoint identified every slide thumbnail as having speaker notes.

## Timing

- Estimated total presentation time: 5 minutes.
  - Slide 1: 30s
  - Slide 2: 60s
  - Slide 3: 60s
  - Slide 4: 90s
  - Slide 5: 60s

## Checks

- `pnpm exec biome check apps/demo/slides/agentic-coding-anatomy/index.tsx`: passed.
- `pnpm --filter demo build`: passed on 2026-06-21.
- Source parity: 5 slide pages / 5 note entries.
- Pipeline status validation: passed.

## Browser

- The live Open-slide route loaded and completed fresh PDF and PPTX exports without browser errors.
- The five-page contact sheet was inspected end to end.
- Slides 2, 3, and 4 were inspected at full size for readable type, clipping, and evidence wording.
- The first PPTX render exposed wrapped header/footer labels; `white-space: nowrap` was added and the deck was re-exported before approval.

## PPTX

- Fresh artifact: `test-results/agentic-coding-anatomy-editable.pptx`
- Archive integrity: passed with no compressed-data errors.
- Counts: 5 slides / 5 notes.
- The final embedded slide images preserve the header and footer labels without the wrapping found in the first export.

## PDF

- Fresh artifact: `test-results/agentic-coding-anatomy-editable.pdf`
- Counts and geometry: 5 pages, 1440 × 810 pt, 16:9.
- Contact sheet: `test-results/agentic-coding-anatomy-final-review/contact-sheet.png`
- PDF visuals match the approved browser render.

## PowerPoint

- Opened the final PPTX in Microsoft PowerPoint on 2026-06-21.
- PowerPoint showed 5 slides and marked all 5 as having notes.
- Slides 1 and 4 were inspected at 101% zoom; slide 4's header, cards, source line, footer, and page number remained aligned after the re-export.
- The notes pane displayed the matching slide notes.

## Remaining caveats

- The 1.96% result is a historical 2023 setup and must not be presented as current agent performance.
- The PPTX is visual-faithful: rendered slide images are the visible authority, with text structure preserved for accessibility/editing support.
