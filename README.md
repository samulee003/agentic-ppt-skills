# agentic-ppt-skills

[English](#english) · [繁體中文](#繁體中文)

---

## English

An **engine-agnostic** set of agent skills that turn raw materials — a folder of notes, an existing deck, or just an idea — into a finished, stage-ready presentation through a disciplined 8-gate pipeline. Plug in any slide engine; [open-slide](https://github.com/1weiho/open-slide) ships as the reference adapter.

These are agent skills (markdown instructions + a zero-dependency status helper) for coding agents like Claude Code, Cursor, Codex, or any tool that loads `.agents/skills/` or `.claude/skills/`. Drop them in and your agent gains a repeatable presentation workflow: **source → product → evidence → story → prototype → stage → delivery**.

> The pipeline methodology and every skill are extracted from [`1weiho/open-slide`](https://github.com/1weiho/open-slide). See [Acknowledgements](#acknowledgements). open-slide is also the first engine adapter — but the pipeline itself no longer depends on it.

### Repo layout

```
skills/        9 engine-agnostic gate skills + the orchestrator + a zero-dep status helper
adapters/      engine-specific rules for the two gates that render/export
  open-slide/  the reference adapter (canvas, PPTX/PDF export, PowerPoint QA)
examples/      a complete end-to-end pipeline run, produced with the open-slide adapter
```

### The pipeline

One orchestrator (`make-presentation`) routes eight focused gates, one at a time. Each gate has a single skill, a defined pass condition, and a named artifact. Gates 1–5 and 7 are fully engine-agnostic; gates 6 (`deck-prototype`) and 8 (`production-qa`) render and export, so they defer engine specifics to an [adapter](#engines).

```
source-intake → product-grill → evidence → story-architecture
      → story-grill → deck-prototype → stage-grill → production-qa
                                              (engine)      (engine)
```

| Gate | Skill | Passes when | Produces |
| --- | --- | --- | --- |
| `source-intake` | `presentation-source-intake` | Materials inventoried, authoritative versions known, conflicts explicit | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | Audience, problem, outcome, promise, constraints all explicit | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | Every material claim supported, qualified, moved to notes, or rejected | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | Every chapter advances the outcome; each slide has one job + one message | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | The strongest opposing case considered, story still holds | `GRILL-LOG.md` |
| `deck-prototype` ⚙ | `presentation-prototype` | Representative pages follow projector-safe typography; engine chosen | deck prototype in the chosen engine |
| `stage-grill` | `presentation-stage-grill` | Readable, speakable, timed, defensible, audience-appropriate | `SPEAKER-SCRIPT.md` |
| `production-qa` ⚙ | `presentation-deck-qa` | Works across the engine's preview and exports with no material defects | `QA-REPORT.md` + exports |

⚙ = engine-dependent; reads `adapters/<engine>/`. The orchestrator **never skips ahead** — it resumes from the earliest unresolved gate, reuses equivalent work, and invalidates downstream gates when an upstream decision changes.

#### Modes

- **`general`** — internal, creative, or low-risk decks. Evidence stays proportionate.
- **`research-enhanced`** — decks with consequential external claims, citations, datasets, statistics, policy, law, medicine, finance. Adds claim safety levels (A/B/C/D), primary-source preference, exact dates/units/denominators, stale-value checks, opposition critique, and per-slide fact checks.

### Engines

Gates 6 and 8 need a **slide engine** to render and export. The pipeline is engine-agnostic by design:

- At the prototype gate, the agent asks the user which engine to use (one question, with a recommended default), records the choice in `PRESENTATION-BRIEF.md`, and reads `adapters/<engine>/prototype.md` for that engine's authoring rules.
- The deck-qa gate reads the recorded engine and follows `adapters/<engine>/qa.md` for its preview surface and export steps.
- The bundled reference adapter is **`open-slide`** — [the slide framework built for agents](https://github.com/1weiho/open-slide): a 1920×1080 React canvas, an in-browser inspector, and visual-faithful PPTX + PDF export.

To add another engine (Marp, reveal.js, PptxGenJS, a proprietary template…), create `adapters/<engine>/` with a `prototype.md` and a `qa.md` describing that engine's authoring contract, preview surface, and exports. The pipeline skills pick it up automatically — no orchestrator changes needed.

### Install

```bash
# from the root of any agent-enabled project
cp -r skills/* .agents/skills/
cp -r adapters .agents/          # adapters live next to skills
# Claude Code also reads .claude/skills/ — symlink or copy there too if needed
```

The orchestrator lives at `make-presentation`. Once installed, tell your agent what you want:

> "Make a presentation from the notes in `./research/`."

It routes itself through the gates, asking for the engine when it reaches the prototype gate, and writes a `STATUS.md` tracker to `presentation-work/<deck-id>/`.

#### The status helper

`make-presentation/scripts/status.mjs` is a zero-dependency Node script (Node 18+) that owns the pipeline state machine. Agents call it instead of hand-editing status:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> <mode> "<mode-reason>"
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # earliest unresolved gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
```

It validates gate order, enforces artifact provenance, migrates legacy state, and renders both machine-readable JSON and a human-readable table into `STATUS.md`. Artifact paths are opaque to the helper — whatever the chosen engine exports goes in the same slots.

### Example: `agentic-coding-anatomy`

[`examples/agentic-coding-anatomy/`](./examples/agentic-coding-anatomy) is a **complete end-to-end run**, produced with the **open-slide adapter**. It shows what each gate produces — including the engine-specific artifacts at gates 6 and 8 (`index.tsx`, `.pptx`, `.pdf`). Verify its tracker against the shipped helper:

```bash
node skills/make-presentation/scripts/status.mjs validate examples/agentic-coding-anatomy/work   # → "validate ok"
node skills/make-presentation/scripts/status.mjs next      examples/agentic-coding-anatomy/work   # → "complete"
```

### License

MIT. See [LICENSE](./LICENSE).

### Acknowledgements

This pipeline and every skill in it are extracted from [`1weiho/open-slide`](https://github.com/1weiho/open-slide) — "the slide framework built for agents." All credit for the methodology, gate design, and status helper belongs to that project and its author. open-slide is also the reference engine adapter shipped here.

The grilling methodology behind the `product-grill`, `story-grill`, and `stage-grill` gates — one-question-at-a-time alignment interviews that close the gap between you and the agent — is inspired by [`mattpocock/skills`](https://github.com/mattpocock/skills) ("Skills For Real Engineers"), and its `/grill-me` and `/grill-with-docs` skills in particular.

---

## 繁體中文

一套**引擎無關**的 agent skill(代理技能),把原始素材——一疊筆記、一份現有簡報,或只是一個點子——透過嚴謹的 8 道 gate(關卡)流水線,轉成一份完成、可上台的簡報。可接任意投影片引擎;[open-slide](https://github.com/1weiho/open-slide) 作為參考 adapter 隨附附上。

這些是 agent skill(markdown 指令 + 一支零依賴的狀態輔助腳本),適用 Claude Code、Cursor、Codex 等任何會載入 `.agents/skills/` 或 `.claude/skills/` 的 coding agent。放進去之後,你的 agent 就多了一套可重複執行的簡報工作流:**素材 → 產品 → 證據 → 故事 → 原型 → 上台 → 交付**。

> 本流水線方法論與其中每一個 skill,皆取自 [`1weiho/open-slide`](https://github.com/1weiho/open-slide)。見[銘謝](#銘謝)。open-slide 同時也是本 repo 附的第一個引擎 adapter——但 pipeline 本身已不再依賴它。

### Repo 結構

```
skills/        9 個引擎無關 gate skill + orchestrator + 零依賴狀態輔助腳本
adapters/      兩道「渲染/匯出」gate 的引擎專屬規則
  open-slide/  參考 adapter(畫布、PPTX/PDF 匯出、PowerPoint QA)
examples/      一次完整的端到端 pipeline 實跑,用 open-slide adapter 產生
```

### 流水線

一個 orchestrator(`make-presentation`)一次只推進一道 gate。每道 gate 對應一個 skill、一個明確通過條件、一個產出檔案。Gate 1–5 和 7 完全引擎無關;gate 6(`deck-prototype`)和 8(`production-qa`)需要渲染與匯出,所以引擎細節交給 [adapter](#引擎)。

```
source-intake → product-grill → evidence → story-architecture
      → story-grill → deck-prototype → stage-grill → production-qa
                                              (引擎)          (引擎)
```

| Gate | Skill | 通過條件 | 產出 |
| --- | --- | --- | --- |
| `source-intake` | `presentation-source-intake` | 素材已盤點、權威版本已知、衝突已標明 | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | 聽眾、問題、成果、承諾、限制全部明確 | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | 每個重要主張都有支撐、有限制、移到備註,或被否決 | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | 每章都推進聽眾改變;每張投影片一個任務 + 一個訊息 | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | 已考慮最強的反方意見,故事仍站得住 | `GRILL-LOG.md` |
| `deck-prototype` ⚙ | `presentation-prototype` | 代表性頁面符合投影機安全排版;已選定引擎 | 所選引擎裡的 deck 原型 |
| `stage-grill` | `presentation-stage-grill` | 易讀、可講、計時合理、站得住、適合聽眾 | `SPEAKER-SCRIPT.md` |
| `production-qa` ⚙ | `presentation-deck-qa` | 在引擎的預覽與匯出格式都正常,無實質瑕疵 | `QA-REPORT.md` + 匯出檔 |

⚙ = 引擎相關;讀 `adapters/<engine>/`。Orchestrator **不會因為某個產出已存在就跳過**——它從最早未解決的 gate 繼續,重用等效成果,並在 upstream 決定改變時把 downstream 的 gate 設為失效。

#### 模式

- **`general`**——內部、創意或低風險簡報。證據保持適度即可。
- **`research-enhanced`**——含重要外部主張、引用、資料集、統計、政策、法律、醫學、財務的簡報。額外加 claim 安全等級(A/B/C/D)、偏好一手來源、精確日期/單位/分母、過時值檢查、反方審視、每張投影片事實查核。

### 引擎

Gate 6 和 8 需要**投影片引擎**來渲染與匯出。Pipeline 刻意設計成引擎無關:

- 進到 prototype gate 時,agent 會問使用者用哪個引擎(一次一題,附建議預設),把選擇記進 `PRESENTATION-BRIEF.md`,並讀 `adapters/<engine>/prototype.md` 取得該引擎的編寫規則。
- deck-qa gate 讀取已記錄的引擎,並依 `adapters/<engine>/qa.md` 跑預覽與匯出。
- 隨附的參考 adapter 是 **`open-slide`**——[the slide framework built for agents](https://github.com/1weiho/open-slide):1920×1080 React 畫布、瀏覽器 inspector、visual-faithful PPTX + PDF 匯出。

要加別的引擎(Marp、reveal.js、PptxGenJS、公司專屬樣板⋯⋯),在 `adapters/<engine>/` 下放一份 `prototype.md` 和 `qa.md`,描述該引擎的編寫契約、預覽介面與匯出。Pipeline skill 會自動讀取——不用改 orchestrator。

### 安裝

```bash
# 在任何支援 agent 的專案根目錄下
cp -r skills/* .agents/skills/
cp -r adapters .agents/          # adapters 與 skills 並存
# Claude Code 也會讀 .claude/skills/——需要的話 symlink 或再複製一份過去
```

Orchestrator 是 `make-presentation`。安裝好後,告訴 agent 你要什麼:

> 「用 `./research/` 裡的筆記做一份簡報。」

它會自己照 gate 跑,到 prototype gate 時問你用哪個引擎,過程中把追蹤用的 `STATUS.md` 寫進 `presentation-work/<deck-id>/`。

#### 狀態輔助腳本

`make-presentation/scripts/status.mjs` 是一支零依賴的 Node 腳本(Node 18+),負責整個流水線的狀態機。agent 呼叫它,而不是手改狀態:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> <mode> "<mode-reason>"
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # 最早未解決的 gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
```

它會驗證 gate 順序、強制產出溯源、遷移舊版狀態,並把機器可讀的 JSON 與人可讀的表格一起寫進 `STATUS.md`。Artifact 路徑對腳本是不透明字串——所選引擎匯出什麼,就填進同樣的欄位。

### 範例:`agentic-coding-anatomy`

[`examples/agentic-coding-anatomy/`](./examples/agentic-coding-anatomy) 是**一次完整的端到端實跑**,用 **open-slide adapter** 產生。它展示每道 gate 實際產出什麼——包括 gate 6 和 8 的引擎專屬產出(`index.tsx`、`.pptx`、`.pdf`)。用隨附腳本驗證它的追蹤檔:

```bash
node skills/make-presentation/scripts/status.mjs validate examples/agentic-coding-anatomy/work   # → "validate ok"
node skills/make-presentation/scripts/status.mjs next      examples/agentic-coding-anatomy/work   # → "complete"
```

### 授權

MIT。見 [LICENSE](./LICENSE)。

### 銘謝

本流水線與其中每一個 skill,皆取自 [`1weiho/open-slide`](https://github.com/1weiho/open-slide)——「the slide framework built for agents」。方法論、gate 設計與狀態輔助腳本的功勞,全歸該專案與其作者。open-slide 同時也是本 repo 附的參考引擎 adapter。

`product-grill`、`story-grill`、`stage-grill` 三道 gate 背後的「grilling(逐一逼問)」方法——透過一次一題的對齊訪談,拉近你與 agent 之間的認知落差——受 [`mattpocock/skills`](https://github.com/mattpocock/skills)(「Skills For Real Engineers」)啟發,尤其是其中的 `/grill-me` 與 `/grill-with-docs` 兩個 skill。
