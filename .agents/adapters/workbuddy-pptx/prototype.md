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
- Generating the `.slide` files from the storyboard and speaker script with a
  small script (titles and notes injected, not retyped) keeps them in sync.
- Layout: keep the content block inside the 720 px canvas height the DSL uses;
  leave room for the header band and the footer line.
- Avoid HTML entities (`&gt;`) and dingbat symbols in the DSL text; write the
  words instead.
- Theme: map `skills/make-presentation/themes/<id>.md` colours and fonts onto
  the DSL's styles.
- Labels on coloured pills are a common clip: `pptx-check.mjs` reports a no-wrap
  label that runs past the pill behind it.

## Live review

The built-in skill's per-page `lint` and preview are the visual review for this
engine; its rules forbid a second screenshot pass, and the pipeline accepts its
per-page check instead. Run
`node <skills>/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes`
on the representative set.
