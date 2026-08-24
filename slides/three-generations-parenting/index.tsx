import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';

import coverFlat from './assets/cover_flat.jpg';
import slide02Flat from './assets/slide02_flat.jpg';
import slide03Flat from './assets/slide03_flat.jpg';
import slide04Flat from './assets/slide04_flat.jpg';
import slide06Flat from './assets/slide06_flat.jpg';
import slide10Photo from './assets/slide10_photo.jpg';
import slide13Photo from './assets/slide13_photo.jpg';
import slide18Photo from './assets/three_gen_park_triumph.jpg';

export const design: DesignSystem = {
  palette: {
    bg: '#faf7f2',
    text: '#111827',
    accent: '#b45309',
  },
  fonts: {
    display: '"Noto Serif CJK SC", "Songti SC", "Source Han Serif SC", "Times New Roman", Georgia, serif',
    body: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif',
  },
  typeScale: {
    hero: 104,
    body: 28,
  },
  radius: 16,
};

export const transition: SlideTransition = {
  duration: 160,
  enter: {
    duration: 160,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    keyframes: [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
  },
  exit: {
    duration: 100,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
  },
};

const palette = {
  bg: '#faf7f2',
  bgDark: '#0b1329',
  surface: '#ffffff',
  text: '#111827',
  textSub: '#374151',
  textLight: '#f8fafc',
  muted: '#6b7280',
  faint: '#9ca3af',
  rule: '#111827',
  ruleLight: '#e5e7eb',
  accent: '#b45309',
  brandBlue: '#0284c7',
  green: '#047857',
  rose: '#be123c',
  roseLight: 'rgba(190, 18, 60, 0.08)',
  greenLight: 'rgba(4, 120, 87, 0.08)',
};

const fonts = {
  serif: '"Noto Serif CJK SC", "Songti SC", "Source Han Serif SC", "Times New Roman", Georgia, serif',
  sans: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", "Menlo", monospace',
};

const PAD_X = 120;
const PAD_Y = 64;

const CanvasDecor = () => (
  <>
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.2, mixBlendMode: 'multiply', zIndex: 0 }}>
      <filter id="pGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.42 0 0 0 0 0.35 0 0 0 0.1 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#pGrain)" />
    </svg>
  </>
);

const fill = {
  width: 1920,
  height: 1080,
  fontFamily: fonts.sans,
  color: palette.text,
  background: palette.bg,
  position: 'relative' as const,
  overflow: 'hidden' as const,
  boxSizing: 'border-box' as const,
};

const Header = ({ eyebrow, title, highlight }: { eyebrow: string; title: string; highlight?: string }) => (
  <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
    <div style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: palette.accent, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.accent }} />
      <span>{eyebrow}</span>
    </div>
    <h2 style={{ fontFamily: fonts.serif, fontSize: 52, fontWeight: 900, lineHeight: 1.15, margin: 0, color: palette.text, letterSpacing: '-0.01em' }}>
      {title}
      {highlight && <span style={{ color: palette.accent }}>{highlight}</span>}
    </h2>
  </div>
);

const Footer = ({ section, pageNumber, dark = false }: { section: string; pageNumber: string; dark?: boolean }) => (
  <div
    style={{
      position: 'absolute',
      left: PAD_X,
      right: PAD_X,
      bottom: 28,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: fonts.sans,
      fontSize: 15,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.4)' : palette.faint,
      borderTop: `1px dashed ${dark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}`,
      paddingTop: 14,
      zIndex: 2,
    }}
  >
    <span>三代共贏的教養智慧 · {section}</span>
    <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>{pageNumber} / 18</span>
  </div>
);

// Slide 01: 封面
const Page01: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center' }}>
    <CanvasDecor />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ fontFamily: fonts.sans, fontSize: 18, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: palette.accent, marginBottom: 24 }}>
        • 家庭親職專題講座 · 90 分鐘
      </div>
      <h1 style={{ fontFamily: fonts.serif, fontSize: 96, fontWeight: 900, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', color: palette.text }}>
        三代共贏的<br />
        <span style={{ color: palette.accent }}>教養智慧</span>
      </h1>
      <div style={{ height: 3, width: 440, background: palette.accent, margin: '32px 0' }} />
      <p style={{ fontFamily: fonts.serif, fontSize: 32, lineHeight: 1.6, color: palette.textSub, margin: '0 0 32px', maxWidth: 840 }}>
        化解隔代觀念差異，建立一致教養原則，為孩子營造穩定的成長環境
      </p>
      <div style={{ fontSize: 17, color: palette.muted, letterSpacing: '0.15em', fontWeight: 600 }}>
        雙職父母與托育長輩 · 雙向理解 · 責任同盟
      </div>
    </div>
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={coverFlat}
        alt="Three Generations Flat Vector"
        style={{ width: '100%', maxHeight: 620, objectFit: 'contain', borderRadius: 20, boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}
      />
    </div>
    <Footer section="No. 01 · 封面主題" pageNumber="01" />
  </div>
);

// Slide 02: 托育現況
const Page02: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第一幕 · 看見現實與兩難" title="隔代托育：不可或缺的" highlight="家庭支柱與必然分歧" />
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
        <img
          src={slide02Flat}
          alt="Macau Grandparent Flat Vector"
          style={{ width: '100%', height: 600, objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '32px 28px 24px', color: '#ffffff' }}>
          <div style={{ fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>MACAU DUAL-SHIFT REALITY</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>長輩全天候接送與照顧，是家庭正常運轉的底氣</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, paddingLeft: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontSize: 110, fontWeight: 900, fontFamily: fonts.serif, color: palette.brandBlue, lineHeight: 1 }}>60%+</span>
            <span style={{ fontSize: 30, fontWeight: 900, color: palette.text }}>雙職家庭深度依賴隔代托育</span>
          </div>
          <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: '14px 0 0' }}>
            在輪班節奏與緊湊工作下，長輩默默承擔了最繁重的日常照料與接送重擔。
          </p>
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: fonts.serif, fontSize: 44, fontWeight: 900, color: palette.rose, lineHeight: 1 }}>80%</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>家庭曾因生活習慣與規則產生摩擦</span>
          </div>
          <p style={{ fontSize: 20, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
            出發點都是愛：缺乏清晰責任邊界導致兩代心力交瘁。問題不在於「誰對誰錯」，而在於溝通機制。
          </p>
        </div>
      </div>
    </div>
    <Footer section="第一幕 · 托育現況" pageNumber="02" />
  </div>
);

// Slide 03: 兩代心聲
const Page03: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第一幕 · 看見現實與兩難" title="兩代心聲對照：" highlight="付出背後的委屈與焦慮" />
    <div style={{ display: 'grid', gridTemplateColumns: '36% 64%', gap: 50, alignItems: 'center', position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #e5e7eb', paddingRight: 40 }}>
        <img
          src={slide03Flat}
          alt="Balance Scale Flat Vector"
          style={{ width: '100%', maxHeight: 440, objectFit: 'contain' }}
        />
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 18, color: palette.accent, fontWeight: 800 }}>
          ⚖️ 尋求理解的平衡：看見各自的付出與難處
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: palette.accent }}>長輩的心聲</div>
          <div style={{ fontFamily: fonts.serif, fontSize: 24, fontWeight: 800, color: palette.text, lineHeight: 1.4 }}>
            「辛苦帶了一整天孫子，最怕年輕人下班一進門就挑毛病。」
          </div>
          <div style={{ fontSize: 18, color: palette.textSub, lineHeight: 1.7 }}>
            • <strong>心疼與妥協</strong>：看孩子哭鬧太心疼，給點零食看會兒電視，只是想讓他開心。<br />
            • <strong>尊嚴與恐懼</strong>：害怕被子女嫌棄落伍、否定價值。
          </div>
          <div style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 12, fontSize: 16, color: palette.accent, fontWeight: 800 }}>
            💡 渴望：辛苦被看見與尊重。
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: palette.brandBlue }}>年輕父母的心聲</div>
          <div style={{ fontFamily: fonts.serif, fontSize: 24, fontWeight: 800, color: palette.text, lineHeight: 1.4 }}>
            「我們辛苦立的規矩，長輩一插手就破功，孩子越來越難管。」
          </div>
          <div style={{ fontSize: 18, color: palette.textSub, lineHeight: 1.7 }}>
            • <strong>競爭獨立焦慮</strong>：學校考察自理和專注力，長輩樣樣包辦讓人焦慮。<br />
            • <strong>感恩與無奈夾雜</strong>：深知長輩辛苦，不知如何開口而不傷和氣。
          </div>
          <div style={{ borderTop: `2px solid ${palette.brandBlue}`, paddingTop: 12, fontSize: 16, color: palette.brandBlue, fontWeight: 800 }}>
            💡 渴望：規則被維護、一致管教。
          </div>
        </div>
      </div>
    </div>
    <Footer section="第一幕 · 兩代心聲" pageNumber="03" />
  </div>
);

// Slide 04: 四大摩擦
const Page04: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第二幕 · 直面衝突與行為真相" title="直面問題：" highlight="最普遍的 4 大日常摩擦點" />
    <div style={{ margin: '0 0 24px', display: 'flex', justifyContent: 'center' }}>
      <img
        src={slide04Flat}
        alt="Four Friction Flat Icons"
        style={{ width: '80%', height: 130, objectFit: 'contain' }}
      />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36, position: 'relative', zIndex: 1 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>01 飲食習慣</div>
        <p style={{ fontSize: 18, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
          長輩怕孩子餓著追著餵飯、飯前給零食；父母強調自主進食與定時定量。
        </p>
        <div style={{ fontSize: 15, fontWeight: 800, color: palette.rose, borderTop: `2px solid ${palette.rose}`, paddingTop: 10 }}>
          自主進食 vs 過度餵養
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>02 3C 屏幕</div>
        <p style={{ fontSize: 18, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
          長輩做家務或孩子哭鬧時塞手機平息；父母擔憂專注力與大腦發育。
        </p>
        <div style={{ fontSize: 15, fontWeight: 800, color: palette.rose, borderTop: `2px solid ${palette.rose}`, paddingTop: 10 }}>
          臨時滅火 vs 專注力損傷
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>03 生活自理</div>
        <p style={{ fontSize: 18, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
          長輩替孩子穿鞋穿襪、收拾書包玩具；父母希望從小培養自律獨立。
        </p>
        <div style={{ fontSize: 15, fontWeight: 800, color: palette.rose, borderTop: `2px solid ${palette.rose}`, paddingTop: 10 }}>
          省心包辦 vs 獨立鍛鍊
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>04 袒護規則</div>
        <p style={{ fontSize: 18, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
          立規矩時長輩當面求情或唱反調；導致父母管教威信受挫、常規瓦解。
        </p>
        <div style={{ fontSize: 15, fontWeight: 800, color: palette.rose, borderTop: `2px solid ${palette.rose}`, paddingTop: 10 }}>
          心疼求情 vs 規則崩塌
        </div>
      </div>
    </div>
    <Footer section="第二幕 · 四大摩擦" pageNumber="04" />
  </div>
);

// Slide 05: 兒童行為真相
const Page05: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第二幕 · 直面衝突與行為真相" title="雙重標準的代價：" highlight="孩子是如何學會「行為套利」的？" />
    <div style={{ fontFamily: fonts.serif, fontSize: 34, fontWeight: 800, color: palette.rose, maxWidth: 1400, lineHeight: 1.5, margin: '10px 0 48px' }}>
      「當大人標準不一時，孩子最先學會的不是規則自律，而是看人下菜碟與試探底線。」
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36, position: 'relative', zIndex: 1, borderTop: '2px solid #111827', paddingTop: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: palette.brandBlue, letterSpacing: '0.15em' }}>STAGE 01</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>父母立規矩</div>
        <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          要求不吃糖、按時收玩具、禁止餐前看手機。
        </p>
      </div>
      <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: palette.accent, letterSpacing: '0.15em' }}>STAGE 02</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>長輩私下放水</div>
        <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          心疼孩子哭鬧受挫，偷偷塞零食、放鬆屏幕時間。
        </p>
      </div>
      <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: palette.rose, letterSpacing: '0.15em' }}>STAGE 03</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>孩子行為套利</div>
        <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          在父母面前哭鬧找長輩撐腰，利用兩代分歧達到目的。
        </p>
      </div>
      <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#ef4444', letterSpacing: '0.15em' }}>STAGE 04</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>家庭常規瓦解</div>
        <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          孩子失去界限感，進入學校集體難以適應社會規則。
        </p>
      </div>
    </div>
    <Footer section="第二幕 · 行為真相" pageNumber="05" />
  </div>
);

// Slide 06: 責任重構
const Page06: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第二幕 · 直面衝突與行為真相" title="責任重構：" highlight="父母扛起管教責任，長輩享受溫暖陪伴" />
    <div style={{ display: 'grid', gridTemplateColumns: '36% 64%', gap: 50, alignItems: 'center', position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #e5e7eb', paddingRight: 40 }}>
        <img
          src={slide06Flat}
          alt="Roles Division Flat Vector"
          style={{ width: '100%', maxHeight: 420, objectFit: 'contain' }}
        />
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 18, color: palette.green, fontWeight: 800 }}>
          🎯 父母當掌舵嚴師 · 長輩當慈愛傘灣
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: palette.rose, marginBottom: 12 }}>
            ❌ 錯誤模式：父母缺位 ＋ 事後挑剔
          </div>
          <p style={{ fontSize: 20, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
            白天把規矩、作業、自理全壓在長輩身上；晚上回家發現沒做好便質問長輩。長輩承擔了不屬於他們的「嚴師重負」，受委屈且孩子無所適從。
          </p>
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: palette.green, marginBottom: 12 }}>
            ✅ 正確模式：父母管教主責 ＋ 長輩情感支持
          </div>
          <p style={{ fontSize: 20, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
            父母清醒意識到自己是教養第一責任人，核心規矩與作業由父母親自執行；長輩負責日常溫暖照護，重獲做祖輩的從容樂趣。
          </p>
        </div>
      </div>
    </div>
    <Footer section="第二幕 · 責任重構" pageNumber="06" />
  </div>
);

// Slide 07: 邊界重構
const Page07: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第三幕 · 協調之道" title="家庭邊界劃分：" highlight="父母守住核心原則，長輩享有生活彈性" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: palette.brandBlue }}>父母主導 · 核心底線（嚴格執行）</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: palette.brandBlue, border: `1px solid ${palette.brandBlue}`, padding: '4px 14px', borderRadius: 20 }}>不可退讓</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 21, color: palette.textSub, lineHeight: 1.8 }}>
          <div>• <strong>安全與品格紅線</strong>：交通安全、不碰危險品、不說謊、懂禮貌。</div>
          <div>• <strong>發育與作息底線</strong>：每晚固定入睡時間，確保生長激素正常分泌。</div>
          <div>• <strong>學業與學習常規</strong>：下班後父母親自檢查作業，不把輔導推給長輩。</div>
        </div>
        <div style={{ borderTop: `2px solid ${palette.brandBlue}`, paddingTop: 20, fontSize: 18, color: palette.brandBlue, fontWeight: 800 }}>
          🛡️ 執行原則：全家步調高度一致，無任何妥協漏洞。
        </div>
      </div>
      <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: palette.accent }}>長輩優勢 · 情感空間（充分授權）</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: palette.accent, border: `1px solid ${palette.accent}`, padding: '4px 14px', borderRadius: 20 }}>適度彈性</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 21, color: palette.textSub, lineHeight: 1.8 }}>
          <div>• <strong>情緒包容與安慰</strong>：受挫時無條件的擁抱與傾聽，給予安全感。</div>
          <div>• <strong>文化與家族智慧</strong>：散步聊天、講述家族奮鬥往事與傳統常識。</div>
          <div>• <strong>生活照料彈性</strong>：只要不違背三大底線，具體照料方式父母多包容不苛求。</div>
        </div>
        <div style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20, fontSize: 18, color: palette.accent, fontWeight: 700 }}>
          🌿 授權原則：抓大放小，給長輩舒適自在的陪伴空間。
        </div>
      </div>
    </div>
    <Footer section="第三幕 · 家庭邊界" pageNumber="07" />
  </div>
);

// Slide 08: 核心鐵律
const Page08: Page = () => (
  <div style={{ ...fill, background: palette.bgDark, color: palette.textLight, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 1600 }}>
      <div style={{ fontFamily: fonts.sans, fontSize: 19, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fbbf24', marginBottom: 28 }}>
        • 第三幕 · 協調之道 · 核心心法
      </div>
      <h2 style={{ fontFamily: fonts.serif, fontSize: 80, fontWeight: 900, lineHeight: 1.25, margin: '0 0 52px', color: '#ffffff' }}>
        「當面補台，私下商量；<br />
        <span style={{ color: '#fbbf24' }}>有異議，背後談。</span>」
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 44 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#38bdf8', marginBottom: 14 }}>1. 當下不拆台</div>
          <div style={{ fontSize: 20, color: '#cbd5e1', lineHeight: 1.8 }}>一方正在管教時，另一方哪怕心中有不同意見，也絕不在孩子面前反駁。</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fbbf24', marginBottom: 14 }}>2. 維護成人威信</div>
          <div style={{ fontSize: 20, color: '#cbd5e1', lineHeight: 1.8 }}>讓孩子清晰感受到大人的規則是一個堅固的整體，沒有鑽漏洞的縫隙。</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#34d399', marginBottom: 14 }}>3. 關起門來協商</div>
          <div style={{ fontSize: 20, color: '#cbd5e1', lineHeight: 1.8 }}>等孩子入睡或不在場時，兩代大人再心平氣和複盤，達成下次的一致做法。</div>
        </div>
      </div>
    </div>
    <Footer section="第三幕 · 協調鐵律" pageNumber="08" dark />
  </div>
);

// Slide 09: 溝通四步法
const Page09: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第三幕 · 協調之道" title="溝通話術：" highlight="溫和而堅定的「四步溝通法」" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 64, fontWeight: 900, color: palette.brandBlue }}>01</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>肯定辛勞與付出</div>
        <p style={{ fontSize: 18, color: palette.muted, lineHeight: 1.7, margin: 0 }}>
          先接納長輩的情感，看見對方的辛苦，解除防禦心理。
        </p>
        <div style={{ borderLeft: `3px solid ${palette.brandBlue}`, paddingLeft: 16, fontSize: 19, color: palette.brandBlue, fontWeight: 700, lineHeight: 1.6, marginTop: 8 }}>
          「爸/媽，您今天帶了他一整天，真的辛苦了！」
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 64, fontWeight: 900, color: palette.accent }}>02</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>客觀陳述影響</div>
        <p style={{ fontSize: 18, color: palette.muted, lineHeight: 1.7, margin: 0 }}>
          不指責對錯，只就事論事說明行為對孩子的具體影響。
        </p>
        <div style={{ borderLeft: `3px solid ${palette.accent}`, paddingLeft: 16, fontSize: 19, color: palette.accent, fontWeight: 700, lineHeight: 1.6, marginTop: 8 }}>
          「如果飯前吃太多餅乾，待會兒正餐就吃不下了。」
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 64, fontWeight: 900, color: palette.green }}>03</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>給出替代方案</div>
        <p style={{ fontSize: 18, color: palette.muted, lineHeight: 1.7, margin: 0 }}>
          提出既滿足長輩心意、又守住底線的雙贏可執行路徑。
        </p>
        <div style={{ borderLeft: `3px solid ${palette.green}`, paddingLeft: 16, fontSize: 19, color: palette.green, fontWeight: 700, lineHeight: 1.6, marginTop: 8 }}>
          「我們先把零食收好，吃完晚飯我們一起吃水果。」
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 64, fontWeight: 900, color: palette.text }}>04</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>主動接手承擔</div>
        <p style={{ fontSize: 18, color: palette.muted, lineHeight: 1.7, margin: 0 }}>
          父母親自上前接手引導，讓長輩得以坐下休息。
        </p>
        <div style={{ borderLeft: `3px solid ${palette.text}`, paddingLeft: 16, fontSize: 19, color: palette.text, fontWeight: 700, lineHeight: 1.6, marginTop: 8 }}>
          「接下來交給我來帶他，您快去喝水休息一下。」
        </div>
      </div>
    </div>
    <Footer section="第三幕 · 溝通四步法" pageNumber="09" />
  </div>
);

// Slide 10: 3C 屏幕情境實戰
const Page10: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第三幕 · 協調之道" title="情境實戰 1：" highlight="下班回家看見長輩給孩子看手機" />
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 50, alignItems: 'center', position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
        <img
          src={slide10Photo}
          alt="Kitchen Scenario Real Photo"
          style={{ width: '100%', height: 600, objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '28px 24px 20px', color: '#ffffff' }}>
          <div style={{ fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 800 }}>REALITY DILEMMA</div>
          <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>長輩做飯時孩子哭鬧，手機是長輩唯一的「臨時滅火器」</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ background: palette.roseLight, border: `1px solid rgba(190, 18, 60, 0.2)`, borderRadius: 16, padding: '22px 26px' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: palette.rose, marginBottom: 12 }}>❌ 踩雷做法：進門當場情緒指責</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 19 }}>
            <div><strong>父母</strong>：「媽！怎麼又給他看手機了？說過多少次會把眼睛看壞的！」</div>
            <div style={{ color: palette.rose }}><strong>長輩</strong>：「我忙著做飯他在旁邊鬧，我不給他看怎麼做飯？！」</div>
          </div>
          <div style={{ fontSize: 15, color: palette.rose, marginTop: 10, fontWeight: 600 }}>💥 辛勞被否定，長輩委屈防禦，氣氛降至冰點。</div>
        </div>
        <div style={{ background: palette.greenLight, border: `1px solid rgba(4, 120, 87, 0.2)`, borderRadius: 16, padding: '22px 26px' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: palette.green, marginBottom: 12 }}>✅ 實戰做法：體貼接手 ＋ 主動轉移注意</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 19 }}>
            <div><strong>父母（對長輩）</strong>：「媽，您忙了一整天辛苦了！接下來交給我，您快去休息一下。」</div>
            <div style={{ color: palette.green }}><strong>父母（對孩子）</strong>：「寶貝，我們跟手機說再見，今天媽媽帶你一起擺碗筷洗手。」</div>
          </div>
          <div style={{ fontSize: 15, color: palette.green, marginTop: 10, fontWeight: 600 }}>✨ 長輩感受被體貼尊重，屏幕順利關閉，常規和平建立。</div>
        </div>
      </div>
    </div>
    <Footer section="第三幕 · 3C 實戰" pageNumber="10" />
  </div>
);

// Slide 11: 飲食零食實戰
const Page11: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第三幕 · 協調之道" title="情境實戰 2：" highlight="飯前給零食與追著餵飯" />
    <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 60, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.accent, fontWeight: 900 }}>
          SCENARIO DRAMA
        </div>
        <div style={{ fontFamily: fonts.serif, fontSize: 38, fontWeight: 900, color: palette.text, lineHeight: 1.3 }}>
          生活現場：<br />爺爺私下給孫子點心
        </div>
        <p style={{ fontSize: 22, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          長輩給零食是表達「隔代疼愛」最直接的方式。如果直接奪走，長輩會感到尊嚴受損、好心被踐踏。
        </p>
        <div style={{ borderLeft: `4px solid ${palette.accent}`, paddingLeft: 20, fontSize: 20, color: palette.accent, fontWeight: 800, lineHeight: 1.6 }}>
          💡 破局關鍵：肯定長輩的心意，將「即時享受」轉化為「飯後共享儀式」。
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ background: palette.roseLight, border: `1px solid rgba(190, 18, 60, 0.2)`, borderRadius: 16, padding: '24px 28px' }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: palette.rose, marginBottom: 14 }}>❌ 踩雷做法：當眾奪走食物批評</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 20 }}>
            <div><strong>父母</strong>：「別再給他吃了！馬上就要吃晚飯了，吃這麼多零食怎麼吃得下飯？！」</div>
            <div style={{ color: palette.rose }}><strong>長輩</strong>：「他就吃一小塊怎麼了？看孩子餓得可憐給點吃的也犯法？！」</div>
          </div>
          <div style={{ fontSize: 16, color: palette.rose, marginTop: 12, fontWeight: 600 }}>💥 長輩覺得好心被當驢肝肺，孩子嚎啕大哭，飯桌徹底失和。</div>
        </div>
        <div style={{ background: palette.greenLight, border: `1px solid rgba(4, 120, 87, 0.2)`, borderRadius: 16, padding: '24px 28px' }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: palette.green, marginBottom: 14 }}>✅ 實戰做法：肯定心意 ＋ 延遲滿足獎勵</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 20 }}>
            <div><strong>父母（對孩子）</strong>：「爺爺真疼你，特意留了這麼好吃的餅乾！我們先把餅乾收在盒子裡。」</div>
            <div style={{ color: palette.green }}><strong>父母（對長輩）</strong>：「爸，等孩子吃完晚飯，我們一家人陪您一起分享這包點心好不好？」</div>
          </div>
          <div style={{ fontSize: 16, color: palette.green, marginTop: 12, fontWeight: 600 }}>✨ 成全爺爺的疼愛心意，守住正餐底線，孩子學會等待。</div>
        </div>
      </div>
    </div>
    <Footer section="第三幕 · 飲食實戰" pageNumber="11" />
  </div>
);

// Slide 12: 第三方權威
const Page12: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第三幕 · 協調之道" title="智慧借力：" highlight="善用「第三方專業權威」化解代際對立" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 72, fontWeight: 900, color: palette.brandBlue }}>01</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: palette.text }}>兒科醫生 / 牙醫建議</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          「上次體檢醫生特別交代，孩子牙齒有蛀牙初期跡象，千叮嚀萬囑咐晚餐後絕對不能吃甜食。」
        </p>
        <div style={{ borderTop: `2px solid ${palette.brandBlue}`, paddingTop: 20, fontSize: 18, color: palette.brandBlue, fontWeight: 800 }}>
          💡 作用：用客觀醫學診斷取代個人指責。
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 72, fontWeight: 900, color: palette.accent }}>02</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: palette.text }}>學校 / 幼兒園老師要求</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          「幼兒園班主任說下學期要評估自己穿鞋穿外套，希望家裡多給孩子獨立動手的練習機會。」
        </p>
        <div style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20, fontSize: 18, color: palette.accent, fontWeight: 800 }}>
          💡 作用：將自理要求轉化為學校適應需求。
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 72, fontWeight: 900, color: palette.green }}>03</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: palette.text }}>科學發育與睡眠標準</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          「兒童健康指南顯示，幼兒每天需睡足10小時，生長激素在夜間深睡眠達分泌高峰。」
        </p>
        <div style={{ borderTop: `2px solid ${palette.green}`, paddingTop: 20, fontSize: 18, color: palette.green, fontWeight: 800 }}>
          💡 作用：用客觀生理發育引導早睡常規。
        </div>
      </div>
    </div>
    <Footer section="第三幕 · 第三方權威" pageNumber="12" />
  </div>
);

// Slide 13: 長輩不可替代價值
const Page13: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第四幕 · 共同協作" title="長輩不可替代的獨特價值：" highlight="做孩子心靈中堅實的避風港" />
    <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 50, alignItems: 'center', position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
        <img
          src={slide13Photo}
          alt="Grandmother Warm Embrace Photo"
          style={{ width: '100%', height: 600, objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '28px 24px 20px', color: '#ffffff' }}>
          <div style={{ fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#34d399', fontWeight: 800 }}>EMOTIONAL HAVEN</div>
          <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>長輩無條件的溫暖擁抱，賦予孩子極高的心理安全感</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 8 }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: palette.accent, marginBottom: 6 }}>01 家族歷史與文化根基</div>
          <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
            長輩口述的家族奮鬥歷程與傳統節慶智慧，是孩子建立自我認同最珍貴的精神根基。
          </p>
        </div>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: palette.green, marginBottom: 6 }}>02 受挫時的情緒避風港</div>
          <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
            父母負責立規矩與嚴管，長輩提供包容與撫慰，形成健康的情感平衡與退可守的港灣。
          </p>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: palette.brandBlue, marginBottom: 6 }}>03 從容悠然的耐心陪伴</div>
          <p style={{ fontSize: 19, color: palette.textSub, lineHeight: 1.7, margin: 0 }}>
            比起趕時間的父母，長輩有更多耐心陪孩子慢慢散步、觀察生活，涵養沉穩品格。
          </p>
        </div>
      </div>
    </div>
    <Footer section="第四幕 · 長輩價值" pageNumber="13" />
  </div>
);

// Slide 14: 父母及時接棒
const Page14: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第四幕 · 共同協作" title="父母的責任擔當：" highlight="下班及時接棒，讓長輩真正卸下重擔" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 52, fontWeight: 900, color: palette.brandBlue }}>18:30</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>進門主動接手</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          進門第一句話真誠肯定長輩一整天的辛勞，主動接過孩子、書包與家務，讓長輩得以坐下喝水休息。
        </p>
        <div style={{ borderTop: `2px solid ${palette.brandBlue}`, paddingTop: 20, fontSize: 18, color: palette.brandBlue, fontWeight: 800 }}>
          🔑 關鍵：下班不當甩手掌櫃，及時接棒。
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 52, fontWeight: 900, color: palette.accent }}>19:30</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>親自輔導常規</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          檢查作業、習慣培養、自理收拾與常規訓練由父母親自跟進並立規矩，不將管教壓力轉嫁給長輩。
        </p>
        <div style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20, fontSize: 18, color: palette.accent, fontWeight: 800 }}>
          🔑 關鍵：父母親自站上管教嚴師第一線。
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 52, fontWeight: 900, color: palette.green }}>21:00</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>深度陪伴就寢</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          父母帶領睡前親子共讀，營造溫馨安全的睡前儀式感，確保孩子在 21:30 前熄燈安睡。
        </p>
        <div style={{ borderTop: `2px solid ${palette.green}`, paddingTop: 20, fontSize: 18, color: palette.green, fontWeight: 800 }}>
          🔑 關鍵：用規律作息為孩子大腦發育築底。
        </div>
      </div>
    </div>
    <Footer section="第四幕 · 及時接棒" pageNumber="14" />
  </div>
);

// Slide 15: 全家三大底線
const Page15: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第四幕 · 共同協作" title="全家共識：" highlight="共同守護的 3 條核心底線" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.accent, fontWeight: 900 }}>
          REDLINE 01
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: palette.text }}>固定就寢時間</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          每晚 21:30 前全家熄燈上床。不因長輩看電視、父母加班或孩子玩耍而妥協推遲，全家步調一致。
        </p>
        <div style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20, fontSize: 18, color: palette.accent, fontWeight: 900 }}>
          🌙 守護大腦與生長激素發育。
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.brandBlue, fontWeight: 900 }}>
          REDLINE 02
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: palette.text }}>3C 屏幕使用限額</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          單日娛樂屏幕時間嚴格控制在 30 分鐘內；餐桌上與睡前 1 小時，全家大人小孩一律不看手機。
        </p>
        <div style={{ borderTop: `2px solid ${palette.brandBlue}`, paddingTop: 20, fontSize: 18, color: palette.brandBlue, fontWeight: 900 }}>
          📱 守護專注力與視力健康。
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.green, fontWeight: 900 }}>
          REDLINE 03
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: palette.text }}>長輩尊重與感恩</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          孩子對長輩必須使用禮貌用語，絕不允許任性辱罵；長輩為家庭付出的每頓飯與照料，都要常說謝謝。
        </p>
        <div style={{ borderTop: `2px solid ${palette.green}`, paddingTop: 20, fontSize: 18, color: palette.green, fontWeight: 800 }}>
          🤝 培養敬老與感恩品格。
        </div>
      </div>
    </div>
    <Footer section="第四幕 · 三大底線" pageNumber="15" />
  </div>
);

// Slide 16: 現場案例問答
const Page16: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第四幕 · 現場互動" title="現場情境問答：" highlight="真實家庭案例互動演練" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: palette.accent }}>情境 A：長輩私下給零食怎麼辦？</div>
        <p style={{ fontSize: 22, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          孩子跑去長輩房間拿糖吃，被下班回家的媽媽撞見了。現場哪位家長或長輩願意分享：這時雙方怎麼溝通最得體？
        </p>
        <div style={{ borderLeft: `4px solid ${palette.accent}`, paddingLeft: 20, fontSize: 20, color: palette.accent, fontWeight: 800, lineHeight: 1.6 }}>
          🎯 核心心法：肯定長輩疼愛心意 ＋ 約定晚飯後一起分享點心。
        </div>
      </div>
      <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: palette.green }}>情境 B：長輩習慣替孩子穿鞋收拾？</div>
        <p style={{ fontSize: 22, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          出門前長輩急著幫孩子穿鞋穿襪，父母希望孩子自己練習。如何溝通才能既不耽誤出門時間，又保護孩子的自理機會？
        </p>
        <div style={{ borderLeft: `4px solid ${palette.green}`, paddingLeft: 20, fontSize: 20, color: palette.green, fontWeight: 800, lineHeight: 1.6 }}>
          🎯 核心心法：提前 10 分鐘準備 ＋ 藉助學校評估要求共同鼓勵。
        </div>
      </div>
    </div>
    <Footer section="第四幕 · 現場案例" pageNumber="16" />
  </div>
);

// Slide 17: 家庭通關暗號
const Page17: Page = () => (
  <div style={{ ...fill, padding: `${PAD_Y}px ${PAD_X}px`, display: 'flex', flexDirection: 'column' }}>
    <CanvasDecor />
    <Header eyebrow="第四幕 · 現場互動" title="實用技巧：" highlight="約定「家庭通關暗號」，幽默化解衝突" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, position: 'relative', zIndex: 1, marginTop: 10 }}>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 44, fontWeight: 900, color: palette.brandBlue }}>「超人休息」</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>情緒急剎車</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          當任何一方感覺情緒即將失控爆發時說出，全家暫停爭執 3 分鐘，各自冷靜喝一杯溫水。
        </p>
        <div style={{ borderTop: `2px solid ${palette.brandBlue}`, paddingTop: 20, fontSize: 18, color: palette.brandBlue, fontWeight: 800 }}>
          ⏸️ 功能：避免在孩子面前爆發爭吵。
        </div>
      </div>
      <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 44, fontWeight: 900, color: palette.accent }}>「暗號 333」</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>背後再溝通</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          幽默提醒對方遵守「當面不拆台」鐵律，有不同意見等晚上孩子睡著後再私下商量。
        </p>
        <div style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20, fontSize: 18, color: palette.accent, fontWeight: 800 }}>
          🔒 功能：維護規則一致性與大人威信。
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 44, fontWeight: 900, color: palette.green }}>「今天我請喝茶」</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: palette.text }}>感恩與溫情修復</div>
        <p style={{ fontSize: 21, color: palette.textSub, lineHeight: 1.8, margin: 0 }}>
          子女主動發起一次溫馨的早茶或下午茶，作為表達感恩、並與長輩私下溫和交流教養原則的契機。
        </p>
        <div style={{ borderTop: `2px solid ${palette.green}`, paddingTop: 20, fontSize: 18, color: palette.green, fontWeight: 800 }}>
          🍵 功能：用溫情潤滑兩代關係。
        </div>
      </div>
    </div>
    <Footer section="第四幕 · 通關暗號" pageNumber="17" />
  </div>
);

// Slide 18: 結語
const Page18: Page = () => (
  <div style={{ ...fill, padding: 0, position: 'relative' }}>
    <img
      src={slide18Photo}
      alt="Three Generations Triumph Hero Photo"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.85) 55%, rgba(15,23,42,0.4) 100%)' }} />
    <div style={{ position: 'relative', zIndex: 1, padding: `${PAD_Y + 20}px ${PAD_X}px`, maxWidth: 1400, color: '#ffffff' }}>
      <div style={{ fontFamily: fonts.sans, fontSize: 18, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fbbf24', marginBottom: 28 }}>
        • 三代同心 · 守護花開
      </div>
      <h1 style={{ fontFamily: fonts.serif, fontSize: 96, fontWeight: 900, lineHeight: 1.15, margin: 0, color: '#ffffff' }}>
        雙倍的愛，<span style={{ color: '#fbbf24' }}>共同的智慧</span>
      </h1>
      <div style={{ height: 3, width: 440, background: '#fbbf24', margin: '36px 0' }} />
      <div style={{ borderLeft: '4px solid #fbbf24', paddingLeft: 32, marginBottom: 40 }}>
        <p style={{ fontFamily: fonts.serif, fontSize: 32, lineHeight: 1.7, color: '#f8fafc', margin: 0, fontWeight: 800 }}>
          「三代同堂不是誰征服誰，而是兩代大人攜手為孩子築起穩定的成長空間。<br />
          <span style={{ color: '#fbbf24' }}>父母守底線，長輩給溫暖；彼此體諒，達成三代共贏。</span>」
        </p>
      </div>
      <div style={{ fontSize: 24, color: '#cbd5e1', fontWeight: 600 }}>
        祝願所有家庭：三代和睦 · 科學教養 · 幸福同行！
      </div>
    </div>
    <Footer section="No. 18 · 結語昇華" pageNumber="18" dark />
  </div>
);

export const meta: SlideMeta = {
  title: '三代共贏的教養智慧',
  createdAt: '2026-08-24T17:00:00Z',
};

export default [
  Page01,
  Page02,
  Page03,
  Page04,
  Page05,
  Page06,
  Page07,
  Page08,
  Page09,
  Page10,
  Page11,
  Page12,
  Page13,
  Page14,
  Page15,
  Page16,
  Page17,
  Page18,
] satisfies Page[];
