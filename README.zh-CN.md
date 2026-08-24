# agentic-ppt-skills

[English](./README.md) · [繁體中文](./README.zh-TW.md) · [简体中文](./README.zh-CN.md)

与演示引擎无关的代理技能，可将笔记、现有演示文稿或想法，转化为完成且适合上台展示的演示文稿。

## 用户指南

本仓库提供八个关卡的工作流程：

```text
来源 → 产品 → 证据 → 故事 → 原型 → 上台 → 交付
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

流程支持 `general` 和 `research-enhanced` 模式。原型与生产环境 QA 使用
adapter；内含 `open-slide`、`marp` 和 `pptxgenjs`。

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

- `skills/` — 可发布、与引擎无关的技能
- `adapters/` — 各引擎的原型与导出说明
- `examples/` — 完整的流程运行示例
- `.agents/` — 内含的开发与参考副本

## AI 代理指南

代理的操作安装与运行说明位于 [`AGENTS.md`](./AGENTS.md)。开始安装或运行流程前请先阅读。各关卡的
`SKILL.md` 文件是执行时的唯一真实来源。

## 许可证

MIT。详见 [`LICENSE`](./LICENSE)。
