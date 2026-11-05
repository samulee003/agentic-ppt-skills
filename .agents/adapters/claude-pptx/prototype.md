# Claude pptx: prototype gate

Read the skill's own `SKILL.md` first; its PptxGenJS gotchas (colours without
`#`, one `pptxgen` instance per file, `isTextBox: true`, `addNotes` for speaker
notes, native charts) apply in full. This file adds the pipeline's rules.

## Source and output

- Write the deck as `slides/<deck-id>/build.mjs`, so `export-deck.mjs` can
  rebuild it. Read the output folder from `DECK_OUT_DIR`, falling back to
  `exports/` at the workspace root (see `adapters/pptxgenjs/prototype.md` for
  the snippet).
- Build the representative set from `skills/presentation-prototype/references/prototype-set.md`,
  in storyboard order, one `addSlide()` per storyboard row.

## Mapping the pipeline

| Pipeline artifact | In the skill |
| --- | --- |
| Action title (`STORYBOARD.md`) | the slide's title text, verbatim |
| Archetype | the slide's layout: `hero` → one large text box; `split` → two columns; `diagram` → shapes and connectors; `cards` → 2–4 rounded rectangles; `data` → `addChart()` (native, never an image); `section` → full-bleed title; `interaction` → prompt card plus timer or options |
| Theme (`themes/<id>.md`) | the skill's structured-deck theme object, written into the file with its `apply_theme.js` |
| Speaker script | `slide.addNotes()` for every slide, including backup |
| Brand template | the skill's template workflow instead of a fresh `pptxgen()` deck |

## Type scale

Use the 405 pt column of `skills/make-presentation/references/typography.md`
for the default `LAYOUT_16x9` (10 × 5.625 in), or the 540 pt column for
`LAYOUT_WIDE`. Body 12–17 pt on the default layout, never under 10.5 pt;
captions and source lines never under 8 pt.

## Live review

Render the skill's thumbnail grid of the built deck, then open the dense and
data slides at full size. Run
`node .agents/skills/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes`
before calling the prototype ready.
