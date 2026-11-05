// Showcase deck for the claude-pptx engine: the agentic-coding-anatomy
// storyboard rendered in the editorial-minimal theme. Run with
//   node slides/build.mjs            (from examples/agentic-coding-anatomy-claude-pptx)
// or through export-deck.mjs, which passes DECK_OUT_DIR.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';

const DECK_ID = 'agentic-coding-anatomy';
const T = { bg: 'FFFFFF', text: '111827', muted: '4B5563', accent: '1D4ED8', rule: 'E5E7EB', soft: 'EFF4FF' };
const FONT = 'Inter';
const M = 0.6; // margin (in), ~10.7% of height

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 × 5.625 in → 405 pt high
pres.title = 'The Anatomy of Agentic Coding';

const text = (slide, value, opts) =>
  slide.addText(value, { fontFace: FONT, color: T.text, margin: 0, isTextBox: true, valign: 'top', ...opts });
const title = (slide, value) => {
  text(slide, value, { x: M, y: 0.45, w: 10 - 2 * M, h: 0.9, fontSize: 24, bold: true, valign: 'middle' });
  slide.addShape(pres.shapes.LINE, { x: M, y: 1.45, w: 10 - 2 * M, h: 0, line: { color: T.rule, width: 1 } });
};
const source = (slide, value) =>
  text(slide, value, { x: M, y: 5.05, w: 10 - 2 * M, h: 0.3, fontSize: 11, color: T.muted });

// 1 · hero
{
  const s = pres.addSlide();
  s.background = { color: T.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 1.3, w: 0.08, h: 2.75, fill: { color: T.accent }, line: { color: T.accent } });
  text(s, 'AGENTIC CODING', { x: M + 0.3, y: 1.25, w: 8, h: 0.35, fontSize: 12, bold: true, color: T.accent, charSpacing: 2 });
  text(s, 'Agentic coding is a loop, not a single answer', { x: M + 0.3, y: 1.65, w: 8.2, h: 1.5, fontSize: 40, bold: true });
  text(s, 'How coding agents read, plan, write, and verify their own work', { x: M + 0.3, y: 3.55, w: 8, h: 0.45, fontSize: 16, color: T.muted });
  s.addNotes('Hello everyone. This talk looks at agentic coding as a workflow, not as a vendor product. The important shift is from generating code once to acting, observing, and revising.');
}

// 2 · diagram
{
  const s = pres.addSlide();
  title(s, 'The agent reads, plans, writes, and verifies in a repeating loop');
  const steps = [
    ['Read', 'request, repo, and test output'],
    ['Plan', 'one focused change'],
    ['Write', 'edit files with its tools'],
    ['Verify', 'run tests and checks'],
  ];
  const w = 1.85, gap = 0.37, y = 2.05, h = 1.6;
  steps.forEach(([name, desc], i) => {
    const x = M + i * (w + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: i === 3 ? T.soft : T.bg }, line: { color: i === 3 ? T.accent : T.rule, width: 1.5 } });
    text(s, `0${i + 1}`, { x: x + 0.2, y: y + 0.18, w: 1, h: 0.3, fontSize: 12, bold: true, color: T.accent });
    text(s, name, { x: x + 0.2, y: y + 0.45, w: w - 0.4, h: 0.4, fontSize: 20, bold: true });
    text(s, desc, { x: x + 0.2, y: y + 0.88, w: w - 0.35, h: 0.62, fontSize: 12, color: T.muted });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: x + w + 0.05, y: y + h / 2, w: gap - 0.1, h: 0, line: { color: T.muted, width: 1.5, endArrowType: 'triangle' } });
  });
  // return path: Verify → Read
  const left = M + w / 2, right = M + 3 * (w + gap) + w / 2, low = y + h + 0.45;
  s.addShape(pres.shapes.LINE, { x: right, y: y + h, w: 0, h: 0.45, line: { color: T.accent, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { x: left, y: low, w: right - left, h: 0, line: { color: T.accent, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { x: left, y: y + h, w: 0, h: 0.45, flipV: true, line: { color: T.accent, width: 1.5, endArrowType: 'triangle' } });
  text(s, 'failing checks send it back to Read', { x: left + 2.2, y: low + 0.08, w: 3.6, h: 0.3, fontSize: 12, color: T.accent, align: 'center' });
  s.addNotes('The core loop is Read, Plan, Write, Verify. The agent reads the request and repository, chooses a focused change, applies it, and checks the result. Verification is part of the loop, not an optional final step.');
}

// 3 · split
{
  const s = pres.addSlide();
  title(s, 'Tools connect the model to files, commands, search, and tests');
  const tools = [['read_file', 'see the code'], ['grep_search', 'find what matters'], ['write_file', 'change it'], ['run_command', 'build and test']];
  tools.forEach(([name, job], i) => {
    const y = 1.8 + i * 0.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 4.3, h: 0.6, rectRadius: 0.06, fill: { color: i % 2 ? T.bg : T.soft }, line: { color: T.rule, width: 1 } });
    text(s, name, { x: M + 0.25, y: y + 0.15, w: 2, h: 0.3, fontSize: 14, bold: true, fontFace: 'JetBrains Mono', color: T.accent });
    text(s, job, { x: M + 2.35, y: y + 0.16, w: 1.85, h: 0.3, fontSize: 13, color: T.muted });
  });
  text(s, 'Without tools, a model can only suggest code. With them, it can check whether the change works.', { x: 5.45, y: 1.85, w: 3.95, h: 1.4, fontSize: 18, bold: true });
  text(s, 'Tool names are illustrative. Real agents expose different interfaces, permissions, and sandboxes.', { x: 5.45, y: 3.35, w: 3.95, h: 0.9, fontSize: 13, color: T.muted });
  s.addNotes('These tool names are illustrative. Real agents expose different interfaces, permissions, and sandboxes. The general role is the same: connect the model to files, commands, search, and test output.');
}

// 4 · data (hero number with its context)
{
  const s = pres.addSlide();
  title(s, 'Feedback lets each retry build on the last, beyond a 1.96% baseline');
  text(s, '1.96%', { x: M, y: 1.75, w: 4.2, h: 1.3, fontSize: 72, bold: true, color: T.accent });
  text(s, 'of 2,294 SWE-bench tasks solved by Claude 2 with BM25 retrieval (2023)', { x: M, y: 3.1, w: 4.1, h: 1.0, fontSize: 14, color: T.muted });
  s.addShape(pres.shapes.LINE, { x: 5.1, y: 1.85, w: 0, h: 2.4, line: { color: T.rule, width: 1 } });
  text(s, 'What changes with a loop', { x: 5.45, y: 1.8, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: T.accent });
  text(s, [
    { text: 'It sees the test output from its last try', options: { bullet: true, breakLine: true } },
    { text: 'It edits again with that evidence', options: { bullet: true, breakLine: true } },
    { text: 'Gains vary by model, tools, and task', options: { bullet: true } },
  ], { x: 5.45, y: 2.3, w: 3.95, h: 2.0, fontSize: 14, paraSpaceAfter: 8 });
  source(s, 'Source: Jimenez et al., SWE-bench, arXiv:2310.06770v1, Table 5 (2023)');
  s.addNotes('In the original 2023 SWE-bench paper, Claude 2 resolved 1.96 percent of the full 2,294-task benchmark with BM25 retrieval. That is a historical baseline, not a current leaderboard result. An iterative loop can use execution feedback to shape the next attempt, but this slide does not claim a universal numerical uplift.');
}

// 5 · cards
{
  const s = pres.addSlide();
  title(s, "Human review should match each action's consequence, reversibility, and scope");
  const cards = [
    ['Routine and reversible', 'Let the agent run', 'Edits in a branch, tests, local builds'],
    ['Consequential', 'Add a checkpoint', 'Schema changes, dependency upgrades'],
    ['Irreversible or out of scope', 'Require approval', 'Deploys, deletes, anything outside the task'],
  ];
  const w = 2.75, gap = 0.27;
  cards.forEach(([risk, rule, example], i) => {
    const x = M + i * (w + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.85, w, h: 0.07, fill: { color: T.accent }, line: { color: T.accent } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.92, w, h: 2.55, fill: { color: i === 2 ? T.soft : T.bg }, line: { color: T.rule, width: 1 } });
    text(s, risk, { x: x + 0.25, y: 2.1, w: w - 0.5, h: 0.5, fontSize: 13, bold: true, color: T.muted });
    text(s, rule, { x: x + 0.25, y: 2.65, w: w - 0.5, h: 0.85, fontSize: 20, bold: true });
    text(s, example, { x: x + 0.25, y: 3.6, w: w - 0.5, h: 0.7, fontSize: 13, color: T.muted });
  });
  s.addNotes('Safety should follow the risk of the action. Consequential, irreversible, or out-of-scope actions should trigger human review. Routine, reversible work can stay autonomous when permissions and rollback are clear.');
}

const outDir = process.env.DECK_OUT_DIR ?? fileURLToPath(new URL('../exports/', import.meta.url));
await pres.writeFile({ fileName: path.join(outDir, `${DECK_ID}.pptx`) });
