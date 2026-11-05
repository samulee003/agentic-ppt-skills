# WorkBuddy pptx adapter

Engine rules for the **prototype** and **deck-qa** gates when WorkBuddy's
built-in `workbuddy-pptx` skill builds the slides: the `slidep` CLI writing one
`.slide` DSL file per page into a real `.pptx`.

Contributed from a real run (a 16-slide, 3-hour training deck): the pipeline ran
all eight gates, and `workbuddy-pptx` built the file.

- [`prototype.md`](./prototype.md): routing, the `.slide` workflow, mapping, notes.
- [`qa.md`](./qa.md): what the built-in checks cover and what the pipeline adds.

## Before you start

- **Install where WorkBuddy reads skills:** `npx --yes github:samulee003/agentic-ppt-skills --runtime=workbuddy`
  (copies into `~/.workbuddy/skills/` and `~/.workbuddy/adapters/`).
- **Name the pipeline explicitly.** WorkBuddy's `workbuddy-office-routing`
  sends every local PPT request to `workbuddy-pptx`. Say "use make-presentation,
  build with workbuddy-pptx", or the built-in skill takes the whole job and
  skips the gates.
- `engine.json` registers this adapter as an external engine: `export-deck.mjs`
  does not run `slidep`; it checks the files `slidep` wrote.

## Relationship to the pipeline

| Pipeline concept | WorkBuddy pptx realization |
| --- | --- |
| "the real slide source" | `slides/<deck-id>/NN.slide`, one DSL file per page |
| "live review surface" | WorkBuddy's preview panel and `slidep lint` per page |
| "export" | `slidep create` + `slidep upsert-dsl` write `exports/<deck-id>.pptx`; PDF via LibreOffice |
