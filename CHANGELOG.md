# Changelog

## 1.0.0

- From the first real run (WorkBuddy, a 16-slide training deck): the agent
  asked two questions and built, marked the rest `Decided` itself, never asked
  about design, and shipped 13 slides of coloured boxes with no imagery and no
  reason for the slide count. Now:
  - `GRILL-LOG.md` records every round with the user's verbatim reply, and
    `grill-check` fails a `Decided` row that no recorded round asked;
  - visual direction, must-avoid, and imagery are load-bearing product nodes,
    visual confirmation on real pages is load-bearing, and the story grill
    asks for the slide budget (`STORY.md` must state it);
  - `pptx-check` fails a deck where most slides are a row of boxes, warns
    when nothing is a picture, chart, or diagram, and flags the speaker's
    voice on slides; `plan-check` fails a deck with no pictures when the
    brief promised them and flags slides that repeat their notes;
  - QA may not wave warnings through as "expected by design" without the
    user's agreement.
- A simulated end-to-end run (`examples/simulated-training-zh-hant/`) found
  and fixed eight problems: a 5-round grill tree (now at most 3), rejected
  claims failing `ledger-check`, Cantonese dialogue vs the written-Chinese
  rule, fixed findings failing `interrogation-check`, promised inputs never
  re-checked (now `source-check --final` and placeholder detection), notes
  that cannot fill their slots (now timed by `storyboard-check`), an absolute
  `sourceRoot`, and no place for take-home handouts.
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
- One-command install (`npx --yes github:samulee003/agentic-ppt-skills`) and a
  Claude Code plugin marketplace.
