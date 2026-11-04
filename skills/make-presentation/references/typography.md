# Canonical typography

One type scale for every engine, written as a share of **slide height** so it
holds on any canvas. Adapters convert it to their own units; themes may choose
values inside each range but never go below a floor.

## Scale

| Role | Share of slide height | 1920×1080 px | 1280×720 px | 13.33×7.5 in (540 pt high) | 10×5.625 in (405 pt high) |
| --- | --- | --- | --- | --- | --- |
| Hero / display number | 10–18% | 108–194 px | 72–130 px | 54–97 pt | 40–73 pt |
| Section divider | 7–11% | 76–119 px | 50–79 px | 38–59 pt | 28–45 pt |
| Slide title (action title) | 4.5–7.5% | 49–81 px | 32–54 px | 24–40 pt | 18–30 pt |
| Body | 3.0–4.1% | 32–44 px | 22–30 px | 16–22 pt | 12–17 pt |
| **Body floor** | **2.6%** | **28 px** | **19 px** | **14 pt** | **10.5 pt** |
| Caption, label, source line | 2.0–2.6% | 22–28 px | 14–19 px | 11–14 pt | 8–10.5 pt |
| **Hard floor** | **2.0%** | **22 px** | **14 px** | **11 pt** | **8 pt** |

- Text under the body floor is allowed only for captions, axis labels, and
  source lines. Text under the hard floor is a defect.
- `scripts/pptx-check.mjs` enforces both floors on exported `.pptx` files
  (error below the hard floor, warning below the body floor).
- CJK text: use the upper half of the body range. CJK glyphs carry more detail
  per character and need the extra size at projector distance.
- Line length: at most about 60 Latin characters or 28 CJK characters per line
  of body text.
- Line height: 1.1–1.25 for titles, 1.3–1.5 for body.

## When a slide does not fit

Split the slide. Do not shrink type toward the floor to make room, and do not
hide overflow. If the content is reference material, move it to the speaker
notes or to the reading version of the deck (see `deck-types.md`).

## Reading version

A deck that will be sent and read without a presenter may use body text down
to the body floor and denser pages. It is still checked against the hard floor.
