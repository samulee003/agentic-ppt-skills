# Codex slides adapter

Engine rules for the **prototype** and **deck-qa** gates when the deck is built
with the `slides` skill from [`openai/skills`](https://github.com/openai/skills)
in Codex. That skill writes PptxGenJS decks and ships render and layout
helpers (slide PNGs, a montage, overflow and missing-font checks).

- [`prototype.md`](./prototype.md): mapping the storyboard, theme, and type scale.
- [`qa.md`](./qa.md): its render and overflow checks plus the pipeline checks.

Choose it when Codex is the agent and the deliverable is a native, editable
`.pptx`. Install the skill per the `openai/skills` repository; Codex reads
skills from `.agents/skills/`, the same folder this pipeline installs into.

## Relationship to the pipeline

| Pipeline concept | Codex slides realization |
| --- | --- |
| "the real slide source" | `slides/<deck-id>/build.mjs` (PptxGenJS) |
| "live review surface" | the skill's rendered slide PNGs and montage |
| "export" | `node slides/<deck-id>/build.mjs` → `exports/<deck-id>.pptx`; PDF via LibreOffice |

The pipeline owns the gates; the skill builds the file.
