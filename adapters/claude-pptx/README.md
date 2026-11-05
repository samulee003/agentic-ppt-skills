# Claude pptx adapter

Engine rules for the **prototype** (`deck-prototype`) and **deck-qa**
(`production-qa`) gates when the deck is built with Claude's own `pptx` skill:
the built-in skill on claude.ai, or the `document-skills` plugin from
[`anthropics/skills`](https://github.com/anthropics/skills) in Claude Code.

- [`prototype.md`](./prototype.md): how the pipeline's storyboard, theme, and
  type scale map onto the skill's PptxGenJS workflow.
- [`qa.md`](./qa.md): validation, rendering, and the pipeline checks.

Choose it when Claude is the agent and the deliverable is a **native, editable
`.pptx`**. It writes the same PptxGenJS code as the `pptxgenjs` adapter, but adds
the skill's validator, thumbnail grid, theme writer, and template editing
(unzip → edit slide XML → zip), so it can also work on top of an existing
`.pptx` or `.potx` brand template.

## Prerequisites

- Claude Code: `/plugin marketplace add anthropics/skills`, then
  `/plugin install document-skills@anthropic-agent-skills`. On claude.ai the
  skill is built in.
- Node 18+ (for the pipeline's own scripts).
- The skill's licence: the document skills are source-available, not open
  source. Use them; do not copy their files into this repository.

## Relationship to the pipeline

| Pipeline concept | Claude pptx realization |
| --- | --- |
| "the real slide source" | `slides/<deck-id>/build.mjs`, a PptxGenJS script written by the skill |
| "live review surface" | the skill's thumbnail grid of the built `.pptx`, then individual slides |
| "export" | `node slides/<deck-id>/build.mjs` writes `exports/<deck-id>.pptx`; PDF via the skill's LibreOffice wrapper |
| brand template | the skill's template path: copy the `.potx`/`.pptx`, add slides from its layouts, edit slide XML |

The pipeline still owns every gate. The skill builds and edits the file; it
does not decide content, skip evidence, or mark a gate passed.
