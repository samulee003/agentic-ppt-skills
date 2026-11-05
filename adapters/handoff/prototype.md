# Handoff: prototype gate

1. Make sure `STORYBOARD.md` passes `storyboard-check.mjs` and the speaker
   script exists in draft; the packet is only as good as these.
2. Write the packet:
   `node .agents/skills/make-presentation/scripts/build-packet.mjs <work-root>`.
3. Give the packet to the tool with this instruction (adapt the tool name):

   > Build the slides in this packet exactly as specified. Use each slide's
   > action title verbatim as the slide title, follow the archetype and theme,
   > put the speaker notes in the notes field of each slide, and do not add,
   > merge, or reorder slides. Export as PowerPoint (.pptx) and PDF.

4. Build the representative set first (`skills/presentation-prototype/references/prototype-set.md`),
   export, and run
   `node .agents/skills/make-presentation/scripts/pptx-check.mjs exports/<deck-id>.pptx --no-notes`.
5. Review the result against the theme and the packet. Tools often add slides,
   rewrite titles, or drop notes: compare slide count and titles to the
   storyboard and send corrections back to the tool, or edit the file.

When the tool's output must be rebuilt from scratch on every change, prefer an
engine the agent can drive (`pptxgenjs`, `claude-pptx`, `codex-slides`,
`google-slides`) for anything beyond the prototype.
