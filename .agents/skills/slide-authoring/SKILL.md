---
name: slide-authoring
description: Technical reference for writing or editing open-slide pages — file contract, 1920×1080 canvas, type scale, CJK typography guards, diagram design (39 visual patterns), human-writing standards, layout, palette/visual direction, assets, stepped reveals, page transitions, and morph transitions. Consult this whenever you are about to write or modify any file under `slides/<id>/`, including from inside the `create-slide` or `apply-comments` workflows, or for any ad-hoc slide edit. Triggers on phrases like "edit slide", "tweak this page", "fix the layout", "change the palette", "reveal one by one", "add a transition", "morph transition", "investigate the slide framework", "how do slides work here".
---

# Authoring open-slide pages

This skill is the **technical reference** for everything that happens inside `slides/<id>/index.tsx`. It does not own a workflow:

- `create-slide` owns "draft a new deck" — it asks the user scoping questions, then delegates the *how* to this skill.
- `apply-comments` owns "process inspector markers" — it finds markers and applies edits, but the edits themselves follow the rules here.
- `current-slide` resolves deictic references ("this page", "the slide I'm on") to a concrete `slideId` + `pageIndex`. Consult it **first** when the user references the current slide without naming it, then come back here for how to edit it.
- `diagram-design` supplies 39 structured visual patterns (architecture, quadrant, flywheel, timeline, funnel, tree, etc.) — consult it whenever replacing bullet lists with structured visual graphics.
- `human-writing` supplies authentic, non-AI Chinese tone and material-first phrasing — consult it for slide copy, headlines, and presenter notes.
- Any ad-hoc slide edit (manual tweak, one-off fix) should also consult this skill before touching the file.

When any of those paths reach the point of *writing React code for a page*, this is the source of truth. Do not duplicate the knowledge below into other skills — link here instead.

## Runtime & Dependency Prerequisites

- The workspace MUST have `@open-slide/core` installed. If missing, install with `npm.cmd i @open-slide/core` (Windows) or `npm i @open-slide/core` (Unix).
- The official dev server runs with `npx.cmd open-slide dev` to provide in-browser **Inspect Mode (I)**, **Design System (D)**, **Notes**, and **Slide Drawer**.

## Hard rules

- Put the slide under `slides/<kebab-case-id>/`.
- Entry is `slides/<id>/index.tsx`. Images/videos/fonts go under `slides/<id>/assets/`.
- Import assets directly using ESM syntax: `import myImg from './assets/image.jpg';` and `<img src={myImg} />`.
- A slide is **one `index.tsx` plus `assets/`** — helper components and constants go inside `index.tsx`.
- **Zero Floating Card Artifacts**: Strictly forbid wrapping regular text in isolated floating rounded card boxes. Use editorial column typography, vertical hairline dividers, and full-bleed visual splits.
- **Visual Styles Hierarchy (Wang Yong-Fu Teaching Craft)**:
  1. **【大字流】(Big Typography)**: Hero statements (80-104px), high contrast, minimal noise.
  2. **【半圖流】(Half-Visual Split)**: 40/60 or 50/50 split with High-End **Flat Vector Concept Icons** for mechanisms/comparisons or documentary photos for scenarios.
  3. **【全圖流】(Hero Visual)**: Full-bleed **Cinematic 35mm Photography** (Portra 400, 3500K golden hour) with dark high-contrast gradient text overlays.

## File contract

```tsx
// slides/<id>/index.tsx
import type { Page, SlideMeta, DesignSystem } from '@open-slide/core';
import coverVector from './assets/cover_vector.jpg';

export const design: DesignSystem = {
  palette: { bg: '#faf7f2', text: '#111827', accent: '#b45309' },
  fonts: {
    display: '"Noto Serif CJK SC", "Songti SC", Georgia, serif',
    body: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans CJK SC", sans-serif',
  },
  typeScale: { hero: 104, body: 28 },
  radius: 16,
};

const Cover: Page = () => (
  <div style={{ width: 1920, height: 1080, background: '#faf7f2', padding: '64px 120px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center' }}>
    <div>
      <h1 style={{ fontSize: 96, fontWeight: 900, color: '#111827' }}>三代共贏的教養智慧</h1>
    </div>
    <div>
      <img src={coverVector} style={{ width: '100%', maxHeight: 600, objectFit: 'contain' }} />
    </div>
  </div>
);

export const meta: SlideMeta = {
  title: '三代共贏的教養智慧',
  createdAt: '2026-08-24T12:00:00Z',
};

export default [Cover] satisfies Page[];
```
