# agentic-ppt-skills

[English](./README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md)

與簡報引擎無關的代理技能，能將筆記、既有簡報或想法，轉化為完成且適合上台發表的簡報。

## 使用者指南

本儲存庫提供八個關卡的工作流程：

```text
來源 → 產品 → 證據 → 故事 → 故事審查 → 原型 → 上台 → 交付
```

每個關卡都有專注的技能與指定交付成果：

| 關卡 | 技能 | 交付成果 |
| --- | --- | --- |
| 來源整理 | `presentation-source-intake` | `SOURCE-INVENTORY.md` |
| 產品定義 | `presentation-product-grill` | `PRESENTATION-BRIEF.md` |
| 證據 | `presentation-evidence` | `EVIDENCE-LEDGER.md` |
| 故事架構 | `presentation-story-architecture` | `STORY.md`、`STORYBOARD.md` |
| 故事檢視 | `presentation-story-grill` | `GRILL-LOG.md` |
| 原型 | `presentation-prototype` | 代表性簡報 |
| 上台檢視 | `presentation-stage-grill` | `SPEAKER-SCRIPT.md` |
| 生產環境 QA | `presentation-deck-qa` | `QA-REPORT.md`、匯出檔案 |

流程支援 `general`、`fast-track` 與 `research-enhanced` 模式。原型與生產環境 QA 使用
adapter；內含 `open-slide`、`genoffice`、`marp` 與 `pptxgenjs`，並內附 `genoffice`
技能供代理直接讀取、建立、幾何審計（audit）、渲染與轉換本地 Office 檔案。`scripts/export-deck.mjs` 以各引擎自己的 CLI 無頭匯出；`scripts/qa-deck.mjs` 執行引擎的自動審計（open-slide、GenOffice），並對所有引擎檢查匯出檔是否完整。

`skills/make-presentation/references/` 中的實踐吸收自 [`backnotprop/pstack`](https://github.com/backnotprop/pstack)（聚焦重播、去 AI 贅詞檢查 `scripts/unslop-check.mjs`、審查分桶、原型擂台與經驗編碼）與 [`mattpocock/skills`](https://github.com/mattpocock/skills)（Frontier rounds 輪次式提問、「yes」採納建議、問卷轉換）。

### 搭配平台內建的 PPT 技能

本專案的技能負責決定簡報「說什麼」與「是否可上台」；檔案「怎麼產生」可交給執行環境自己的 PowerPoint 技能：

| 執行環境 | 平台技能 | 搭配位置 |
| --- | --- | --- |
| Claude Code | [`anthropics/skills`](https://github.com/anthropics/skills) 的 `pptx`（`document-skills` 外掛；原始碼公開但非開源授權） | `source-intake`：讀取既有 `.pptx` 的文字與結構。`deck-prototype` / `production-qa`：在 `pptxgenjs` adapter 規則下建立與修改檔案（兩者使用同一套函式庫）。 |
| Codex | [`openai/skills`](https://github.com/openai/skills) 的 `slides`（PptxGenJS 加上渲染與溢出檢查） | 同上。其渲染與溢出檢查結果可作為 `QA-REPORT.md` 的證據。 |

搭配規則：

- 關卡仍由協調器掌控。平台技能不得自行標記關卡通過，也不得跳過證據、故事或上台審查。
- 以 `set-engine` 記錄引擎為 `pptxgenjs`，並遵循 `adapters/pptxgenjs/` 的版面預算、字級與備忘稿規則；平台技能自身的設計預設以這些規則為準。
- 只選一個執行目錄（`.agents/skills/` 或 `.claude/skills/`），每個關卡只啟用一個產生簡報的技能，避免兩個技能寫同一個檔案。

### 安裝

在代理應使用這些技能的專案根目錄執行：

```bash
SRC=/absolute/path/to/agentic-ppt-skills  # 替換為此 checkout 的路徑
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

接著請代理製作簡報，例如：

> 使用 `./research/` 中的筆記製作簡報。

協調器會從最早尚未完成的關卡繼續執行，並將狀態記錄在
`presentation-work/<deck-id>/STATUS.md`。

### 儲存庫結構

- `skills/` — 可發佈、與引擎無關的技能（含 `genoffice`、`grilling`、`grill-me`、`to-questionnaire`）
- `adapters/` — 各引擎的原型與匯出指示（`open-slide`、`genoffice`、`marp`、`pptxgenjs`）
- `examples/` — 完整的流程執行範例
- `.agents/` — 維護者自用的代理設定：`skills/` 與 `adapters/` 的鏡像（由 `npm test` 檢查一致）以及不會被安裝的第三方技能；詳見 [`.agents/README.md`](./.agents/README.md)

## AI 代理指南

代理的操作安裝與執行指示位於 [`AGENTS.md`](./AGENTS.md)。開始安裝或執行流程前請先閱讀。個別
`SKILL.md` 檔案是各關卡執行的唯一真實來源。

## 授權

MIT。詳見 [`LICENSE`](./LICENSE)。
