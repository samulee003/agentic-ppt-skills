# Google Slides: deck-qa gate

1. Export the current presentation as `exports/<deck-id>.pptx` and
   `exports/<deck-id>.pdf` (File → Download, or Drive API `files.export` with
   the PowerPoint and PDF MIME types). Exports are snapshots: export again after
   any edit.
2. Run `node .agents/skills/make-presentation/scripts/qa-deck.mjs <deck-id> --engine=google-slides`.
   It checks both files and runs `pptx-check.mjs` (slide/note/PDF parity, type
   floors, alt text, density). Every error blocks the gate; fix it in Slides and
   export again.
3. Open the exported `.pptx` in PowerPoint when the audience will present from
   PowerPoint: Slides exports can shift fonts and line breaks.
4. Resolve or answer every open comment in the Slides file before passing.
5. Record in `QA-REPORT.md`: the presentation URL, export time, `qa-deck.mjs`
   output, font substitutions, and the PowerPoint check.
