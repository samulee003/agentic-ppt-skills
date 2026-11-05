# Changelog

## 1.0.0

- Grilling at the core: a presentation grill tree (`grill-tree.md`) worked in
  frontier rounds at the brief, story, prototype, and stage gates;
  `grill-check.mjs` blocks a gate with unsettled nodes and blocks delivery
  while a load-bearing decision is only assumed. Profiles can add nodes.
- Interrogation (from pstack `interrogate`): adversaries per deck type attack
  the story and the talk; findings need a verbatim quote and a proof;
  `interrogation-check.mjs` re-verifies them.
- Every gate has a check: `source-check.mjs` (inventory paths exist),
  `ledger-check.mjs` (complete claim rows, no C/D claim in the main talk,
  numbers cite evidence, assets licensed), `plan-check.mjs` (the export
  matches the storyboard and speaker script), and `status.mjs` refuses to pass
  a gate whose artifacts do not exist.
- Post-talk retro (from pstack `reflect`) and `status.mjs brief` (from pstack
  `recall`).
- Eight engines: `open-slide`, `genoffice`, `marp`, `pptxgenjs`, `claude-pptx`,
  `codex-slides`, `google-slides`, and `handoff` (ChatGPT, Gamma, Canva,
  Copilot, Keynote, or a designer via `BUILD-PACKET.md`).
- Machine checks: `pptx-check.mjs` (slide/note/PDF parity, type floors, alt
  text, density, image-only slides), `storyboard-check.mjs` (action titles,
  archetypes, evidence IDs, timing), `theme-check.mjs` (WCAG contrast).
- Profiles (`default`, `training-zh-hant`), themes (`editorial-minimal`,
  `bright-sans`, `aurora`, `sticker-pop`), deck types, canonical typography,
  data-slide rules, and a revise-existing-deck path.
- Per-engine `export-deck.mjs` and `qa-deck.mjs`; fast-track gate pairing in
  `status.mjs`.
- One-command install (`npx github:samulee003/agentic-ppt-skills`) and a
  Claude Code plugin marketplace.
