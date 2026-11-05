# Changelog

## 1.0.0

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
