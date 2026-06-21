# PptxGenJS: prototype gate

Engine rules for the `deck-prototype` gate when the deck is built with PptxGenJS. The pipeline skill (`presentation-prototype`) calls this; author to it.

## Prerequisites — read this first

PptxGenJS is an npm library. Set up a minimal Node project for the deck before authoring:

```bash
mkdir -p slides/<deck-id> && cd slides/<deck-id>
npm init -y
npm install pptxgenjs
```

**Node 18+** required. There is no dev server and no browser — the deck is a script that writes a PPTX file.

## File contract

- One deck = one Node script: `slides/<deck-id>/build.mjs`.
- The script imports PptxGenJS, configures the 16:9 layout, adds slides, and writes the file. Nothing else lives in the folder except `package.json` and `node_modules`.

```javascript
import pptxgen from 'pptxgenjs';

const pres = new pptxgen();
pres.defineLayout({ name: 'WIDE', width: 10, height: 5.625 });
pres.layout = 'WIDE';                          // 16:9, in inches

const slide = pres.addSlide();
slide.background = { color: '0F172A' };
slide.addText('The Big Idea', {
  x: 0.6, y: 2.0, w: 8.8, h: 1.2,
  fontSize: 54, color: 'F8FAFC', bold: true, fontFace: 'Arial',
});
slide.addNotes('Speaker notes for this slide.');

await pres.writeFile({ fileName: '../../exports/<deck-id>.pptx' });
```

- One `addSlide()` call per page, in order.
- Attach speaker notes with `slide.addNotes(...)`.
- Keep the whole deck in this one script; do not split into multiple build files.

## Canvas — 10 × 5.625 inches (16:9)

PptxGenJS uses **inches** for layout (`x`, `y`, `w`, `h`), on a 10×5.625 inch page for 16:9. Design as if the page is that size; PowerPoint scales it on display.

- Use a consistent content margin: ~0.6in from each edge (usable area ~8.8in × 4.4in).
- Position every text box explicitly with `x/y/w/h`. Do not rely on auto-layout.
- One idea per slide: a heading text box plus a short list or a single paragraph. Not a wall of body copy.

### Projector-safe type sizes (points)

| Element          | Size       |
| ---------------- | ---------- |
| Hero title       | 44–60pt    |
| Section heading  | 32–40pt    |
| Page heading     | 24–32pt    |
| Body text        | 18–24pt    |
| Caption / label  | 12–16pt    |

Body type below 14pt is unreadable on a projector — treat it as a defect.

## Visual direction

Define the palette once at the top of the script (`bg`, `text`, `accent`, `muted`) and reuse the same `color`/`fontFace` values on every slide. One display font + one body font, committed across the deck. PowerPoint-safe fonts (Arial, Calibri, Georgia) render identically on any machine — prefer those unless the user supplies a font file.

## Live review

Before calling the prototype gate passed, run the script and inspect the output at full size:

```bash
node slides/<deck-id>/build.mjs        # writes exports/<deck-id>.pptx
```

Open the produced `.pptx` (have the user open it, or use a headless preview if available). Confirm type is projector-readable, nothing overflows its text box (PptxGenJS clips or shrinks-to-fit depending on options — verify the intended behaviour), and the visual direction reads as one hand across every page.
