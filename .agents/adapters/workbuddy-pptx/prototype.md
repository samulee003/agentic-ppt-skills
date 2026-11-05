# WorkBuddy pptx: prototype gate

Read the built-in `workbuddy-pptx` skill first and follow its `.slide` DSL
rules. This file adds what the pipeline needs.

## Build loop

```bash
slidep create exports/<deck-id>.pptx
slidep upsert-dsl exports/<deck-id>.pptx --dsl-file slides/<deck-id>/01.slide
slidep lint exports/<deck-id>.pptx --dsl-file slides/<deck-id>/01.slide --page-index 0
```

Repeat `upsert-dsl` and `lint` for every page (`--page-index` is 0-based). Fix
every lint diagnostic before the next page.

## Mapping the pipeline

- One `.slide` per storyboard row, in order. The slide's title text is the
  storyboard's action title, verbatim (`plan-check.mjs` looks for it).
- **Speaker notes are required.** The built-in skill writes no notes unless
  asked; in this pipeline every slide carries its `SPEAKER-SCRIPT.md` wording
  in the slide's notes.
- A script may inject the titles and notes, so they are not retyped. It must
  not stamp one layout onto every page: a single template looped over the
  storyboard is how the first real run shipped 13 of 16 pages as the same row
  of boxes. Each page takes the layout its storyboard row names (hero, single
  statement, diagram, data chart, photo plus caption, comparison, activity).
- Imagery: follow the brief's *Imagery* line. When the brief promises photos,
  illustrations, or icons, place them (`plan-check.mjs` fails a deck without
  any); a coloured box is not an illustration.
- Layout: keep the content block inside the 720 px canvas height the DSL uses;
  leave room for the header band and the footer line.
- Avoid HTML entities (`&gt;`) and dingbat symbols in the DSL text; write the
  words instead.
- Theme: map `skills/make-presentation/themes/<id>.md` colours and fonts onto
  the DSL's styles.
- Labels on coloured pills are a common clip: `pptx-check.mjs` reports a no-wrap
  label that runs past the pill behind it.

## Representative set first, then the rest

1. Build only the representative set (three to five pages with different
   layouts: the hook, a diagram or data page, the densest page, the ending).
2. Run `node <skills>/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes`
   and fix every error.
3. Show the user those pages in WorkBuddy's preview panel and ask the
   `visual-confirm` question. Record the round and the reply in `GRILL-LOG.md`.
4. Build the remaining pages only after the user answers.

`slidep lint` checks syntax and overflow; it is not a design review. The
built-in skill's "no second screenshot pass" rule does not replace the user's
look at the representative set: that look is a grill round, not a screenshot
check.
