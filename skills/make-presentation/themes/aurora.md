# aurora

Dark canvas, soft glass cards, cool glowing accents. For stage settings with
the room lights down.

```json theme
{
  "id": "aurora",
  "palette": {
    "background": "#0B1020",
    "surface": "#141A2E",
    "text": "#F8FAFC",
    "muted": "#CBD5E1",
    "accent": "#22D3EE",
    "accent2": "#A78BFA"
  },
  "bodyPairs": [["text", "background"], ["muted", "background"], ["muted", "surface"], ["text", "surface"], ["accent", "background"], ["accent2", "background"]],
  "largeOnlyPairs": []
}
```

## Type

- Fonts: a geometric sans (Manrope, Inter, Noto Sans TC/SC). Light text on dark
  needs one weight step heavier than on white: body 500.
- Body at the upper half of the range.

## Surfaces

- Cards: `surface` fill, 1 px border at 12% white, corner radius 1.5% of slide
  height. Engines without background blur use the flat `surface` fill.
- One soft radial glow per slide at most, behind the focal element, never
  behind body text.

## Anti-patterns

- Pure black `#000000` backgrounds or pure white body text on them.
- Neon glows on text.
- More than three cards per slide.
