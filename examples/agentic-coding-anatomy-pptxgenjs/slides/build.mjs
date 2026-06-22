import pptxgen from 'pptxgenjs';
import { mkdir } from 'node:fs/promises';

const DECK_ID = 'agentic-coding-anatomy';
const OUT_DIR = new URL('../exports/', import.meta.url);

const pres = new pptxgen();
pres.defineLayout({ name: 'WIDE', width: 10, height: 5.625 });
pres.layout = 'WIDE';
pres.author = 'agentic-ppt-skills pipeline';
pres.title = 'The Anatomy of Agentic Coding';

const bg = '0F172A';
const text = 'F8FAFC';
const accent = '38BDF8';
const muted = '94A3B8';
const fontHeading = 'Arial';
const fontBody = 'Arial';

function bullet(slide, items, opts = {}) {
  const { x = 0.8, y = 1.9, w = 8.4, h = 3.0 } = opts;
  slide.addText(
    items.map((it, i) => ({
      text: it,
      options: {
        fontSize: 20,
        color: text,
        fontFace: fontBody,
        bullet: { code: '2022', indent: 18 },
        breakLine: true,
        paraSpaceAfter: i === items.length - 1 ? 0 : 10,
      },
    })),
    { x, y, w, h, valign: 'top' },
  );
}

function heading(slide, title, kicker) {
  if (kicker) {
    slide.addText(kicker, {
      x: 0.8, y: 0.55, w: 8.4, h: 0.4,
      fontSize: 14, color: accent, fontFace: fontBody, bold: true,
      charSpacing: 2,
    });
  }
  slide.addText(title, {
    x: 0.8, y: 0.95, w: 8.4, h: 0.8,
    fontSize: 32, color: text, fontFace: fontHeading, bold: true,
  });
}

// Slide 1 — Cover
{
  const s = pres.addSlide();
  s.background = { color: bg };
  s.addText('The Anatomy of Agentic Coding', {
    x: 0.8, y: 1.9, w: 8.4, h: 1.4,
    fontSize: 44, color: text, fontFace: fontHeading, bold: true,
  });
  s.addText('How an agent structures its loop — and where the safety boundaries live.', {
    x: 0.8, y: 3.2, w: 8.4, h: 0.6,
    fontSize: 20, color: muted, fontFace: fontBody,
  });
  s.addNotes('Welcome. Five slides, five minutes. We will cover the loop, the tools, the one historical benchmark, and how human review matches risk.');
}

// Slide 2 — The Prompt Loop
{
  const s = pres.addSlide();
  s.background = { color: bg };
  heading(s, 'The Prompt Loop', 'THE LOOP');
  s.addText('Read \u2192 Plan \u2192 Write \u2192 Verify \u2014 then repeat using execution feedback.', {
    x: 0.8, y: 1.8, w: 8.4, h: 0.6,
    fontSize: 20, color: accent, fontFace: fontBody, bold: true,
  });
  bullet(s, [
    'Read: the agent loads repository context',
    'Plan: it chooses the next bounded action',
    'Write: it makes multi-file edits',
    'Verify: it runs checks and reads the result',
    'Each retry uses what the last attempt learned.',
  ]);
  s.addNotes('This is the core mental model. The loop is bounded, not autonomous \u2014 each turn is one action, verified, before the next.');
}

// Slide 3 — Tools
{
  const s = pres.addSlide();
  s.background = { color: bg };
  heading(s, 'Tools connect the model to the world', 'THE TOOLS');
  s.addText('Files \u00b7 commands \u00b7 search \u00b7 tests \u2014 the interface shown is illustrative.', {
    x: 0.8, y: 1.8, w: 8.4, h: 0.5,
    fontSize: 18, color: muted, fontFace: fontBody, italic: true,
  });
  bullet(s, [
    'A tool is a named, permissioned capability the model can call.',
    'The shown names (read / edit / run / search) are illustrative, not a specific product\u2019s API.',
    'What matters is the contract: input in, result back, model decides the next step.',
  ]);
  s.addNotes('Tool names here are placeholders. The point is the shape: the model never executes directly \u2014 it calls a tool that a runtime guards.');
}

// Slide 4 — The benchmark
{
  const s = pres.addSlide();
  s.background = { color: bg };
  heading(s, 'One historical benchmark \u2014 read carefully', 'THE NUMBER');
  s.addText('The 2023 Claude 2 + BM25 result on full SWE-bench is 1.96%.', {
    x: 0.8, y: 1.8, w: 8.4, h: 0.6,
    fontSize: 22, color: accent, fontFace: fontBody, bold: true,
  });
  bullet(s, [
    'Source: SWE-bench paper, arXiv:2310.06770v1, Table 5.',
    'Setup: Claude 2 with BM25 retrieval, full SWE-bench.',
    'What it IS: a historical baseline.',
    'What it is NOT: SWE-bench Lite, a current leaderboard figure, or a measure of iterative-loop uplift.',
  ]);
  s.addText('The loop can retry using feedback \u2014 that is qualitative, not a measured gain.', {
    x: 0.8, y: 4.6, w: 8.4, h: 0.5,
    fontSize: 16, color: muted, fontFace: fontBody, italic: true,
  });
  s.addNotes('claim-01 (the 1.96% figure) is safety level A: supportable as historical fact, but only with date, dataset, and retrieval caveats. Do not let it read as a performance promise.');
}

// Slide 5 — Human review
{
  const s = pres.addSlide();
  s.background = { color: bg };
  heading(s, 'Human review matches risk', 'THE BOUNDARY');
  s.addText('Autonomy needs boundaries \u2014 calibrated to consequence.', {
    x: 0.8, y: 1.8, w: 8.4, h: 0.6,
    fontSize: 20, color: accent, fontFace: fontBody, bold: true,
  });
  bullet(s, [
    'Match review to the action\u2019s consequence, reversibility, and scope.',
    'A risky, irreversible, broad action needs a human; a safe, reversible, narrow one may not.',
    'This is risk-based review, not \u201capprove everything\u201d or \u201capprove nothing.\u201d',
  ]);
  s.addNotes('The closing principle: the loop\u2019s safety is not a switch but a dial, turned per action.');
}

await mkdir(OUT_DIR, { recursive: true });
await pres.writeFile({ fileName: `${OUT_DIR.pathname}/${DECK_ID}.pptx` });
console.log(`wrote exports/${DECK_ID}.pptx`);
