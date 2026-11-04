# bright-sans

Swiss-style: a strict grid, flush-left type, very large numerals, and one loud
accent used sparingly.

```json theme
{
  "id": "bright-sans",
  "palette": {
    "background": "#F7F7F2",
    "text": "#0A0A0A",
    "muted": "#525252",
    "accent": "#FF3B00",
    "rule": "#0A0A0A"
  },
  "bodyPairs": [["text", "background"], ["muted", "background"]],
  "largeOnlyPairs": [["accent", "background"]]
}
```

## Type

- Fonts: a grotesque sans (Inter Tight, Helvetica Now, Noto Sans TC/SC).
  Titles 700, tight tracking; body 400.
- Hero numbers at 14–18% of slide height, flush-left on the grid.
- `accent` is for display text, numbers, and shapes only: it does not reach
  4.5:1 on the background, so never use it for body text.

## Surfaces

- 12-column grid; every element starts on a column line.
- Thick 0.4% `rule` bars as section markers instead of boxes.
- No rounded corners, no shadows.

## Anti-patterns

- Centred layouts, decorative icons, rounded cards.
- Accent colour on body text.
