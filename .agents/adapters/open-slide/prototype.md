# open-slide: prototype gate

Engine rules for the `deck-prototype` gate when the deck is built with open-slide. The pipeline skill (`presentation-prototype`) calls this; author to it.

## Prerequisites — read this first

This adapter assumes an open-slide workspace already exists and its dependencies are installed. If you have not scaffolded one yet, do so before authoring any slide — `slide-authoring` and the other authoring skills referenced below live **inside the scaffolded workspace**, not in this pipeline repo:

```bash
npx @open-slide/cli init <deck-name>      # creates the workspace
cd <deck-name>
pnpm install                              # or the package manager the scaffold uses
pnpm dev                                  # the live canvas you review against
```

open-slide needs **Node 18+** and a package manager (the scaffold defaults to pnpm). Without this scaffold, `slide-authoring`, `create-slide`, etc. will not be present and this gate cannot run.

Follow the workspace's `slide-authoring` skill for the full reference. The essentials below are the parts the prototype gate most often gets wrong.

## File contract

- One slide = one folder under `slides/<kebab-case-id>/`.
- Entry is `slides/<id>/index.tsx`. Images/videos/fonts go under `slides/<id>/assets/`.
- The slide is **one `index.tsx` plus `assets/` — nothing else**. No sibling `.tsx`/`.ts`, no `components/`, no helper files. Helper components and constants go inside `index.tsx`.
- Do not touch `package.json`, `open-slide.config.ts`, or other slides. Do not add dependencies — only `react` and standard web APIs.
- **Flexible Deck Length**: There is no hardcoded or arbitrary page count limit (such as 18 slides). The deck length scales naturally with presentation duration, instructional pacing, and audience interaction depth.

```tsx
import type { Page, SlideMeta } from '@open-slide/core';

const Cover: Page = () => <div>…</div>;
const Body: Page = () => <div>…</div>;

export const meta: SlideMeta = { title: 'My slide', createdAt: '2026-05-16T12:00:00Z' };
export default [Cover, Body] satisfies Page[];
```

- `export default` is a non-empty array of zero-prop React components, one per page, in order.
- Set `meta.createdAt` by running `node -e "console.log(new Date().toISOString())"` and pasting the exact output — never type a timestamp from memory.

## Canvas — 1920 × 1080

Every page renders into a fixed **1920 × 1080** canvas. The framework scales it; design as if the viewport is literally 1920×1080.

- Use **absolute pixel values** for `font-size`, padding, positioning. No `rem`, no `vw`/`vh`, no `%` for type.
- The root element of each page fills the canvas: `width: '100%'; height: '100%'`.
- Prefer inline `style={{ … }}`.

### Type scale

| Element          | Size       |
| ---------------- | ---------- |
| Hero title       | 140–200px  |
| Section heading  | 80–120px   |
| Page heading     | 56–80px    |
| Body text        | 32–44px    |
| Caption / label  | 22–28px    |

Body type below 28px is unreadable on a projector — treat it as a defect.

### Vertical budget — content MUST fit 1080px

The canvas does **not** scroll. Anything below 1080px is silently cropped. Before writing JSX, do the math and confirm the page fits.

- **Usable height** = `1080 − top_padding − bottom_padding`. With 120px each side: 840px. With 160px each side: 760px. Pick the padding first.
- **Element height** = `font_size × line_height × number_of_lines`. A bullet that wraps to 2 lines counts as 2 lines. Add the gap (32–64px) before summing the next element.
- One heading + body, OR one heading + ≤5 short bullets — not both.
- If you're raising padding, shrinking type below the scale's lower bound, or tightening line-height under 1.4 to fit — **split into two pages instead**. Splitting is always the right answer when the budget is tight.
- Never use `overflow: auto/scroll`, negative margins, or transforms to hide overflow.

## Anti-AI layout & aesthetic rules (learned from production)

### 1. Reject the 3-tier text wall
Never use the generic AI template: `H1 Dark Title` + `H2 Gray Subtitle` + `multiple paragraphs of tiny body text` or `Part 1 / Part 2 labels`. 
- Maximize Signal-to-Noise Ratio (SNR).
- One dominant message per slide.
- If an idea requires explanatory paragraphs, elevate the core takeaway to bold display type (36–48px+) and move the detailed narrative to the Speaker Notes.

### 2. Centered eyeline & visual balance (no bottom-heavy collapse)
- Do **not** shove all cards, key stats, or concluding punchlines down to the bottom border with dead space above.
- Distribute content across the natural optical center (y: 35%–65%).
- Cover/Title slides must boldly own the full canvas, not shrink into an awkward corner.

### 3. Icon and illustration standards (no cheap emoji / character boxes)
- **STRICTLY PROHIBITED**: OS emojis (🚀, 💡, 🔥, 📊, 👶) and generic single-character boxed glyphs (e.g. "寫", "參", "手") used as icons.
- Use clean, monochrome or duotone vector **Flat SVG Icons** (Heroicons / Lucide style) styled with explicit stroke, fill, and pixel dimensions.
- For hero slides, use full-bleed or card-integrated custom illustrations (e.g. generated via Gemini).

### 4. Integrated diagrams & metaphors
- When presenting visual metaphors (e.g. distress iceberg, funnel, pyramid, multi-layer framework), embed annotations and callout labels **directly inside the visual structure**. Avoid lazy 50/50 "text on left, image on right" splits.
- Maintain visual integrity: never crop critical visual landmarks (e.g. the tip of an iceberg or top header of a model).

### 5. Balanced multi-card geometry
- For 3 items: 3 equal vertical columns or 3 horizontal cards.
- For 4 items: 2×2 grid.
- For 5 items: **3-top, 2-bottom** (or 2-top, 3-bottom) centered grid. **NEVER** stack 5 narrow vertical stripes across the screen.

### 6. Instructional interaction slide layouts
Provide dedicated visual layouts for active learning and adult engagement:
- **Audience Polling / Temperature Checks**: 2–3 high-contrast cards with large numbers/options for immediate hand-raising.
- **Buzz-Pair Discussion Banners**: Prominent 30–60s peer discussion prompt containers.
- **Dialogue Flows & Step-by-Step Rehearsals**: Visual step progressions (01 $\to$ 02 $\to$ 03) with distinct speaker quotes.
- **Takeaway Scaffolding Cards**: Clean, high-impact checklist/pocket summary cards for post-lecture behavior transfer.

### 7. Language purity
- When a presentation is targeted for an international audience (e.g. English summit), enforce **100% target language consistency**. Zero secondary language / Chinese character remnants across slides, cards, badges, and chart labels.

## Repeated elements — component, not `map`

When a page has visually repeated items (cards, logo rows, tiles), define a small component and instantiate it once per item (`<Card />`, `<Card />`, `<Card />`). Do **not** render with `array.map` over a data array — a `map` body is one source location, so the inspector edits every instance at once.

## Image placeholders

When a page genuinely needs a real image the user must provide (a screenshot, a team photo, a chart from their data), leave a typed placeholder:

```tsx
import { ImagePlaceholder } from '@open-slide/core';
<ImagePlaceholder hint="Q3 revenue chart" width={1280} height={720} />
```

Do not use placeholders for decoration, stock-photo filler, or anywhere typography/layout would do — empty placeholders are friction; spend it only when the alternative is worse.

## Live review

Before calling the prototype gate passed, review the representative pages in the **live open-slide canvas** (the dev server) at full size — not just the source. Confirm type is projector-readable, nothing overflows 1080px, and the visual direction reads as one hand across every page.

### Headless review (no browser)

If you are a headless agent, the open-slide canvas is a browser surface, so capture screenshots programmatically: drive the running dev server (`pnpm dev`) with a headless browser (Playwright/Puppeteer), navigate to each slide route, and screenshot at 1920×1080. Open the PNGs with your vision capability and confirm nothing overflows 1080px and type is projector-readable. If you have no headless browser or no image tool, record that visual review was not performed and flag it for a human — do not claim the gate passed on an unverified prototype.
