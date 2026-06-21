# Source derivation

This Marp-adapter example reuses the **content** of the sibling open-slide example ([`../agentic-coding-anatomy/`](../agentic-coding-anatomy)) — the same topic, audience, claims, and 5-slide structure — but renders it through the **Marp** engine instead of open-slide. It exists to demonstrate that an identical pipeline run produces engine-specific artifacts at gates 6 and 8, while every upstream gate (1–5, 7) is identical regardless of engine.

## Input source

- Original raw notes: `../agentic-coding-anatomy/source/raw_notes.md`
- Reused storyboard: `../agentic-coding-anatomy/work/STORYBOARD.md`

## What changed for Marp

- Gate 6 (`deck-prototype`) produces `slides/agentic-coding-anatomy.md` (Markdown) instead of `index.tsx` (React).
- Gate 8 (`production-qa`) exports via the `marp` CLI command (`marp deck.md -o deck.pptx`) instead of the open-slide dev-server UI.
- The PPTX is **image-backed** (Marp renders each page to an image inside the slide) rather than open-slide's visual-faithful shape export — both are legitimate, different trade-offs.
