# Source derivation

This PptxGenJS-adapter example reuses the **content** of the sibling open-slide example ([`../agentic-coding-anatomy/`](../agentic-coding-anatomy)) — the same topic, audience, claims, and 5-slide structure — but renders it through the **PptxGenJS** engine. It is the third engine demo alongside open-slide (React canvas) and Marp (Markdown → image-backed PPTX), proving the adapter slot holds a third, structurally distinct engine.

## Input source

- Original raw notes: `../agentic-coding-anatomy/source/raw_notes.md`
- Reused storyboard: `../agentic-coding-anatomy/work/STORYBOARD.md`

## What changed for PptxGenJS

- Gate 6 (`deck-prototype`) produces `slides/build.mjs` (a Node script that calls the PptxGenJS API) instead of `index.tsx` (React) or `.md` (Marp).
- Gate 8 (`production-qa`) exports via `node build.mjs` → native-shape PPTX, then a PDF via `soffice --headless --convert-to pdf`.
- The PPTX is **native-shape** (real, editable PowerPoint text/objects via `<a:t>` runs) — the distinguishing property of this engine. Compare with Marp (image-backed pages) and open-slide (visual-faithful shapes from a canvas).
