# editorial-minimal

The default. A white page, confident type, one accent colour. It lets the
argument carry the deck.

```json theme
{
  "id": "editorial-minimal",
  "palette": {
    "background": "#FFFFFF",
    "text": "#111827",
    "muted": "#4B5563",
    "accent": "#1D4ED8",
    "alert": "#B91C1C",
    "rule": "#E5E7EB"
  },
  "bodyPairs": [["text", "background"], ["muted", "background"], ["accent", "background"], ["alert", "background"]],
  "largeOnlyPairs": []
}
```

## Type

- Fonts: one sans family for everything (Inter, Source Sans 3, or Noto Sans TC /
  Noto Sans SC for Chinese). Weight carries hierarchy: 700 titles, 400 body.
- Titles at the low end of the title range; body at 3.2–3.6%.

## Surfaces

- No card shadows. Group with whitespace first, a 1 px `rule` line second.
- Margins: 6–8% of slide height on every side.
- Charts: grey (`muted`) for context series, `accent` for the series the title
  talks about. One accent per slide.

## Anti-patterns

- Gradient backgrounds, drop shadows, stock-photo backdrops behind text.
- More than one accent colour on a slide.
- Centred body text.
