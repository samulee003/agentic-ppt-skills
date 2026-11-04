# sticker-pop

Hand-drawn ink on cream paper: thick outlines, hard offset shadows, slightly
tilted cards, flat SVG illustrations. Warm and physical. Works well for
training, workshops, and community or education talks.

```json theme
{
  "id": "sticker-pop",
  "palette": {
    "background": "#FFF8E7",
    "ink": "#1F1A17",
    "muted": "#5C534D",
    "yellow": "#FFCF33",
    "coral": "#FF6B6B",
    "teal": "#4ECDC4"
  },
  "bodyPairs": [["ink", "background"], ["muted", "background"], ["ink", "yellow"], ["ink", "coral"], ["ink", "teal"]],
  "largeOnlyPairs": []
}
```

## Type

- Fonts: a rounded or friendly sans for titles (Nunito, M PLUS Rounded 1c,
  jf open 粉圓), a plain sans for body (Noto Sans TC/SC).
- Hero titles at the top of the hero range; card titles at the top of the title
  range.

## Surfaces

| Element | Rule | At 1080 px |
| --- | --- | --- |
| Card border | solid `ink`, 0.28% of slide height | 3 px |
| Card shadow | hard offset, no blur, `ink`, 0.74% right and down | 8 px 8 px 0 |
| Card tilt | −1.5° to +1.5°, alternate direction between neighbours | — |
| Illustration stroke | `ink`, 0.28% of slide height, round caps | 3 px |
| Card fill | `background`, `yellow`, `coral`, or `teal` | — |

- PptxGenJS and GenOffice: use an outer shadow with blur 0 and a shape
  rotation; both are supported natively.
- Marp: set the border, `box-shadow`, and `transform: rotate()` in the theme CSS.

## Anti-patterns

- 1 px faint grey borders and diffuse soft shadows (they read as a web
  dashboard, not paper).
- OS emoji instead of drawn icons.
- Tilting body-text blocks or charts; tilt cards only.
