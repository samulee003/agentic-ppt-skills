# QA Report

## Context

- Mode: general
- Profile / deck type: `training-zh-hant` / `training`
- Pipeline or standalone: pipeline (simulated run)
- Purpose / audience: 45-minute workshop for ~20 new frontline staff
- Main / backup range: slides 1–12 main, B1 backup

## Content

- Headline test (titles alone carry the argument): yes (story-grill)
- Archetypes match the storyboard: yes; `plan-check.mjs` confirms every action title is on its slide

## Evidence

- Per-slide fact check: E1/E2 on slide 2 and B1, labelled as the centre's internal review; E3 rejected; E4–E6 practice and case, labelled
- Reference and Q&A backup: B1 explains how the figures were counted and their limits
- Assets and licences: centre logo, own use, with alt text

## Notes

- Slide / note parity: 13 / 13
- Unslop scan: 0 findings

## Timing

- Main talk vs brief: 39.5 of 45 minutes, about 5 minutes spare
- Measured or estimated: estimated from the notes (`storyboard-check.mjs` compares each slot with its notes); room prompts on slides 2, 4, 6–9, and 11

## Visual integrity

- Theme or brand template: `sticker-pop`; logo on slides 1 and 12
- Rendering contract verified: cream ground, ink borders, hard shadows, tilted cards; quoted Cantonese lines in 「」
- Type floors (`pptx-check.mjs` result): no errors, no warnings
- Data slides: slide 2 shows the two counts with their source line; no causal wording
- Diagram and illustration craft: slide 4 connectors fixed after render review

## Accessibility

- Contrast: theme pairs pass `theme-check.mjs`
- Alt text: the logo has alt text; no other images
- Colour-independent meaning: every coloured card has a text label
- Unique titles and reading order: titles unique; single-column reading order

## Preview

- Rendered all 13 slides from the PDF; fixed slide 6's line break and slide 4's connectors

## Exports

- Files, slide / note / PDF page counts: `exports/refusal-trust-workshop.pptx`, `.pdf`; 13 / 13 / 13
- `qa-deck.mjs` output: pptx, plan, ledger, grill, and source checks all report no errors
- PowerPoint inspection: not performed in the sandbox (LibreOffice render only)
- Reading deck (if requested): not requested; pocket card is slide 11

## Review findings

- Act on: none open
- Consider: S3 variant card added to the role-play
- Noted: S5, T4
- Dismissed: S2

## Remaining caveats

- Fonts: `Noto Sans TC` was substituted by WenQuanYi Zen Hei in the sandbox render; check on the presentation laptop
- The case-review spreadsheet is still to be filed (figures confirmed in writing)
