# Handoff adapter

For any tool the agent cannot drive directly: ChatGPT (its slide or file
generation in the chat app), Gamma, Canva, Microsoft Copilot in PowerPoint,
Keynote, or a human designer. The pipeline prepares everything the tool needs,
the tool (or person) builds the slides, and the exported files come back for
the same QA as every other engine.

- [`prototype.md`](./prototype.md): the build packet and how to use it.
- [`qa.md`](./qa.md): bringing the exports back and checking them.

## How it works

1. At `deck-prototype`, run
   `node .agents/skills/make-presentation/scripts/build-packet.mjs <work-root>`.
   It writes `BUILD-PACKET.md`: deck type, theme contract, type scale, and one
   block per slide (action title, archetype, on-screen copy, speaker notes,
   sources).
2. Paste or upload the packet into the tool, build the representative set, and
   export `.pptx` (and `.pdf`) into `exports/`.
3. The pipeline checks the exports with `pptx-check.mjs` and continues.

## Relationship to the pipeline

| Pipeline concept | Handoff realization |
| --- | --- |
| "the real slide source" | the external tool's file; record its link or path in the brief |
| "live review surface" | the tool's editor, plus the exported `.pptx`/`.pdf` |
| "export" | the tool's own download/export, saved as `exports/<deck-id>.pptx` and `.pdf` |

Tools that cannot export a `.pptx` (or export only images) cannot meet the
note-parity and editability checks; say so to the user before choosing them.
