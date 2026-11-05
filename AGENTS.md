# Instructions for AI agents

This file is the machine-oriented entry point for agents operating from this
repository. The root [`README.md`](./README.md) is the human-oriented guide.

## 1. Detect the install target

1. If the current directory is the user's project repository, install there.
2. If it is this skills repository, a scratch directory, or no repository,
   create a separate deck workspace and tell the user its path.
3. Choose exactly one runtime directory: `.agents/skills/` for most runtimes,
   or `.claude/skills/` for Claude Code. Copy skills and adapters to the matching
   directory; do not symlink.
4. If both directories contain different `make-presentation/SKILL.md` files,
   stop and ask the user which one to target.

## 2. Install and verify

Preferred: run the installer from the target folder (it copies, then verifies):

```bash
npx github:samulee003/agentic-ppt-skills            # → .agents/
npx github:samulee003/agentic-ppt-skills --runtime=claude   # → .claude/
```

Claude Code can also install the plugin:
`/plugin marketplace add samulee003/agentic-ppt-skills`, then
`/plugin install agentic-ppt-skills@agentic-ppt-skills`.

Manual install: set `SRC` to the actual path of this repository; do not assume its folder name.

```bash
SRC=/absolute/path/to/agentic-ppt-skills
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

Before continuing, verify Node 18+, the orchestrator, the status helper, and at
least one adapter (for example `open-slide`, `genoffice`, `pptxgenjs`, or `claude-pptx`):

```bash
node --version                                                # must be v18 or higher
test -f .agents/skills/make-presentation/SKILL.md && echo "orchestrator present"
test -f .agents/skills/make-presentation/scripts/status.mjs && echo "status helper present"
node .agents/skills/make-presentation/scripts/status.mjs 2>&1 | head -1  # "error: Expected command..." confirms it ran
ls .agents/adapters/open-slide/ .agents/adapters/genoffice/   # must list adapter files
```

Stop and report any failed check. Do not install dependencies for the
zero-dependency status helper.

## 3. Ask for the source

Before starting, ask one question and wait:

> What is the source for this presentation? It can be notes, an existing deck,
> a URL, or a topic. Default: notes in the current folder.

Do not ask for mode or engine yet. Mode is evaluated after source intake and the
engine is selected at the prototype gate. If the user names a profile (for
example `training-zh-hant`), deck type, theme, or brand template, note it for
the product grill; do not ask for them now.

## 4. Run the orchestrator

Initialize the tracker, then load `make-presentation/SKILL.md`:

```bash
node .agents/skills/make-presentation/scripts/status.mjs \
  init presentation-work/<deck-id> <deck-id> <source-root> [<mode> "<mode-reason>"]
node .agents/skills/make-presentation/scripts/status.mjs \
  next presentation-work/<deck-id>
```

Grilling is the point: at every grill gate, ask the user the frontier of
`make-presentation/references/grill-tree.md` in rounds, with recommended
answers. Do not assume a load-bearing decision while the user can answer.

Run exactly one focused skill for the earliest unresolved gate. `SKILL.md` is
the agent contract; `skills/SKILLS-INDEX.md` is the human-facing catalog.
Create each named artifact yourself from its template. Never skip a gate
because an output already exists.

Never hand-edit `STATUS.md`. Use only `init`, `validate`, `next`, `set`,
`result`, `invalidate`, `set-mode`, `set-engine`, and `summary` from the status
helper. Mark a gate passed only with real `--artifact` paths.

The deterministic checks in `make-presentation/scripts/` (`grill-check.mjs`,
`interrogation-check.mjs`, `storyboard-check.mjs`, `pptx-check.mjs`,
`theme-check.mjs`, `unslop-check.mjs`, `qa-deck.mjs`) run at
the gates their skills name. An error from any of them blocks the gate; do not
pass a gate over a failing check.

At the prototype gate, ask the user to choose an installed adapter. Recommend
from the brief's *Deliverables* and your runtime: a natively editable `.pptx` →
`claude-pptx` (Claude with its `pptx` skill), `codex-slides` (Codex with its
`slides` skill), or `pptxgenjs`; `genoffice` to keep an existing deck's master;
`google-slides` when the team edits in Google Slides; `handoff` when ChatGPT,
Gamma, Canva, or a person builds the slides; otherwise `open-slide`. Then verify its directory, record it with `set-engine`, and
read that adapter's `README.md` and `prototype.md`. Production QA inherits the
choice and must also read `qa.md`.

## 5. Completion contract

Do not claim success until `next` reports `complete`. Then provide:

- `presentation-work/<deck-id>/STATUS.md`
- every exported file path
- the pipeline work directory
- the final `qa-deck.mjs` output (no errors)

Do not skip evidence, readability, or export checks. If the environment or a
verification step is unclear, stop and ask instead of guessing.
