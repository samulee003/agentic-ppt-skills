// refusal-trust-workshop · claude-pptx engine · sticker-pop theme
// 10 × 5.625 in (405 pt high): titles 26 pt, body 15 pt (CJK upper half), captions 11 pt.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const NOTES = JSON.parse(readFileSync(path.join(here, 'notes.json'), 'utf8'));
const T = { bg: 'FFF8E7', ink: '1F1A17', muted: '5C534D', yellow: 'FFCF33', coral: 'FF6B6B', teal: '4ECDC4' };
const FONT = 'Noto Sans TC';
const M = 0.55;

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = '長者拒絕服務時，怎樣建立信任';

const text = (s, value, opts) =>
  s.addText(value, { fontFace: FONT, color: T.ink, margin: 0, isTextBox: true, valign: 'top', ...opts });
// sticker-pop card: 3 px ink border (0.28% of height ≈ 1.1 pt), hard 8 px shadow (≈ 3 pt), slight tilt
const card = (s, { x, y, w, h, fill = T.bg, rotate = 0 }) =>
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, rotate,
    fill: { color: fill },
    line: { color: T.ink, width: 1.25 },
    shadow: { type: 'outer', color: T.ink, opacity: 1, blur: 0, offset: 3, angle: 45 },
  });
const title = (s, value, opts = {}) =>
  text(s, value, { x: M, y: 0.35, w: 10 - 2 * M, h: 0.9, fontSize: 26, bold: true, valign: 'middle', ...opts });
const slide = (key) => {
  const s = pres.addSlide();
  s.background = { color: T.bg };
  s.addNotes(NOTES[key]);
  return s;
};
const LOGO = path.join(here, '..', '..', 'notes', 'centre-logo.png');
const logo = (s, x, y) => s.addImage({ path: LOGO, x, y, w: 1.3, h: 0.5, altText: '中心標誌' });

// 1 · hero
{
  const s = slide('1');
  text(s, '新同工培訓工作坊', { x: M, y: 1.2, w: 6, h: 0.4, fontSize: 15, bold: true, color: T.coral });
  text(s, '被長者拒絕，是建立信任的起點', { x: M, y: 1.7, w: 9, h: 1.0, fontSize: 36, bold: true });
  text(s, '45 分鐘 · 三個步驟 · 一張口袋卡', { x: M, y: 2.85, w: 8, h: 0.45, fontSize: 16, color: T.muted });
  card(s, { x: M, y: 3.6, w: 2.6, h: 0.08, fill: T.yellow });
  logo(s, 8.1, 4.75);
}

// 2 · data
{
  const s = slide('2');
  title(s, '去年三成新個案首次被拒，其中過半之後接受服務');
  card(s, { x: M, y: 1.55, w: 4.0, h: 2.6, fill: T.yellow, rotate: -1.5 });
  text(s, '38 / 120', { x: M + 0.3, y: 1.85, w: 3.4, h: 1.0, fontSize: 44, bold: true });
  text(s, '新個案首次家訪被拒', { x: M + 0.3, y: 2.95, w: 3.4, h: 0.45, fontSize: 15 });
  s.addShape(pres.shapes.LINE, { x: 4.75, y: 2.85, w: 0.6, h: 0, line: { color: T.ink, width: 2, endArrowType: 'triangle' } });
  card(s, { x: 5.5, y: 1.55, w: 3.95, h: 2.6, fill: T.teal, rotate: 1.5 });
  text(s, '21 / 38', { x: 5.8, y: 1.85, w: 3.4, h: 1.0, fontSize: 44, bold: true });
  text(s, '三個月內接受服務', { x: 5.8, y: 2.95, w: 3.4, h: 0.45, fontSize: 15 });
  text(s, '資料：中心 2025 年個案檢討（內部紀錄）', { x: M, y: 4.85, w: 8, h: 0.35, fontSize: 11, color: T.muted });
}

// 3 · interaction
{
  const s = slide('3');
  text(s, '你被長者拒絕過嗎？', { x: M, y: 1.0, w: 9, h: 0.9, fontSize: 36, bold: true, align: 'center' });
  [['有', T.coral, -1.5], ['未有', T.teal, 1.5]].forEach(([label, fill, rot], i) => {
    const x = 2.1 + i * 3.2;
    card(s, { x, y: 2.3, w: 2.6, h: 1.6, fill, rotate: rot });
    text(s, label, { x, y: 2.75, w: 2.6, h: 0.7, fontSize: 32, bold: true, align: 'center' });
  });
  text(s, '請舉手作答', { x: M, y: 4.5, w: 9, h: 0.4, fontSize: 15, align: 'center', color: T.muted });
}

// 4 · diagram
{
  const s = slide('4');
  title(s, '拒絕多數是在保護尊嚴，不是針對你');
  s.addShape(pres.shapes.OVAL, { x: 3.9, y: 2.2, w: 2.2, h: 1.4, fill: { color: T.coral }, line: { color: T.ink, width: 1.25 } });
  text(s, '「我唔使人幫」', { x: 3.9, y: 2.65, w: 2.2, h: 0.5, fontSize: 15, bold: true, align: 'center' });
  [['保護尊嚴', '不想被看成需要幫忙的人', M, 1.6], ['保護私隱', '不想陌生人進入家中', M, 3.35], ['不是針對你', '換了誰去，第一次都可能被拒', 6.75, 2.275]].forEach(
    ([head, sub, x, y], i) => {
      card(s, { x, y, w: 2.7, h: 1.25, fill: i === 2 ? T.yellow : T.bg, rotate: i === 1 ? 1.2 : -1.2 });
      text(s, head, { x: x + 0.2, y: y + 0.15, w: 2.3, h: 0.45, fontSize: 17, bold: true });
      text(s, sub, { x: x + 0.2, y: y + 0.62, w: 2.3, h: 0.55, fontSize: 12, color: T.muted });
    },
  );
  s.addShape(pres.shapes.LINE, { x: 3.25, y: 2.225, w: 0.8, h: 0.4, line: { color: T.ink, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { x: 3.25, y: 3.175, w: 0.8, h: 0.8, flipV: true, line: { color: T.ink, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { x: 6.1, y: 2.9, w: 0.65, h: 0, line: { color: T.ink, width: 1.5 } });
  text(s, '根據本中心前線經驗整理', { x: M, y: 4.95, w: 8, h: 0.35, fontSize: 11, color: T.muted });
}

// 5 · section
{
  const s = slide('5');
  text(s, '三步建立信任', { x: M, y: 1.3, w: 9, h: 1.0, fontSize: 40, bold: true, align: 'center' });
  [['1', '承認', T.coral], ['2', '小請求', T.yellow], ['3', '陪伴', T.teal]].forEach(([n, label, fill], i) => {
    const x = 1.45 + i * 2.6;
    card(s, { x, y: 2.75, w: 2.0, h: 1.5, fill, rotate: i === 1 ? 1.5 : -1.5 });
    text(s, n, { x, y: 2.85, w: 2.0, h: 0.6, fontSize: 28, bold: true, align: 'center' });
    text(s, label, { x, y: 3.5, w: 2.0, h: 0.5, fontSize: 18, bold: true, align: 'center' });
  });
}

// 6 · split: step 1
{
  const s = slide('6');
  title(s, '第一步：先承認對方的感受，不急著說服');
  card(s, { x: M, y: 1.6, w: 4.6, h: 2.0, fill: T.coral, rotate: -1.5 });
  text(s, '開場白', { x: M + 0.3, y: 1.8, w: 3.7, h: 0.35, fontSize: 12, bold: true });
  text(s, '「你唔想人哋入屋，好正常。」', { x: M + 0.25, y: 2.3, w: 4.15, h: 0.7, fontSize: 19, bold: true });
  text(
    s,
    [
      { text: '先說出對方的感受', options: { bullet: true, breakLine: true } },
      { text: '不要立即介紹服務', options: { bullet: true, breakLine: true } },
      { text: '承認不等於結案', options: { bullet: true } },
    ],
    { x: 5.6, y: 1.85, w: 3.8, h: 2.0, fontSize: 17, paraSpaceAfter: 12 },
  );
}

// 7 · hero: step 2
{
  const s = slide('7');
  title(s, '第二步：只提一個五分鐘的小請求');
  text(s, '五分鐘', { x: M, y: 1.55, w: 9, h: 1.3, fontSize: 66, bold: true, align: 'center', color: T.coral });
  card(s, { x: 1.9, y: 3.1, w: 6.2, h: 1.1, fill: T.yellow, rotate: 1 });
  text(s, '「我淨係想喺門口同你傾五分鐘。」', { x: 2.1, y: 3.38, w: 5.8, h: 0.6, fontSize: 20, bold: true, align: 'center' });
  text(s, '本中心經驗：請求越小，越容易開始', { x: M, y: 4.6, w: 9, h: 0.4, fontSize: 15, align: 'center', color: T.muted });
}

// 8 · split: step 3
{
  const s = slide('8');
  title(s, '第三步：定期陪伴，服務留待對方準備好');
  [['第 1 週', '再探訪一次'], ['第 2 週', '傾一傾近況'], ['第 4 週', '問：有咩幫到你？']].forEach(([week, act], i) => {
    const y = 1.55 + i * 1.05;
    card(s, { x: M, y, w: 4.4, h: 0.85, fill: i === 2 ? T.teal : T.bg, rotate: i === 1 ? 1 : -1 });
    text(s, week, { x: M + 0.25, y: y + 0.22, w: 1.2, h: 0.4, fontSize: 15, bold: true });
    text(s, act, { x: M + 1.5, y: y + 0.22, w: 2.8, h: 0.4, fontSize: 15 });
  });
  text(
    s,
    [
      { text: '每次只停留一會兒', options: { bullet: true, breakLine: true } },
      { text: '記住上次聊過的事', options: { bullet: true, breakLine: true } },
      { text: '對方準備好，才談服務', options: { bullet: true } },
    ],
    { x: 5.5, y: 1.75, w: 3.9, h: 2.2, fontSize: 16, paraSpaceAfter: 10 },
  );
}

// 9 · split: case
{
  const s = slide('9');
  title(s, '黃伯伯第三次才開門，因為每次都有人再來');
  [['第一次', '隔著鐵閘說「我唔使人幫」', T.bg], ['第二次', '願意在門口談五分鐘', T.yellow], ['第三次', '打開大門讓同工進屋', T.teal]].forEach(
    ([visit, what, fill], i) => {
      const x = M + i * 3.05;
      card(s, { x, y: 1.7, w: 2.75, h: 2.1, fill, rotate: i === 1 ? 1.5 : -1.2 });
      text(s, visit, { x: x + 0.2, y: 1.9, w: 2.35, h: 0.5, fontSize: 20, bold: true });
      text(s, what, { x: x + 0.2, y: 2.5, w: 2.35, h: 1.1, fontSize: 15 });
    },
  );
  text(s, '個案經化名處理', { x: M, y: 4.95, w: 8, h: 0.35, fontSize: 11, color: T.muted });
}

// 10 · interaction: role-play
{
  const s = slide('10');
  title(s, '角色扮演：兩人一組，十五分鐘完成三步');
  [['第一輪', '5 分鐘', 'A 扮長者，B 扮同工'], ['第二輪', '5 分鐘', '交換角色'], ['分享', '5 分鐘', '哪一步最難？']].forEach(([head, time, what], i) => {
    const x = M + i * 3.05;
    card(s, { x, y: 1.55, w: 2.75, h: 1.85, fill: [T.coral, T.yellow, T.teal][i], rotate: i === 1 ? 1.2 : -1.2 });
    text(s, head, { x: x + 0.2, y: 1.72, w: 2.35, h: 0.45, fontSize: 18, bold: true });
    text(s, time, { x: x + 0.2, y: 2.2, w: 2.35, h: 0.4, fontSize: 15, bold: true });
    text(s, what, { x: x + 0.2, y: 2.65, w: 2.35, h: 0.6, fontSize: 14 });
  });
  card(s, { x: 2.2, y: 3.85, w: 5.6, h: 0.85, fill: 'FFFFFF' });
  text(s, '變化卡：長者連五分鐘都不肯，你會怎樣做？', { x: 2.4, y: 4.07, w: 5.2, h: 0.45, fontSize: 15, bold: true, align: 'center' });
}

// 11 · cards: pocket card
{
  const s = slide('11');
  title(s, '把三句開場白帶回去，下次家訪就用');
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 1.45, w: 10 - 2 * M, h: 3.4, fill: { color: 'FFFFFF' }, line: { color: T.ink, width: 1.25, dashType: 'dash' } });
  [['承認', '「你唔想人哋入屋，好正常。」', T.coral], ['小請求', '「我淨係想喺門口同你傾五分鐘。」', T.yellow], ['陪伴', '「我下個禮拜再嚟探你，好唔好？」', T.teal]].forEach(
    ([step, line, fill], i) => {
      const y = 1.7 + i * 1.0;
      card(s, { x: M + 0.3, y, w: 1.6, h: 0.75, fill });
      text(s, step, { x: M + 0.3, y: y + 0.18, w: 1.6, h: 0.4, fontSize: 16, bold: true, align: 'center' });
      text(s, line, { x: M + 2.2, y: y + 0.18, w: 6.3, h: 0.45, fontSize: 17, bold: true });
    },
  );
  text(s, '沿虛線剪下，放進銀包', { x: M, y: 4.95, w: 8, h: 0.35, fontSize: 11, color: T.muted });
}

// 12 · hero: close
{
  const s = slide('12');
  card(s, { x: 1.1, y: 1.5, w: 7.8, h: 1.8, fill: T.yellow, rotate: -1 });
  text(s, '被拒絕不是失敗，放棄才是', { x: 1.3, y: 1.95, w: 7.4, h: 0.9, fontSize: 36, bold: true, align: 'center' });
  text(s, '多謝大家', { x: M, y: 3.75, w: 9, h: 0.5, fontSize: 18, align: 'center', color: T.muted });
  logo(s, 8.1, 4.75);
}

// B1 · backup data
{
  const s = slide('B1');
  title(s, '個案數字的定義與限制');
  text(
    s,
    [
      { text: '新個案：2025 年開立的全部個案（120 宗）', options: { bullet: true, breakLine: true } },
      { text: '首次被拒：第一次家訪未能入屋或交談（38 宗）', options: { bullet: true, breakLine: true } },
      { text: '接受服務：三個月內同意至少一項服務（21 宗）', options: { bullet: true, breakLine: true } },
      { text: '限制：單一中心、單一年份，不代表三步方法的成效', options: { bullet: true } },
    ],
    { x: M, y: 1.55, w: 8.9, h: 2.8, fontSize: 16, paraSpaceAfter: 12 },
  );
  text(s, '資料：中心 2025 年個案檢討（內部紀錄）', { x: M, y: 4.85, w: 8, h: 0.35, fontSize: 11, color: T.muted });
}

const outDir = process.env.DECK_OUT_DIR ?? fileURLToPath(new URL('../../exports/', import.meta.url));
await pres.writeFile({ fileName: path.join(outDir, 'refusal-trust-workshop.pptx') });
