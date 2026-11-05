# Handoff: deck-qa gate

1. Export the final deck from the tool as `exports/<deck-id>.pptx` (required)
   and `exports/<deck-id>.pdf` (when the tool can produce it).
2. Run `node .agents/skills/make-presentation/scripts/qa-deck.mjs <deck-id> --engine=handoff`.
   The PDF is optional for this engine; every other error blocks the gate.
3. `qa-deck.mjs` runs `plan-check.mjs`, which compares the export with the
   plan: the slide count with `STORYBOARD.md`, each slide's text with its
   action title, and its notes with `SPEAKER-SCRIPT.md`. Tools rewrite copy
   silently; fix every drift in the tool, and send any changed claim back
   through the evidence ledger.
4. Open the `.pptx` in PowerPoint (or the presenter's app) and inspect every
   slide; image-only slides reported by `pptx-check.mjs` cannot be edited later.
5. Record in `QA-REPORT.md`: the tool used, its file link, export time,
   `qa-deck.mjs` output, and any drift found and fixed.
