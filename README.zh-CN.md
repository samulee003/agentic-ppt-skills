# agentic-ppt-skills

[English](./README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md)

与演示引擎无关的代理技能，可将笔记、现有演示文稿或想法，转化为完成且适合上台展示的演示文稿。

## 用户指南

本仓库提供八个关卡的工作流程：

```text
来源 → 产品 → 证据 → 故事 → 故事审查 → 原型 → 上台 → 交付
```

每个关卡都有专注的技能与指定交付成果：

| 关卡 | 技能 | 交付成果 |
| --- | --- | --- |
| 来源整理 | `presentation-source-intake` | `SOURCE-INVENTORY.md` |
| 产品定义 | `presentation-product-grill` | `PRESENTATION-BRIEF.md` |
| 证据 | `presentation-evidence` | `EVIDENCE-LEDGER.md` |
| 故事架构 | `presentation-story-architecture` | `STORY.md`、`STORYBOARD.md` |
| 故事审查 | `presentation-story-grill` | `GRILL-LOG.md` |
| 原型 | `presentation-prototype` | 代表性演示文稿 |
| 上台审查 | `presentation-stage-grill` | `SPEAKER-SCRIPT.md` |
| 生产环境 QA | `presentation-deck-qa` | `QA-REPORT.md`、导出文件 |

流程支持 `general`、`fast-track` 和 `research-enhanced` 模式。原型与生产环境 QA 使用
adapter；内含 `open-slide`、`genoffice`、`marp` 和 `pptxgenjs`，并附带 `genoffice`
技能供代理直接读取、创建、几何审计（audit）、渲染与转换本地 Office 文件。`scripts/export-deck.mjs` 以各引擎自己的 CLI 无头导出；`scripts/qa-deck.mjs` 运行引擎的自动审计（open-slide、GenOffice），并对所有引擎检查导出文件是否完整。

`skills/make-presentation/references/` 中的实践吸收自 [`backnotprop/pstack`](https://github.com/backnotprop/pstack)（聚焦重放、去 AI 废话检查 `scripts/unslop-check.mjs`、审查分桶、原型擂台与经验编码）与 [`mattpocock/skills`](https://github.com/mattpocock/skills)（Frontier rounds 轮次式提问、“yes”采纳建议、问卷转换）。

### 搭配平台内置的 PPT 技能

本项目的技能负责决定演示文稿“说什么”与“是否可上台”；文件“怎么生成”可交给运行环境自己的 PowerPoint 技能：

| 运行环境 | 平台技能 | 搭配位置 |
| --- | --- | --- |
| Claude Code | [`anthropics/skills`](https://github.com/anthropics/skills) 的 `pptx`（`document-skills` 插件；源代码公开但非开源许可） | `source-intake`：读取已有 `.pptx` 的文字与结构。`deck-prototype` / `production-qa`：在 `pptxgenjs` adapter 规则下创建与修改文件（两者使用同一套库）。 |
| Codex | [`openai/skills`](https://github.com/openai/skills) 的 `slides`（PptxGenJS 加上渲染与溢出检查） | 同上。其渲染与溢出检查结果可作为 `QA-REPORT.md` 的证据。 |

搭配规则：

- 关卡仍由协调器掌控。平台技能不得自行标记关卡通过，也不得跳过证据、故事或上台审查。
- 以 `set-engine` 记录引擎为 `pptxgenjs`，并遵循 `adapters/pptxgenjs/` 的版面预算、字号与备注规则；平台技能自身的设计默认值以这些规则为准。
- 只选一个运行目录（`.agents/skills/` 或 `.claude/skills/`），每个关卡只启用一个生成演示文稿的技能，避免两个技能写同一个文件。

### 安装

在代理应使用这些技能的项目根目录执行：

```bash
SRC=/absolute/path/to/agentic-ppt-skills  # 替换为此 checkout 的路径
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

然后请代理制作演示文稿，例如：

> 使用 `./research/` 中的笔记制作演示文稿。

协调器会从最早尚未完成的关卡继续执行，并将状态记录在
`presentation-work/<deck-id>/STATUS.md`。

### 仓库结构

- `skills/` — 可发布、与引擎无关的技能（含 `genoffice`、`grilling`、`grill-me`、`to-questionnaire`）
- `adapters/` — 各引擎的原型与导出说明（`open-slide`、`genoffice`、`marp`、`pptxgenjs`）
- `examples/` — 完整的流程运行示例
- `.agents/` — 维护者自用的代理配置：`skills/` 与 `adapters/` 的镜像（由 `npm test` 检查一致）以及不会被安装的第三方技能；详见 [`.agents/README.md`](./.agents/README.md)

## AI 代理指南

代理的操作安装与运行说明位于 [`AGENTS.md`](./AGENTS.md)。开始安装或运行流程前请先阅读。各关卡的
`SKILL.md` 文件是执行时的唯一真实来源。

## 许可证

MIT。详见 [`LICENSE`](./LICENSE)。
