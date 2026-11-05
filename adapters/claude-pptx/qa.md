# Claude pptx: deck-qa gate

1. Rebuild: `node .agents/skills/make-presentation/scripts/export-deck.mjs <deck-id> --engine=claude-pptx`
   (runs `slides/<deck-id>/build.mjs`, then LibreOffice for the PDF when it is
   installed). If the deck was made by editing a template instead of a script,
   save it as `exports/<deck-id>.pptx` yourself and convert the PDF with the
   skill's LibreOffice wrapper.
2. Run the skill's validator on the `.pptx` (`scripts/office/validate.py`; add
   `--original <template>` for template-based decks). Fix every failure in the
   generator, not in the packed XML.
3. Run `node .agents/skills/make-presentation/scripts/qa-deck.mjs <deck-id> --engine=claude-pptx`.
   It checks the exports and runs `pptx-check.mjs` (slide/note/PDF parity, type
   floors, alt text, density). Every error blocks the gate.
4. Render the thumbnail grid and inspect every slide; open dense, data, and
   image-heavy slides at full size.
5. Record in `QA-REPORT.md`: validator result, `qa-deck.mjs` output, which
   slides were inspected, and whether the PDF came from LibreOffice.
