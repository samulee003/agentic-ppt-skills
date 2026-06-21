# agentic-ppt-skills

[English](#english) · [繁體中文](#繁體中文) · [For AI agents (EN)](#for-ai-agents) · [給 AI Agent (繁中)](#給-ai-agent繁中版)

---

## For AI agents

> **You are an AI agent and a user pointed you at this repo. Follow these instructions exactly.** This section is written for you. Do not paraphrase it; do not improvise. If anything here conflicts with the skill files under `skills/`, the skill files win for *how* a gate runs — this section only governs *installation* and *invocation*.

### 1. Detect the host environment

Before installing, determine where this agent session runs:

- **If you are operating inside a user's project repo** (you can run `git rev-parse --show-toplevel` and it returns a real repo, and that repo is the user's project — not a clone of *this* skills repo), install there. That project becomes the deck workspace.
- **If you are in a scratch / no-repo / sandbox environment**, or the only repo present is this skills repo itself, create a fresh folder for the deck and install there. Tell the user the path you chose.
- If both `.agents/skills/` and `.claude/skills/` already exist and contain a *different* `make-presentation/SKILL.md`, **stop and ask the user** which to target — do not overwrite silently.
- Pick the skill directory your runtime reads: `.agents/skills/` (most runtimes) or `.claude/skills/` (Claude Code's native path). If you target Claude Code, install to `.claude/skills/` (and `.claude/adapters/`); otherwise use `.agents/skills/` + `.agents/adapters/`. Pick one and copy both skills and adapters there. Do not symlink (behaviour differs across platforms).

### 2. Install the skills and adapters

Run these from the install root (the repo or folder from step 1). First find the source path of this repo (do not assume it is `./agentic-ppt-skills` — the user may have cloned or copied it under any name):

```bash
# adjust SRC to wherever this repo actually lives
SRC="./agentic-ppt-skills"
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

Verify the install before proceeding — every line must print its message and Node must be ≥ 18:

```bash
node --version                                                  # must be v18 or higher
test -f .agents/skills/make-presentation/SKILL.md && echo "orchestrator present"
test -f .agents/skills/make-presentation/scripts/status.mjs && echo "status helper present"
node .agents/skills/make-presentation/scripts/status.mjs 2>&1 | head -1   # prints an "error: Expected command..." line and exits non-zero — that means it ran fine
ls .agents/adapters/open-slide/                                            # must list README.md, prototype.md, qa.md
```

If Node is missing or below v18, or any file check fails, **stop and report the failure to the user** — do not attempt a partial install.

### 3. Ask the user for the inputs you actually need

Before starting the pipeline, ask one question (with a recommended default) and wait for the answer:

> **What's the source for this presentation?** It can be a folder of notes, an existing deck file, a URL, or just a topic. Default: I'll use the notes in the current folder.

Record the answer. Do not start building until the user replies. You do **not** need to ask about the pipeline `mode` (`general` vs `research-enhanced`) or the engine up front — `init` defaults to `general` with no reason required, the mode is (re)evaluated after the source-intake gate, and the engine is chosen at the prototype gate.

### 4. Initialise the tracker and invoke the orchestrator

Initialise the status tracker first. `mode` and `mode-reason` are optional — omit them unless you already know the deck is research-enhanced:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init presentation-work/<deck-id> <deck-id> <source-root>
```

`STATUS.md` lives at `presentation-work/<deck-id>/STATUS.md`. Every status-helper command takes that folder as its `<work-root>` — always pass the full `presentation-work/<deck-id>` path, never the parent or `.`.

Then load `.agents/skills/make-presentation/SKILL.md` and follow it. It is the single entry point. Key rules the orchestrator enforces — respect them, do not shortcut:

- **Run one gate at a time, in order.** Never jump ahead. The next gate is whichever the status helper reports as unresolved; get it with:
  ```bash
  node .agents/skills/make-presentation/scripts/status.mjs next presentation-work/<deck-id>
  ```
- **Never hand-edit `STATUS.md`.** Always go through the status helper (`init` / `next` / `result` / `invalidate` / `set-mode` / `set-engine`). It validates gate order and artifact provenance; hand-editing silently breaks the pipeline.
- **Do not decide the engine yourself.** The prototype gate (`deck-prototype`) and the qa gate (`production-qa`) need a slide engine. When you reach the prototype gate, ask the user which engine to use (recommended default: `open-slide`), record it via `node .../status.mjs set-engine presentation-work/<deck-id> <engine>` and add an `## Engine` line to `PRESENTATION-BRIEF.md`, then read `.agents/adapters/<engine>/README.md` and `prototype.md`. If the user names an engine with no adapter folder, stop and tell them — do not guess.

### 5. What each gate produces (the agent's contract)

| Gate | Skill to invoke | Must produce |
| --- | --- | --- |
| `source-intake` | `presentation-source-intake` | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | `GRILL-LOG.md` |
| `deck-prototype` ⚙ | `presentation-prototype` | deck prototype in the chosen engine |
| `stage-grill` | `presentation-stage-grill` | `SPEAKER-SCRIPT.md` (+ appends to `GRILL-LOG.md`) |
| `production-qa` ⚙ | `presentation-deck-qa` | `QA-REPORT.md` + exports |

⚙ gates read `.agents/adapters/<engine>/`. Mark a gate passed only via the helper, with real `--artifact` paths.

### 6. When you're done

When `status.mjs next presentation-work/<deck-id>` reports `complete`, give the user:
- the path to `STATUS.md`,
- the path to every exported file (PPTX, PDF, etc.),
- and the pipeline's work folder (`presentation-work/<deck-id>/`).

Do not claim success unless `next` reports `complete`. If a gate failed or is unresolved, say so plainly.

### 7. Hard limits — do not violate

- The status helper is **zero-dependency** — never install `node_modules` or packages *for it*. This ban does **not** apply to the slide engine itself: if the user picks `open-slide`, scaffolding its workspace (`npx @open-slide/cli init`, its `pnpm dev`, etc.) is expected and allowed.
- Do not edit files under `.agents/skills/` or `.agents/adapters/` — they are read-only.
- Do not skip evidence, readability, or export checks "to save time". The orchestrator forbids it under deadline pressure.
- If you cannot determine the host environment or a check fails, stop and ask — do not guess.

---

## English

An **engine-agnostic** set of agent skills that turn raw materials — a folder of notes, an existing deck, or just an idea — into a finished, stage-ready presentation through a disciplined 8-gate pipeline. Plug in any slide engine; [open-slide](https://github.com/1weiho/open-slide) ships as the reference adapter.

These are agent skills (markdown instructions + a zero-dependency status helper) for coding agents like Claude Code, Cursor, Codex, or any tool that loads `.agents/skills/` or `.claude/skills/`. Drop them in and your agent gains a repeatable presentation workflow: **source → product → evidence → story → prototype → stage → delivery**.

> The pipeline methodology and every skill are extracted from [`1weiho/open-slide`](https://github.com/1weiho/open-slide). See [Acknowledgements](#acknowledgements). open-slide is also the first engine adapter — but the pipeline itself no longer depends on it.

### Repo layout

```
skills/        8 engine-agnostic gate skills + the orchestrator + a zero-dep status helper
adapters/      engine-specific rules for the two gates that render/export
  open-slide/  React canvas + in-browser inspector; visual-faithful PPTX/PDF via dev-server UI
  marp/        Markdown → slides; CLI export (pptx/pdf/html)
  pptxgenjs/   Node script → native-shape PPTX; no browser needed
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

Gates 6 and 8 need a **slide engine** to render and export. The pipeline is engine-agnostic by design: at the prototype gate the agent asks which engine to use, records it via `status.mjs set-engine` and in `PRESENTATION-BRIEF.md`, then reads `adapters/<engine>/`. The deck-qa gate inherits the choice. Three adapters ship:

| Adapter | Real slide source | Live review | Export | Best for |
| --- | --- | --- | --- | --- |
| [`open-slide`](./adapters/open-slide) | `slides/<id>/index.tsx` (React) | dev-server canvas + in-browser inspector | visual-faithful PPTX + PDF (dev-server UI) | highest visual quality; user wants the inspector loop |
| [`marp`](./adapters/marp) | `slides/<id>.md` (Markdown) | rendered HTML | **CLI**: `marp deck.md -o deck.pptx` | lightest weight; agent can't drive a browser; fastest path |
| [`pptxgenjs`](./adapters/pptxgenjs) | `slides/<id>/build.mjs` (Node script) | the produced PPTX itself | `node build.mjs` → native-shape PPTX | deliverable must be fully-editable native PowerPoint; no browser |

To add another engine (reveal.js, a proprietary template…), create `adapters/<engine>/` with a `README.md`, `prototype.md`, and `qa.md` describing that engine's prerequisites, authoring contract, preview surface, and exports. The pipeline skills pick it up automatically — no orchestrator changes needed.

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
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> [mode] ["<mode-reason>"]
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # earliest unresolved gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-engine <work-root> <engine>     # record engine at the deck-prototype gate
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

## 給 AI Agent(繁中版)

> **你是 AI agent,使用者把這個 repo 丟給你了。請嚴格照下面指令做。** 這一段是寫給你看的——不要改寫、不要自由發揮。如果這段跟 `skills/` 底下的 skill 檔案有衝突,以 skill 檔案為準(它管「gate 怎麼跑」),這段只管「安裝」和「啟動」。

### 1. 偵測執行環境

安裝前,先判斷你現在跑在哪裡:

- **如果你在使用者的專案 repo 裡**(執行 `git rev-parse --show-toplevel` 會回傳一個真實 repo,而且那是使用者的專案——不是這個 skills repo 的 clone),就裝在那裡。那個專案會成為簡報的工作區。
- **如果是臨時環境 / 沒有 repo / 沙盒**,或唯一的 repo 就是這個 skills repo 本身,就建一個新資料夾來裝,並告訴使用者你選的路徑。
- 如果 `.agents/skills/` 跟 `.claude/skills/` 都已存在,且裡面有一份*不同*的 `make-presentation/SKILL.md`,**停下來問使用者**要裝哪邊——不要默默覆蓋。
- 選擇你的 runtime 會讀的 skill 目錄:`.agents/skills/`(多數 runtime)或 `.claude/skills/`(Claude Code 原生路徑)。用 Claude Code 就裝到 `.claude/skills/`(與 `.claude/adapters/`);否則用 `.agents/skills/` + `.agents/adapters/`。選定一邊,skills 與 adapters 都複製過去。不要用 symlink(跨平台行為不一)。

### 2. 安裝 skills 與 adapters

在步驟 1 選的根目錄下執行。先找出這個 repo 的來源路徑(不要假設是 `./agentic-ppt-skills`——使用者可能用任何名字 clone 或複製):

```bash
# 把 SRC 改成這個 repo 實際所在位置
SRC="./agentic-ppt-skills"
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

裝完先驗證,再繼續——每一行都要印出訊息,且 Node 要 ≥ 18:

```bash
node --version                                                  # 必須是 v18 以上
test -f .agents/skills/make-presentation/SKILL.md && echo "orchestrator present"
test -f .agents/skills/make-presentation/scripts/status.mjs && echo "status helper present"
node .agents/skills/make-presentation/scripts/status.mjs 2>&1 | head -1   # 會印一行 "error: Expected command..." 並以非零結束——這代表它正常運作
ls .agents/adapters/open-slide/                                            # 要列出 README.md, prototype.md, qa.md
```

Node 不存在、低於 v18、或任何檔案檢查失敗,**停下來回報給使用者**——不要嘗試半成品安裝。

### 3. 問使用者你需要的輸入

啟動 pipeline 前,問一個問題(附建議預設),等他回答:

> **這份簡報的素材來源是什麼?** 可以是一疊筆記、一份現有簡報檔、一個網址,或只是一個主題。預設:我用目前資料夾裡的筆記。

記下答案。使用者回答前不要開始做。你**不需要**事先問 pipeline `mode`(`general` 或 `research-enhanced`)或引擎——`init` 預設就是 `general` 且不必給理由,mode 會在 source-intake gate 之後(重新)評估,引擎則在 prototype gate 選。

### 4. 初始化追蹤檔並啟動 orchestrator

先初始化狀態追蹤檔。`mode` 與 `mode-reason` 是選填的——除非你已確定這份是 research-enhanced,否則省略:

```bash
node .agents/skills/make-presentation/scripts/status.mjs init presentation-work/<deck-id> <deck-id> <source-root>
```

`STATUS.md` 在 `presentation-work/<deck-id>/STATUS.md`。每個狀態腳本指令都拿那個資料夾當 `<work-root>`——永遠傳完整的 `presentation-work/<deck-id>` 路徑,不要傳上層或 `.`。

接著載入 `.agents/skills/make-presentation/SKILL.md` 並照它做。它是唯一入口。orchestrator 強制的規則——要遵守,不能抄捷徑:

- **一次只跑一道 gate,照順序。** 絕不跳過。下一道 gate 是狀態腳本回報「未解決」的那道,用以下指令查:
  ```bash
  node .agents/skills/make-presentation/scripts/status.mjs next presentation-work/<deck-id>
  ```
- **絕不手改 `STATUS.md`。** 一律透過狀態腳本(`init` / `next` / `result` / `invalidate` / `set-mode` / `set-engine`)。它會驗證 gate 順序與產出溯源;手改會悄悄弄壞 pipeline。
- **不要自己決定引擎。** prototype gate(`deck-prototype`)和 qa gate(`production-qa`)需要投影片引擎。走到 prototype gate 時,問使用者用哪個引擎(建議預設:`open-slide`),用 `node .../status.mjs set-engine presentation-work/<deck-id> <engine>` 記錄,並在 `PRESENTATION-BRIEF.md` 加一行 `## Engine`,再讀 `.agents/adapters/<engine>/README.md` 與 `prototype.md`。如果使用者指定了一個沒有 adapter 資料夾的引擎,停下來告訴他——不要猜。

### 5. 每道 gate 的產出(agent 的契約)

| Gate | 要呼叫的 skill | 必須產出 |
| --- | --- | --- |
| `source-intake` | `presentation-source-intake` | `SOURCE-INVENTORY.md` |
| `product-grill` | `presentation-product-grill` | `PRESENTATION-BRIEF.md` |
| `evidence` | `presentation-evidence` | `EVIDENCE-LEDGER.md` |
| `story-architecture` | `presentation-story-architecture` | `STORY.md` + `STORYBOARD.md` |
| `story-grill` | `presentation-story-grill` | `GRILL-LOG.md` |
| `deck-prototype` ⚙ | `presentation-prototype` | 所選引擎裡的 deck 原型 |
| `stage-grill` | `presentation-stage-grill` | `SPEAKER-SCRIPT.md`(並附加到 `GRILL-LOG.md`) |
| `production-qa` ⚙ | `presentation-deck-qa` | `QA-REPORT.md` + 匯出檔 |

⚙ gate 會讀 `.agents/adapters/<engine>/`。一道 gate 只有透過腳本、附真實 `--artifact` 路徑,才能標成 passed。

### 6. 做完時

當 `status.mjs next presentation-work/<deck-id>` 回報 `complete`,給使用者:
- `STATUS.md` 的路徑,
- 每一個匯出檔(PPTX、PDF 等)的路徑,
- pipeline 的工作資料夾(`presentation-work/<deck-id>/`)。

`next` 沒回報 `complete`,就不要宣稱成功。若有 gate 失敗或未解決,老實說。

### 7. 硬性限制——不可違反

- 狀態腳本**零依賴**——絕不要為它安裝 `node_modules` 或套件。這條禁令**不適用**於投影片引擎本身:如果使用者選 `open-slide`,scaffold 它的工作區(`npx @open-slide/cli init`、它的 `pnpm dev` 等)是預期內且允許的。
- 不要編輯 `.agents/skills/` 或 `.agents/adapters/` 底下的檔案——它們是唯讀。
- 不要「為了省時間」跳過證據、可讀性或匯出檢查。orchestrator 在期限壓力下也明文禁止。
- 判斷不出執行環境或任何檢查失敗時,停下來問——不要猜。

---

## 繁體中文

一套**引擎無關**的 agent skill(代理技能),把原始素材——一疊筆記、一份現有簡報,或只是一個點子——透過嚴謹的 8 道 gate(關卡)流水線,轉成一份完成、可上台的簡報。可接任意投影片引擎;[open-slide](https://github.com/1weiho/open-slide) 作為參考 adapter 隨附附上。

這些是 agent skill(markdown 指令 + 一支零依賴的狀態輔助腳本),適用 Claude Code、Cursor、Codex 等任何會載入 `.agents/skills/` 或 `.claude/skills/` 的 coding agent。放進去之後,你的 agent 就多了一套可重複執行的簡報工作流:**素材 → 產品 → 證據 → 故事 → 原型 → 上台 → 交付**。

> 本流水線方法論與其中每一個 skill,皆取自 [`1weiho/open-slide`](https://github.com/1weiho/open-slide)。見[銘謝](#銘謝)。open-slide 同時也是本 repo 附的第一個引擎 adapter——但 pipeline 本身已不再依賴它。

### Repo 結構

```
skills/        8 個引擎無關 gate skill + orchestrator + 零依賴狀態輔助腳本
adapters/      兩道「渲染/匯出」gate 的引擎專屬規則
  open-slide/  React 畫布 + 瀏覽器 inspector;visual-faithful PPTX/PDF(dev-server UI)
  marp/        Markdown → 投影片;CLI 匯出(pptx/pdf/html)
  pptxgenjs/   Node 腳本 → 原生形狀 PPTX;免瀏覽器
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

Gate 6 和 8 需要**投影片引擎**來渲染與匯出。Pipeline 刻意設計成引擎無關:進到 prototype gate 時,agent 問使用者用哪個引擎,用 `status.mjs set-engine` 記錄並寫進 `PRESENTATION-BRIEF.md`,再讀 `adapters/<engine>/`。deck-qa gate 繼承這個選擇。隨附三個 adapter:

| Adapter | 真實投影片來源 | 預覽 | 匯出 | 適合 |
| --- | --- | --- | --- | --- |
| [`open-slide`](./adapters/open-slide) | `slides/<id>/index.tsx`(React) | dev-server 畫布 + 瀏覽器 inspector | visual-faithful PPTX + PDF(dev-server UI) | 畫質最高;使用者要 inspector 編輯迴圈 |
| [`marp`](./adapters/marp) | `slides/<id>.md`(Markdown) | 渲染出的 HTML | **CLI**:`marp deck.md -o deck.pptx` | 最輕量;agent 無法開瀏覽器;最快 |
| [`pptxgenjs`](./adapters/pptxgenjs) | `slides/<id>/build.mjs`(Node 腳本) | 產出的 PPTX 本身 | `node build.mjs` → 原生形狀 PPTX | 交付物必須是可完全編輯的原生 PowerPoint;無瀏覽器 |

要加別的引擎(reveal.js、公司專屬樣板⋯⋯),在 `adapters/<engine>/` 下放 `README.md`、`prototype.md`、`qa.md`,描述該引擎的前提、編寫契約、預覽介面與匯出。Pipeline skill 會自動讀取——不用改 orchestrator。

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
node .agents/skills/make-presentation/scripts/status.mjs init <work-root> <deck-id> <source-root> [mode] ["<mode-reason>"]
node .agents/skills/make-presentation/scripts/status.mjs next   <work-root>                 # 最早未解決的 gate
node .agents/skills/make-presentation/scripts/status.mjs result <work-root> <gate> passed "<reason>" --artifact <path> [--artifact <path>]...
node .agents/skills/make-presentation/scripts/status.mjs invalidate <work-root> <gate> "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-mode <work-root> research-enhanced "<reason>"
node .agents/skills/make-presentation/scripts/status.mjs set-engine <work-root> <engine>     # 在 deck-prototype gate 記錄引擎
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
