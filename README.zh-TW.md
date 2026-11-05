# agentic-ppt-skills

[English](./README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md)

[![test](https://github.com/samulee003/agentic-ppt-skills/actions/workflows/test.yml/badge.svg)](https://github.com/samulee003/agentic-ppt-skills/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![Node 18+](https://img.shields.io/badge/node-%E2%89%A518-brightgreen.svg)
![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)

**讓 AI 代理把筆記做成「站得住腳」的簡報：先有需求書、每個論點有出處、標題本身就是論點，最後由程式檢查匯出的 `.pptx`。可搭配 Claude、Codex、Google 簡報、PptxGenJS，或交給任何你習慣的工具製作。**

![agentic-ppt-skills：從筆記到通過檢查的簡報的八道關卡](./docs/images/hero.png)

## 為什麼需要它

請 AI 「做一份關於 X 的簡報」，通常會得到：

- 每頁都是標題、副標題加四段條列文字；
- 沒有出處的數字，或年份、分母錯誤的數字；
- 像「成果」這種本身什麼都沒說的主題式標題；
- 文字溢出文字框，或被縮到沒人看得清楚；
- 講稿缺漏，或和投影片內容對不上。

這套技能讓代理像一個簡報團隊那樣工作：先寫需求書、為每個論點建立證據表、逐頁規劃故事、先做原型再做整份、當成一場演講來彩排，最後才匯出。每一步都有程式檢查，代理不能只靠自己說「做好了」。

## 快速開始

**Claude Code（外掛）**

```text
/plugin marketplace add samulee003/agentic-ppt-skills
/plugin install agentic-ppt-skills@agentic-ppt-skills
```

**任何代理（Claude Code、Codex、Cursor……）：在專案資料夾執行一行指令**

```bash
npx github:samulee003/agentic-ppt-skills                   # 安裝到 .agents/
npx github:samulee003/agentic-ppt-skills --runtime=claude  # 安裝到 .claude/
```

接著直接說：

> 用 `./notes/` 裡的筆記做一份簡報，給管理層看的 15 分鐘決策簡報。

也可以這樣開始：「把這份 PDF 報告做成 10 頁的進度簡報」、「改善 `q3-review.pptx` 並翻成繁體中文」、「用這些訪談紀錄做一份 45 分鐘的工作坊簡報」。代理會依 [`AGENTS.md`](./AGENTS.md) 的步驟執行。

## 你會得到什麼

每份簡報都放在 `presentation-work/<deck-id>/`：

| 檔案 | 內容 |
| --- | --- |
| `PRESENTATION-BRIEF.md` | 聽眾、要做的決定、承諾、驗收標準、簡報類型、交付物、主題 |
| `EVIDENCE-LEDGER.md` | 一個論點一列：出處、日期、定義、保留意見、可用在哪裡；每個素材的授權 |
| `STORY.md`、`STORYBOARD.md` | 核心論點、章節，以及每頁一列：結論式標題、版型、證據、時間 |
| `SPEAKER-SCRIPT.md` | 每頁要講什麼、時間、可能的質疑、時間不夠時刪哪裡 |
| `QA-REPORT.md` | 檢查結果、無障礙、看過哪些頁、剩下的保留事項 |
| `exports/<deck-id>.pptx`／`.pdf` | 簡報本身，每頁都有講稿 |
| `STATUS.md` | 哪些關卡已通過，依據哪些產出與決定 |

## 運作方式

八道關卡，每關一個專門技能。協調器永遠從最早未通過的關卡繼續；前面的決定一改，後面的關卡會自動要求重審。

| # | 關卡 | 回答的問題 | 檢查工具 |
| --- | --- | --- | --- |
| 1 | 來源盤點 | 有哪些資料？哪個版本是最新的？ | |
| 2 | 需求書 | 給誰看？要改變什麼？哪些不做？ | |
| 3 | 證據 | 哪些話可以說？要加什麼保留？ | |
| 4 | 故事 | 每一頁要做什麼？順序是？ | `storyboard-check.mjs` |
| 5 | 故事審查 | 經得起最強的反對意見嗎？只讀標題能看懂嗎？ | `storyboard-check.mjs` |
| 6 | 原型 | 代表頁在實際工具和主題下行得通嗎？ | `pptx-check.mjs` |
| 7 | 上台審查 | 講得出口、時間對、適合這群聽眾嗎？ | `unslop-check.mjs` |
| 8 | QA | 匯出檔一致、好讀、通過所有檢查嗎？ | `qa-deck.mjs` + `pptx-check.mjs` |

三種模式：`general`；給小型內部簡報的 `fast-track`（第 1–2 關、第 4–5 關合併記錄）；以及內容涉及重要統計、研究、法律、醫療或財務時的 `research-enhanced`（A/B/C/D 論點安全等級、原始來源、逐頁查證）。

## 搭配你的簡報工具

流程負責決定簡報「說什麼」與「能否上台」。下列任一工具都可以做出檔案，全部都用同一套檢查驗收：

| 你使用 | 引擎 | 投影片怎麼產生 |
| --- | --- | --- |
| Claude（Claude Code、claude.ai） | `claude-pptx` | Claude 原生的 `pptx` 技能：可編輯的原生 `.pptx`，也能套用品牌範本 |
| Codex | `codex-slides` | [`openai/skills`](https://github.com/openai/skills) 的 `slides` 技能 |
| Google 簡報 | `google-slides` | Slides API 或 Google 簡報連接器，或把 `.pptx` 匯入 Google 簡報 |
| ChatGPT、Gamma、Canva、Copilot、Keynote、設計師 | `handoff` | `build-packet.mjs` 產生 `BUILD-PACKET.md` 交給該工具；匯出的 `.pptx` 拿回來做 QA |
| 純腳本 | `pptxgenjs` | PptxGenJS 的 `build.mjs` |
| 必須保留母片的 Office 檔 | `genoffice` | GenOffice CLI |
| 瀏覽器畫布／Markdown | `open-slide`／`marp` | 各自的 CLI |

每個引擎在 [`adapters/`](./adapters/) 都有轉接說明：製作規則、字級換算、品牌範本做法與 QA 步驟。

## 檢查工具

所有腳本都零依賴、只需 Node 18+，可檢查任何引擎的產出。

| 腳本 | 抓出的問題 |
| --- | --- |
| `pptx-check.mjs` | 缺講稿；投影片、講稿、PDF 頁數不一致；字小於投影下限；文字可能溢出文字框；圖片缺替代文字；文字牆；整頁是圖片、無法編輯 |
| `storyboard-check.mjs` | 主題式標題；缺少或未知的版型；連續三頁同版型；證據表裡不存在的證據編號；主講時間超過時段 |
| `theme-check.mjs` | 主題配色未達 WCAG AA 對比 |
| `unslop-check.mjs` | 投影片文字與講稿裡的 AI 腔 |
| `qa-deck.mjs` | 執行引擎自己的檢查、確認每個匯出檔存在，再跑 `pptx-check` |

任何一項報錯都會擋住該關卡。這個 repo 自帶的範例簡報，原本就有沒人發現的文字重疊，是新的溢出檢查第一次執行時抓到的，現已修正。

```text
$ node .agents/skills/make-presentation/scripts/qa-deck.mjs agentic-coding-anatomy
pptx-check: 5 slides, 5 with notes, PDF 5 pages
pptx-check: no errors
```

## 範例

[`examples/agentic-coding-anatomy-claude-pptx/`](./examples/agentic-coding-anatomy-claude-pptx/) 是完整的一次執行：需求書、證據表、故事與故事板在 [`examples/agentic-coding-anatomy/work/`](./examples/agentic-coding-anatomy/work/)，用 `claude-pptx` 引擎和 `editorial-minimal` 主題製作。

![範例簡報縮圖](./examples/agentic-coding-anatomy-claude-pptx/images/contact-sheet.png)

同一個故事也用 [Marp](./examples/agentic-coding-anatomy-marp/) 和 [PptxGenJS](./examples/agentic-coding-anatomy-pptxgenjs/) 各做了一份。

## 客製化

- **設定檔**（[`profiles/`](./skills/make-presentation/profiles/)）：把一類工作的預設打包起來，例如 `default`，或繁體中文培訓、粵語講稿用的 `training-zh-hant`。可以自己新增。
- **簡報類型**（[`deck-types.md`](./skills/make-presentation/references/deck-types.md)）：`decision`、`update`、`pitch`、`training`、`keynote`、`technical`，各有預設結構；上台版與閱讀版是分開的交付物。
- **主題**（[`themes/`](./skills/make-presentation/themes/)）：`editorial-minimal`、`bright-sans`、`aurora`、`sticker-pop`，每個都是經過對比檢查的呈現規格。品牌範本會覆蓋配色與字型。
- **一套字級**（[`typography.md`](./skills/make-presentation/references/typography.md)）：以投影片高度的比例表示，所有引擎共用同樣的下限。

## 常見問題

**一定要用 Claude 嗎？** 不用。技能只是 Markdown 加 Node 腳本，任何會讀 `SKILL.md` 的代理都能用；Codex 會直接讀 `.agents/skills/`。

**可以繼續用 ChatGPT、Gamma 或 Canva 做投影片嗎？** 可以，用 `handoff` 引擎。代理準備好需求書、證據、故事板與講稿，你把 `BUILD-PACKET.md` 貼進工具，匯出的 `.pptx` 再拿回來 QA。只能匯出圖片的工具過不了講稿與可編輯檢查。

**6 頁的進度報告用這套會不會太重？** 用 `fast-track`。關卡照跑，但提問只問一輪，成對的關卡合併記錄。

**中文簡報可以嗎？** 可以。中日韓文字有自己的密度與行長規則，`training-zh-hant` 設定檔涵蓋繁體中文投影片配粵語講稿。

**可以修改我現有的簡報嗎？** 可以。給它 `.pptx`，它會先檢查檔案，再把需求歸類為潤飾、換品牌、翻譯或重組（[`revise-existing.md`](./skills/make-presentation/references/revise-existing.md)）。

## 目錄結構

- `skills/`：可安裝的技能（協調器、八個關卡技能、`genoffice`、提問技能），含參考文件、範本、主題、設定檔與腳本
- `adapters/`：每個引擎一個資料夾
- `examples/`：完整執行範例
- `install.mjs`、`.claude-plugin/`：安裝方式
- `.agents/`：維護者自用的代理設定，不會被安裝（見 [`.agents/README.md`](./.agents/README.md)）

## 致謝

共用實踐（聚焦重播、去 AI 腔、審查分桶、原型擂台、經驗編碼）改編自 [`backnotprop/pstack`](https://github.com/backnotprop/pstack)（MIT）。輪次式提問與 `grill-me`、`grilling`、`to-questionnaire` 技能來自 [`mattpocock/skills`](https://github.com/mattpocock/skills)（MIT）。

## 參與貢獻

見 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。執行測試：

```bash
npm test
```

## 授權

MIT。詳見 [`LICENSE`](./LICENSE)。
