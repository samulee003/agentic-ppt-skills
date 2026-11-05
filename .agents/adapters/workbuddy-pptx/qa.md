# WorkBuddy pptx: deck-qa gate

1. Confirm every page was written with `slidep upsert-dsl` and passed
   `slidep lint` with no diagnostics. That per-page check is this engine's
   visual review; do not add a screenshot pass on top of it.
2. Convert the PDF: `soffice --headless --convert-to pdf --outdir exports exports/<deck-id>.pptx`.
3. Run `node <skills>/make-presentation/scripts/qa-deck.mjs <deck-id> --engine=workbuddy-pptx`.
   It checks the exports and runs `pptx-check`, `plan-check` (titles and notes
   against the storyboard and script), `ledger-check`, `grill-check
   production-qa`, and `source-check --final`. Every error blocks the gate.
4. Record in `QA-REPORT.md`: the lint results per page, the `qa-deck.mjs`
   output, and how each warning was judged.
