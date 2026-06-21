# agentic-ppt-skills

[English](#english) · [繁體中文](#繁體中文)

---

## English

A portable set of **agent skills** that turn raw materials — a folder of notes, an existing deck, or just an idea — into a finished, stage-ready presentation through a disciplined 8-gate pipeline.

These are agent skills (markdown instructions + a zero-dependency status helper) for coding agents like Claude Code, Cursor, or any tool that loads `.agents/skills/` or `.claude/skills/`. Drop them in and your agent gains a repeatable presentation workflow: **source → product → evidence → story → prototype → stage → delivery**.

> Extracted from the [open-slide](https://github.com/1weiho/open-slide) framework. This repo ships the **presentation pipeline methodology** as standalone skills; the open-slide framework additionally provides the slide-authoring runtime (`create-slide`, `slide-authoring`) these skills are designed to pair with.

### The pipeline

One orchestrator routes eight focused gates, one at a time. Each gate has a single skill, a defined pass condition, and a named artifact.

```
source-intake → product-grill → evidence → story-architecture
      → story-grill → deck-prototype → stage-grill → production-qa
```

| Gate | Skill | Passes when | Produces |
| --- | --- | --- | --- |
| `source-intake` | `presentation-source-intake` | Materials inventoried, authoritative versions known, conflicts explicit | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | Audience, problem, outcome, promise, constraints all explicit | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | Every material claim supported, qualified, moved to notes, or rejected | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | Every chapter advances the outcome; each slide has one job + one message | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | The strongest opposing case considered, story still holds | `GRILL-LOG.md` |
| `deck-prototype` | `presentation-prototype` | Representative pages follow projector-safe typography rules | `slides/<deck-id>/` |
| `stage-grill` | `presentation-stage-grill` | Readable, speakable, timed, defensible, audience-appropriate | `SPEAKER-SCRIPT.md` |
| `production-qa` | `open-slide-deck-finalization` | Works in browser, PDF, and PowerPoint with no material defects | `QA-REPORT.md` + PPTX + PDF |

The orchestrator **never skips ahead** because an artifact exists — it resumes from the earliest unresolved gate, reuses equivalent work, and invalidates downstream gates when an upstream decision changes.

#### Modes

- **`general`** — internal, creative, or low-risk decks. Evidence stays proportionate.
- **`research-enhanced`** — decks with consequential external claims, citations, datasets, statistics, policy, law, medicine, finance. Adds claim safety levels (A/B/C/D), primary-source preference, exact dates/units/denominators, stale-value checks, opposition critique, and per-slide fact checks. Re-evaluated after source intake; upgrading to it automatically invalidates reviewed evidence work.

### Install

```bash
# from the root of any agent-enabled project
cp -r skills/* .agents/skills/
# Claude Code also reads .claude/skills/ — symlink or copy there too if needed
```

The orchestrator lives at `make-presentation`. Once installed, just tell your agent what you want:

> "Make a presentation from the notes in `./research/`."

It will route itself through the gates, writing a `STATUS.md` tracker to `presentation-work/<deck-id>/` as it goes.

#### The status helper

`make-presentation/scripts/status.mjs` is a zero-dependency Node script (Node 18+) that owns the pipeline state machine. Agents call it instead of hand-editing status:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> <mode> "<mode-reason>"
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # earliest unresolved gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
```

It validates gate order, enforces artifact provenance (a passed gate must record real `--artifact` paths), migrates legacy state, and renders both machine-readable JSON and a human-readable table into `STATUS.md`. See `skills/make-presentation/references/status-schema.md` for the full contract.

### Example: `agentic-coding-anatomy`

[`examples/agentic-coding-anatomy/`](./examples/agentic-coding-anatomy) is a **complete end-to-end run** of the pipeline: a short folder of raw notes ("The Anatomy of Agentic Coding") routed all the way through to a passed production-qa gate in `research-enhanced` mode.

Read it to see what each gate actually produces:

```
examples/agentic-coding-anatomy/
├── source/raw_notes.md      # the only input — rough notes + a SWE-bench stat
└── work/                    # everything the pipeline wrote
    ├── STATUS.md            # the tracker — start here: 8 gates, all passed
    ├── SOURCE-INVENTORY.md
    ├── PRESENTATION-BRIEF.md
    ├── EVIDENCE-LEDGER.md   # the SWE-bench 1.96% claim classified to safety level A
    ├── STORY.md
    ├── STORYBOARD.md
    ├── GRILL-LOG.md
    ├── SPEAKER-SCRIPT.md
    └── QA-REPORT.md
```

Verify the example's tracker is schema-valid against the shipped helper:

```bash
node skills/make-presentation/scripts/status.mjs validate examples/agentic-coding-anatomy/work
node skills/make-presentation/scripts/status.mjs next      examples/agentic-coding-anatomy/work   # → "complete"
```

### Relationship to open-slide

This repo is **pipeline methodology only**. Three skills reference open-slide's slide-authoring tools (`slide-authoring`, `create-slide`, `current-slide`) for the prototype and finalization gates — those provide the projector-safe typography rules, the slide component system, and the PPTX/PDF export that `production-qa` verifies. The pipeline still works without them (the story, evidence, and grilling gates are fully self-contained); pairing with open-slide gives you the authored deck and exports.

### License

MIT — same as open-slide. See [LICENSE](./LICENSE).

### Acknowledgements

This pipeline and every skill in it are extracted from [`1weiho/open-slide`](https://github.com/1weiho/open-slide) — "A slide framework built for agents." All credit for the methodology, gate design, and status helper belongs to that project and its author.

The skill-packaging style is also inspired by [`mattpocock/skills`](https://github.com/mattpocock/skills) — "Skills for Real Engineers. Straight from my .claude directory."

---

## 繁體中文

一套可攜的 **agent skill(代理技能)**,把原始素材——一疊筆記、一份現有簡報,或只是一個點子——透過嚴謹的 8 道 gate(關卡)流水線,轉成一份完成、可上台的簡報。

這些是 agent skill(markdown 指令 + 一支零依賴的狀態輔助腳本),適用 Claude Code、Cursor 等任何會載入 `.agents/skills/` 或 `.claude/skills/` 的 coding agent。放進去之後,你的 agent 就多了一套可重複執行的簡報工作流:**素材 → 產品 → 證據 → 故事 → 原型 → 上台 → 交付**。

> 從 [open-slide](https://github.com/1weiho/open-slide) 框架抽出。本 repo 只放**簡報流水線方法論**這套獨立 skill;open-slide 框架另外提供這些 skill 設計搭配的簡報編寫 runtime(`create-slide`、`slide-authoring`)。

### 流水線

一個 orchestrator(路由器)一次只推進一道 gate。每道 gate 對應一個 skill、一個明確的通過條件、一個產出檔案。

```
source-intake → product-grill → evidence → story-architecture
      → story-grill → deck-prototype → stage-grill → production-qa
```

| Gate | Skill | 通過條件 | 產出 |
| --- | --- | --- | --- |
| `source-intake` | `presentation-source-intake` | 素材已盤點、權威版本已知、衝突已標明 | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | 聽眾、問題、成果、承諾、限制全部明確 | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | 每個重要主張都有支撐、有限制、移到備註,或被否決 | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | 每章都推進聽眾改變;每張投影片一個任務 + 一個訊息 | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | 已考慮最強的反方意見,故事仍站得住 | `GRILL-LOG.md` |
| `deck-prototype` | `presentation-prototype` | 代表性頁面符合投影機安全的排版規則 | `slides/<deck-id>/` |
| `stage-grill` | `presentation-stage-grill` | 易讀、可講、計時合理、站得住、適合聽眾 | `SPEAKER-SCRIPT.md` |
| `production-qa` | `open-slide-deck-finalization` | 在瀏覽器、PDF、PowerPoint 都正常,無實質瑕疵 | `QA-REPORT.md` + PPTX + PDF |

Orchestrator **不會因為某個產出已存在就跳過**——它從最早未解決的 gate 繼續,重用等效成果,並在 upstream 決定改變時把 downstream 的 gate 設為失效。

#### 模式

- **`general`**——內部、創意或低風險簡報。證據保持適度即可。
- **`research-enhanced`**——含重要外部主張、引用、資料集、統計、政策、法律、醫學、財務的簡報。額外加 claim 安全等級(A/B/C/D)、偏好一手來源、精確日期/單位/分母、過時值檢查、反方審視、每張投影片事實查核。在 source intake 後會重新評估;升級至此模式會自動讓已審查的證據工作失效。

### 安裝

```bash
# 在任何支援 agent 的專案根目錄下
cp -r skills/* .agents/skills/
# Claude Code 也會讀 .claude/skills/——需要的話 symlink 或再複製一份過去
```

Orchestrator 是 `make-presentation`。安裝好後,直接告訴 agent 你要什麼:

> 「用 `./research/` 裡的筆記做一份簡報。」

它會自己照 gate 跑,過程中把追蹤用的 `STATUS.md` 寫進 `presentation-work/<deck-id>/`。

#### 狀態輔助腳本

`make-presentation/scripts/status.mjs` 是一支零依賴的 Node 腳本(Node 18+),負責整個流水線的狀態機。agent 呼叫它,而不是手改狀態:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> <mode> "<mode-reason>"
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # 最早未解決的 gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
```

它會驗證 gate 順序、強制產出溯源(通過的 gate 必須記錄真實的 `--artifact` 路徑)、遷移舊版狀態,並把機器可讀的 JSON 與人可讀的表格一起寫進 `STATUS.md`。完整契約見 `skills/make-presentation/references/status-schema.md`。

### 範例:`agentic-coding-anatomy`

[`examples/agentic-coding-anatomy/`](./examples/agentic-coding-anatomy) 是**一次完整的端到端實跑**:一份簡短的原始筆記("The Anatomy of Agentic Coding")在 `research-enhanced` 模式下,一路跑到 production-qa 通過。

看它就能了解每道 gate 實際產出什麼:

```
examples/agentic-coding-anatomy/
├── source/raw_notes.md      # 唯一輸入——草稿筆記 + 一個 SWE-bench 數字
└── work/                    # 流水線寫出的所有東西
    ├── STATUS.md            # 追蹤檔——從這裡開始讀:8 道 gate 全過
    ├── SOURCE-INVENTORY.md
    ├── PRESENTATION-BRIEF.md
    ├── EVIDENCE-LEDGER.md   # SWE-bench 1.96% 主張被歸為安全等級 A
    ├── STORY.md
    ├── STORYBOARD.md
    ├── GRILL-LOG.md
    ├── SPEAKER-SCRIPT.md
    └── QA-REPORT.md
```

用隨附的輔助腳本驗證範例的追蹤檔是否符合 schema:

```bash
node skills/make-presentation/scripts/status.mjs validate examples/agentic-coding-anatomy/work
node skills/make-presentation/scripts/status.mjs next      examples/agentic-coding-anatomy/work   # → "complete"
```

### 與 open-slide 的關係

本 repo **只放流水線方法論**。其中三個 skill 會引用 open-slide 的簡報編寫工具(`slide-authoring`、`create-slide`、`current-slide`)來做原型與收尾 gate——那些工具提供投影機安全的排版規則、投影片元件系統,以及 `production-qa` 要驗證的 PPTX/PDF 匯出。沒有它們,流水線仍可運作(故事、證據、各種 grill gate 完全自足);搭配 open-slide 才會得到實際編寫好的投影片與匯出檔。

### 授權

MIT——與 open-slide 相同。見 [LICENSE](./LICENSE)。

### 銘謝

本流水線與其中每一個 skill,皆取自 [`1weiho/open-slide`](https://github.com/1weiho/open-slide)——「A slide framework built for agents.」。方法論、gate 設計與狀態輔助腳本的功勞,全歸該專案與其作者。

skill 的封裝風格亦受 [`mattpocock/skills`](https://github.com/mattpocock/skills)——「Skills for Real Engineers. Straight from my .claude directory.」——啟發。
