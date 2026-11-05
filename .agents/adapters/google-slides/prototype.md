# Google Slides: prototype gate

## Pick a build route

| Route | Use when | How |
| --- | --- | --- |
| **API** | the agent has a Google Slides connector or API access | create or copy the presentation, then `presentations.batchUpdate` with `createSlide` (from the theme's layouts), `insertText`, `createShape`, `createImage`, and `updateParagraphStyle` / `updateTextStyle`; write speaker notes into each slide's notes page (`notesProperties.speakerNotesObjectId`) |
| **Import** | the agent can build `.pptx` locally but not call the API | build with `pptxgenjs`, `claude-pptx`, or `codex-slides`, then File → Import slides (or upload and open with Google Slides) |

The import route converts on upload: re-check fonts, line breaks, and charts in
Slides afterwards. Native PowerPoint charts become static images or Sheets
charts; rebuild important `data` slides as linked Google Sheets charts when the
numbers will change.

## Mapping the pipeline

- One slide per storyboard row; the slide title is the action title, verbatim.
- Build each slide in its archetype (mapping table in
  `adapters/claude-pptx/prototype.md`; in Slides, `data` → a Google Sheets chart).
- Theme: set the presentation theme colours and fonts from
  `skills/make-presentation/themes/<id>.md`. Slides offers Google Fonts only;
  pick the nearest one (for CJK, Noto Sans TC / SC) and note any substitution in
  the brief.
- Alt text: set a description on every image and chart (API: `description` on
  the page element).

## Type scale

Default 16:9 Slides pages are 10 × 5.625 in: use the 405 pt column of
`skills/make-presentation/references/typography.md`. Body 12–17 pt, never under
10.5 pt; captions never under 8 pt.

## Live review

Review the representative pages in the browser at presenter size, or fetch page
thumbnails (`presentations.pages.getThumbnail`). Then export a `.pptx` and run
`node .agents/skills/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes`.
