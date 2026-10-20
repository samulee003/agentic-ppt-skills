# GenOffice: prototype gate

Engine rules for the `deck-prototype` gate when the deck is built with [GenOffice](https://github.com/genspark-ai/genoffice). The pipeline skill (`presentation-prototype`) calls this; author to it.

## Prerequisites — read this first

1. Resolve the `genoffice` CLI binary (`genoffice` on `PATH`, the directory in `~/.genoffice/launcher`, or `/Applications/GenOffice.app/Contents/Resources/cli/genoffice` on macOS). Verify it runs:
   ```bash
   genoffice --version
   genoffice capabilities --json
   ```
   `capabilities --json` reports (without a network call) whether web search, image search, image generation, and media analysis are configured in GenOffice. Only use `genoffice search --images` or `genoffice image` when configured; otherwise use local assets or typography, color blocks, and vector shapes.
2. Read GenOffice's live validator guides once per session so your JSON matches the exact schema the binary enforces:
   ```bash
   genoffice guide slides design
   genoffice guide slides spec
   ```
   (If using the `genoffice mcp` server instead of the shell, read resources `genoffice://guide/slides/design` and `genoffice://guide/slides/spec`, and use `deck_start` → `deck_page` → `deck_build` → `deck_replace`.)

## Staged file contract (`slides/<deck-id>/`)

Never hand-place raw EMU ops (`create --ops`) to author a presentation from scratch. Follow GenOffice's staged designed-deck pipeline so the CLI validates every stage before the next begins:

| Stage | File | Validation Command |
| --- | --- | --- |
| 1. Style sheet | `slides/<deck-id>/style.md` | Re-read before authoring each page (`slides check` validates page colors against this file) |
| 2. Outline | `slides/<deck-id>/outline.json` | `genoffice slides check slides/<deck-id>/outline.json --json` |
| 3. Page specs | `slides/<deck-id>/pages/01.json`, `02.json`, … | `genoffice slides check slides/<deck-id>/pages/NN.json --json` (one file at a time) |
| 4. Deck build | `exports/<deck-id>.pptx` | `genoffice create --type pptx --spec slides/<deck-id>/pages --outline slides/<deck-id>/outline.json --out exports/<deck-id>.pptx --force --json` |
| 5. Speaker notes | `slides/<deck-id>/notes-ops.json` | `genoffice slides apply exports/<deck-id>.pptx --ops slides/<deck-id>/notes-ops.json --json` |

### Stage 1: `style.md`

Write `slides/<deck-id>/style.md` before any outline or page spec:

- **Backgrounds**: main background and per-page-type backgrounds (`cover`, `content`, `data`, `closing`). Content pages share one background.
- **Colors**: main text, primary accent, secondary accent, card background, border as `#RRGGBB` hex values. Use **one accent system** across the whole deck (never more than two accents). `slides check` flags any off-palette color in `detail.style.offPalette` (white `#FFFFFF` and black `#000000` are always allowed).
- **Fonts**: title font, body font, title size range, body size range.
- **Layout library** (choose at least two variants per page type from GenOffice's validated vocabulary):
  - `cover`: `cover_typography_hero`, `cover_dark_minimal`, `cover_split_color`, `cover_full_image_overlay`, `cover_magazine`, `cover_split_image`
  - `content`: `left_text_right_image`, `three_column_cards`, `hero_big_number`, `two_column_comparison`, `timeline_horizontal`, `full_image_text_overlay`
  - `data`: `kpi_cards_row`, `chart_with_insight`, `two_by_two_grid`
  - `closing`: `closing_cta`, `closing_thank_you`
- **Overall style**: one sentence describing the visual DNA.

### Stage 2: `outline.json`

Write `slides/<deck-id>/outline.json` and validate it with `genoffice slides check slides/<deck-id>/outline.json --json`:

```json
{
  "topic": "Presentation topic",
  "core_hook": "One sentence with tension, a concrete number, or a counter-intuitive contrast",
  "pages": [
    {
      "title": "Cover headline",
      "type": "cover",
      "layout": "cover_typography_hero",
      "brief": "Main title, subtitle with context, presenter line; dark background from style.md.",
      "image_queries": []
    },
    {
      "title": "Three drivers of margin compression",
      "type": "content",
      "layout": "three_column_cards",
      "brief": "Three cards with real figures and sources from EVIDENCE-LEDGER.md.",
      "image_queries": []
    }
  ]
}
```

- **Rules enforced by `slides check`**:
  - `type` must be `cover`, `content`, `data`, or `closing`; first page should be `cover`, last page `closing`.
  - `layout` must belong to that `type` in the layout library.
  - Content/data pages must **not** repeat the same `layout` variant on consecutive pages, and body pages should use at least 3 distinct layout variants.
  - Zero placeholder copy (`XX%`, `lorem`, `TBD`).

### Stage 3: Canvas & Page Specs (`pages/NN.json`)

Write **one page file at a time** (`pages/01.json` corresponds to `outline.pages[0]`). Echo `title`, `type`, and `layout` at the top of the JSON object:

```json
{
  "title": "Three drivers of margin compression",
  "type": "content",
  "layout": "three_column_cards",
  "background": "#FAF6F0",
  "elements": [
    {
      "type": "shape",
      "shape": "roundRect",
      "x": 80,
      "y": 180,
      "w": 350,
      "h": 420,
      "fill": "#FFFFFF",
      "stroke": { "color": "#142E1B", "widthPt": 2 }
    },
    {
      "type": "text",
      "x": 80,
      "y": 56,
      "w": 1120,
      "h": 80,
      "valign": "top",
      "paragraphs": [
        {
          "align": "left",
          "lineSpacingPct": 110,
          "runs": [{ "text": "Three drivers of margin compression", "sizePt": 36, "bold": true, "color": "#142E1B" }]
        }
      ]
    }
  ]
}
```

#### Canvas geometry — 1280 × 720 px

- Fixed **1280 × 720 px** canvas (16:9), origin `(0, 0)` top-left, **integers only** for `x`, `y`, `w`, `h`.
- Elements paint in array order: background/card shapes first, images second, foreground text last.
- Up to 48 elements and 8 images per page.
- Allowed `shape` values: `rect`, `roundRect`, `ellipse`, `triangle`, `rightArrow`, `leftArrow`, `upArrow`, `downArrow`, `chevron`, `diamond`, `parallelogram`, `trapezoid`, `hexagon`, `pentagon`, `pie`, `donut`, `star5`, `heart`, `cloud`, `line`, `lineArrow`.

#### Text-box sizing math & type scale (pt)

Text boxes have zero inner padding. Count wrapped lines and size every box before running `slides check`:

- **Line height**: ~`sizePt × 1.8` px per line at `lineSpacingPct: 110`.
- **Character width**: CJK character ≈ `sizePt × 1.35` px; Latin character ≈ `sizePt × 0.7` px.
- **Box height**: `(wrapped_lines + 1 spare line) × (sizePt × 1.8)`. The builder grows undersized text boxes downward, which will collide with elements below if you under-budget height.
- **Minimum spacing**: ≥ 8 px between text and a card edge; ≥ 20 px between title and subtitle; ≥ 5 px between stacked text blocks.

| Element | Size (`sizePt`) |
| --- | --- |
| Hero number / stat | up to 80pt |
| Big / cover title | 32–48pt |
| Subtitle / card title | 18–24pt |
| Body copy | 12–15pt |

#### Validate each page immediately

Run after writing each `pages/NN.json`:

```bash
genoffice slides check slides/<deck-id>/pages/NN.json --json
```

Fix any issue until `detail.audit`, `detail.outline.findings`, and `detail.style.offPalette` are completely empty before moving to `NN+1.json`.

## Live & headless review

Assemble the prototype `.pptx`, render slide PNGs + a contact sheet, and run the geometry auditor:

```bash
genoffice create --type pptx --spec slides/<deck-id>/pages --outline slides/<deck-id>/outline.json --out exports/<deck-id>.pptx --force --json
genoffice render exports/<deck-id>.pptx --out slides/<deck-id>/shots --grid --scale 2 --json
genoffice slides audit exports/<deck-id>.pptx --json
```

Inspect `slides/<deck-id>/shots/<deck-id>-grid.png` and individual slide PNGs with your vision tool. Confirm `detail.issues` in `slides audit` is empty, no text overflows or collides, and visual weight sits comfortably across the 1280×720 canvas.
