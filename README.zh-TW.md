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

### 特色

- **產品優先。** 在任何投影片出現之前，簡報需求書（brief）先確定簡報類型（決策、進度、提案、培訓、主題演講、技術）、聽眾、承諾、交付物（上台版或閱讀版、`.pptx` 是否需可編輯）、品牌範本與主題。
- **每個論點都有出處。** 證據表一個論點一列，每個非原創素材也一列並記錄授權。
- **標題就是論點。** 每頁都有完整句子的結論式標題與版型；只讀標題也能看懂整個故事。
- **由程式檢查，而非自我認證。** 零依賴腳本檢查故事板（標題、版型、證據編號、時間）、主題色彩對比，以及匯出的 `.pptx`（投影片／講稿／PDF 頁數一致、字級下限、替代文字、文字密度）。
- **中立核心，風格可插拔。** 語言規則、故事結構與視覺風格放在設定檔（`default`、`training-zh-hant`）與主題（`editorial-minimal`、`bright-sans`、`aurora`、`sticker-pop`）中，共用一套不分引擎的字級系統。

流程支援 `general`、`fast-track` 與 `research-enhanced` 模式。原型與生產環境 QA 使用
adapter；內含 `open-slide`、`genoffice`、`marp`、`pptxgenjs`、`claude-pptx`、`codex-slides`、`google-slides` 與 `handoff`，並內附 `genoffice`
技能供代理直接讀取、建立、幾何審計（audit）、渲染與轉換本地 Office 檔案。`scripts/export-deck.mjs` 以各引擎自己的 CLI 無頭匯出；`scripts/qa-deck.mjs` 執行引擎的自動審計（open-slide、GenOffice），並對所有引擎檢查匯出檔是否完整。

`skills/make-presentation/references/` 中的實踐吸收自 [`backnotprop/pstack`](https://github.com/backnotprop/pstack)（聚焦重播、去 AI 贅詞檢查 `scripts/unslop-check.mjs`、審查分桶、原型擂台與經驗編碼）與 [`mattpocock/skills`](https://github.com/mattpocock/skills)（Frontier rounds 輪次式提問、「yes」採納建議、問卷轉換）。

### 由哪個工具做投影片

流程負責決定簡報「說什麼」與「能否上台」。投影片檔案可以來自下列任一工具，全部都用同一套檢查驗收匯出的 `.pptx`／`.pdf`：

| 你使用 | 引擎 | 投影片怎麼產生 |
| --- | --- | --- |
| Claude（Claude Code 或 claude.ai） | `claude-pptx` | Claude 自己的 `pptx` 技能寫 PptxGenJS 腳本或修改範本，產出可編輯的原生 `.pptx`。Claude Code 以 `/plugin marketplace add anthropics/skills` 與 `/plugin install document-skills@anthropic-agent-skills` 安裝。 |
| Codex | `codex-slides` | [`openai/skills`](https://github.com/openai/skills) 的 `slides` 技能，附渲染與溢出檢查 |
| Google 簡報 | `google-slides` | 用 Slides API 或代理的 Google 簡報連接器建立，或把 `.pptx` 匯入 Google 簡報；再匯出 `.pptx`／`.pdf` 做 QA |
| ChatGPT、Gamma、Canva、Copilot、Keynote、設計師 | `handoff` | `build-packet.mjs` 產生 `BUILD-PACKET.md` 貼給該工具；匯出的 `.pptx` 再拿回來驗收 |
| 只用腳本，不用平台技能 | `pptxgenjs` | PptxGenJS 的 `build.mjs` |
| 必須保留原檔母片的 Office 檔 | `genoffice` | GenOffice CLI |
| 瀏覽器畫布／Markdown | `open-slide`／`marp` | 各自的 CLI |

規則：

- 關卡由協調器掌控。製作工具不得自行標記關卡通過，也不得跳過證據、故事或上台審查。
- 在原型關卡以 `status.mjs set-engine` 記錄引擎，並遵循 `adapters/<engine>/`。主題、字級與故事板優先於製作工具自己的設計預設。
- 只能匯出圖片（或無法匯出 `.pptx`）的工具，無法通過講稿一致與可編輯檢查；選用前要先告知使用者。

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
- `adapters/` — 各引擎的原型與匯出指示（`open-slide`、`genoffice`、`marp`、`pptxgenjs`、`claude-pptx`、`codex-slides`、`google-slides`、`handoff`）
- `examples/` — 完整的流程執行範例
- `.agents/` — 維護者自用的代理設定：`skills/` 與 `adapters/` 的鏡像（由 `npm test` 檢查一致）以及不會被安裝的第三方技能；詳見 [`.agents/README.md`](./.agents/README.md)

## AI 代理指南

代理的操作安裝與執行指示位於 [`AGENTS.md`](./AGENTS.md)。開始安裝或執行流程前請先閱讀。個別
`SKILL.md` 檔案是各關卡執行的唯一真實來源。

## 授權

MIT。詳見 [`LICENSE`](./LICENSE)。
