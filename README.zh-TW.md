# agentic-ppt-skills

[English](./README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md)

與簡報引擎無關的代理技能，能將筆記、既有簡報或想法，轉化為完成且適合上台發表的簡報。

## 使用者指南

本儲存庫提供八個關卡的工作流程：

```text
來源 → 產品 → 證據 → 故事 → 原型 → 上台 → 交付
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

流程支援 `general` 與 `research-enhanced` 模式。原型與生產環境 QA 使用
adapter；內含 `open-slide`、`marp` 與 `pptxgenjs`。

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

- `skills/` — 可發佈、與引擎無關的技能
- `adapters/` — 各引擎的原型與匯出指示
- `examples/` — 完整的流程執行範例
- `.agents/` — 內含的開發與參考副本

## AI 代理指南

代理的操作安裝與執行指示位於 [`AGENTS.md`](./AGENTS.md)。開始安裝或執行流程前請先閱讀。個別
`SKILL.md` 檔案是各關卡執行的唯一真實來源。

## 授權

MIT。詳見 [`LICENSE`](./LICENSE)。
