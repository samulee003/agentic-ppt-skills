# Codex slides: prototype gate

Read the `slides` skill's `SKILL.md` first and follow its layout helpers and
warnings (it asks the authoring script to call its overlap and out-of-bounds
helpers whenever slides are generated or edited). This file adds the pipeline's
rules.

- Write the deck as `slides/<deck-id>/build.mjs`; read the output folder from
  `DECK_OUT_DIR` with an `exports/` fallback (snippet in
  `adapters/pptxgenjs/prototype.md`).
- One slide per storyboard row. The slide title is the storyboard's action
  title, verbatim. Build each slide in its archetype (mapping table in
  `adapters/claude-pptx/prototype.md`); `data` slides use native charts.
- Apply the theme from `skills/make-presentation/themes/<id>.md`: palette as
  PptxGenJS colours (no `#`), fonts, surfaces.
- Type: the 405 pt column of `skills/make-presentation/references/typography.md`
  for the default 10 × 5.625 in layout.
- Speaker notes with `slide.addNotes()` on every slide.
- Review the skill's rendered PNGs for the representative set, then run
  `node .agents/skills/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes`.
