# Google Slides adapter

Engine rules for the **prototype** and **deck-qa** gates when the deck lives in
Google Slides: built through the Google Slides API (an agent's Google Slides
connector, Apps Script, or a script using the API), or built as a `.pptx` and
imported into Google Slides for collaborative editing.

- [`prototype.md`](./prototype.md): two build routes, mapping, type scale.
- [`qa.md`](./qa.md): exporting `.pptx` and `.pdf` back for the pipeline checks.

Choose it when the team reviews and edits in Google Workspace, comments matter,
or the final deck must stay a Google Slides file.

## Relationship to the pipeline

| Pipeline concept | Google Slides realization |
| --- | --- |
| "the real slide source" | the Google Slides presentation; record its URL in `PRESENTATION-BRIEF.md` under *Deliverables* |
| "live review surface" | the presentation in the browser, or page thumbnails from the API |
| "export" | File → Download → Microsoft PowerPoint (`.pptx`) and PDF, or the Drive API `files.export`, saved as `exports/<deck-id>.pptx` and `.pdf` |
| brand template | a Google Slides template (copy it, then use its layouts), or a `.potx` imported into Slides |

The pipeline's checks run on the exported files, so every gate works the same
as for any other engine.
