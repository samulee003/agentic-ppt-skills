# Themes

A theme is a **rendering contract**: palette, type choices inside the canonical
scale (`../references/typography.md`), surfaces, and anti-patterns, written so
any engine can follow it. Record the chosen theme in `PRESENTATION-BRIEF.md`
under *Visual direction*.

| Theme | Feel | Good for |
| --- | --- | --- |
| [`editorial-minimal`](./editorial-minimal.md) | white page, strong type, one accent | default; decision decks, reports, most business talks |
| [`bright-sans`](./bright-sans.md) | Swiss grid, flush-left, big numerals | data stories, product and design reviews |
| [`aurora`](./aurora.md) | dark canvas, soft glass cards | keynotes, launches, evening events |
| [`sticker-pop`](./sticker-pop.md) | hand-drawn ink, hard shadows, tilted cards | training, workshops, community and education talks |

## Rules

- A brand template (`.potx`/`.pptx` master) overrides the theme's palette and
  fonts. Keep the theme's layout rules unless the brand guide forbids them.
- Vague adjectives ("clean", "warm", "modern") are not a visual direction.
  Bind them to a theme, or write a custom contract with the same fields.
- Every theme file has a `json theme` block. `scripts/theme-check.mjs` checks
  that body-text colour pairs reach WCAG AA (4.5:1) and that large-text-only
  pairs reach 3:1. Run it after editing or adding a theme.
- Sizes for borders, shadows, and spacing are given as a share of slide height
  so they convert to any engine (`0.28%` ≈ 3 px at 1080 px).

## Custom theme

Copy the closest theme file, rename it, change the values, and run
`node .agents/skills/make-presentation/scripts/theme-check.mjs <file>`.
