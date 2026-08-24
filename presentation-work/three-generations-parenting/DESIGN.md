# Design System: Warm Editorial Parenting (三代共贏溫暖人文風)

## 1. Visual Personality & Emotional Tone
- **Tone**: 溫暖、理性、包容、明亮、長輩友善（Warm, Rational, Inclusive, High-Legibility）。
- **Background Philosophy**: 告別冷硬的暗色科技風，採用舒適護眼的**溫潤米白（Warm Cream Paper）**，在任何社區禮堂或明亮投影設備下均具備極高的對比度與親和力。

---

## 2. Design Tokens

### Color Palette
```yaml
colors:
  bg: "#f8fafc"               # 畫布底色：淺灰白 / 溫潤紙感
  surface: "#ffffff"          # 卡片表面：純白
  surfaceMuted: "#f1f5f9"     # 次級卡片：柔和淺灰
  surfaceWarm: "#fffbeb"      # 溫馨高亮卡：暖琥珀淺底
  surfaceGreen: "#ecfdf5"     # 正向實戰卡：淡翡翠綠底
  surfaceRose: "#fff1f2"      # 踩雷對比卡：淡玫瑰紅底
  textPrimary: "#0f172a"      # 標題與主字體：深岩青炭黑
  textSecondary: "#334155"    # 正文文字：中灰黑
  textMuted: "#64748b"        # 註解與次級字：柔和冷灰
  accent: "#0284c7"           # 主調亮色：知性天藍
  warmAccent: "#d97706"       # 溫暖強調：琥珀金橙
  greenAccent: "#059669"      # 實戰正向：森林翡翠綠
  roseAccent: "#e11d48"       # 衝突警示：玫瑰深紅
  border: "#e2e8f0"           # 卡片邊框：細緻淺灰
  borderWarm: "#fde68a"       # 暖色邊框
  borderGreen: "#a7f3d0"      # 綠色邊框
  borderRose: "#fecdd3"       # 紅色邊框
```

### Typography Hierarchy (1920×1080 Canvas)
```yaml
typography:
  fontFamily: 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Sans TC", sans-serif'
  scale:
    heroTitle:
      fontSize: 108px
      fontWeight: 900
      lineHeight: 1.3
      letterSpacing: "-0.02em"
    pageTitle:
      fontSize: 56px
      fontWeight: 800
      lineHeight: 1.35
    pageSubtitle:
      fontSize: 26px
      fontWeight: 400
      lineHeight: 1.6
      color: textMuted
    cardHeader:
      fontSize: 26px
      fontWeight: 800
      lineHeight: 1.4
    body:
      fontSize: 22px
      fontWeight: 400
      lineHeight: 1.7
      color: textSecondary
    caption:
      fontSize: 18px
      fontWeight: 500
      lineHeight: 1.5
```

### Geometry & Spacing
```yaml
spacing:
  canvasPadding: "90px 140px"
  cardPadding: "32px 28px"
  gapLarge: "32px"
  gapMedium: "24px"
  gapSmall: "16px"
  radius: "16px"
  radiusLarge: "24px"
  borderWidth: "1px"
  shadowCard: "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)"
```

---

## 3. Component Specs

### Component 1: `Header`
- **Tag**: 20px 粗體、大寫字距、`accent` 主色。
- **Title**: 56px 粗體、`textPrimary`。
- **Subtitle**: 26px、`textMuted`、最大行寬 1450px。

### Component 2: `ContrastCard` (踩雷 vs 實戰)
- **踩雷卡（Negative）**: `surfaceRose` 底色 ＋ `borderRose` 邊框 ＋ `roseAccent` 標題。
- **實戰卡（Positive）**: `surfaceGreen` 底色 ＋ `borderGreen` 邊框 ＋ `greenAccent` 標題。

### Component 3: `ProcessCard` (四步溝通流程)
- **標題數字徽章**: 圓形 `accent` 底色、純白粗體數字。
- **內容框**: `surfaceMuted` 內部引用框，展示真實話術。

### Component 4: `StatCard` (現狀指標)
- **大數字**: 64px 超粗體（`accent` / `warmAccent` / `greenAccent`）。
- **標題**: 26px 粗體。
- **說明**: 20px `textMuted`。
