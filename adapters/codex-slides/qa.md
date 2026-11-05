# Codex slides: deck-qa gate

1. Rebuild: `node .agents/skills/make-presentation/scripts/export-deck.mjs <deck-id> --engine=codex-slides`.
2. Run the skill's render, overflow, and missing-font checks on the built deck.
   Any overflow or missing font is a defect: fix it in `build.mjs`.
3. Run `node .agents/skills/make-presentation/scripts/qa-deck.mjs <deck-id> --engine=codex-slides`.
   Every error blocks the gate.
4. Inspect the montage, then dense, data, and image-heavy slides at full size.
5. Record in `QA-REPORT.md`: the skill's check output, `qa-deck.mjs` output,
   inspected slides, and how the PDF was produced.
