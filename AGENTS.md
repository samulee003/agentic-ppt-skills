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

Set `SRC` to the actual path of this repository; do not assume its folder name.

```bash
SRC=/absolute/path/to/agentic-ppt-skills
mkdir -p .agents/skills .agents/adapters
cp -r "$SRC/skills/." .agents/skills/
cp -r "$SRC/adapters/." .agents/adapters/
```

Before continuing, verify Node 18+, the orchestrator, the status helper, and at
least one adapter:

```bash
node --version
test -f .agents/skills/make-presentation/SKILL.md
test -f .agents/skills/make-presentation/scripts/status.mjs
ls .agents/adapters/open-slide/
```

Stop and report any failed check. Do not install dependencies for the
zero-dependency status helper.

## 3. Ask for the source

Before starting, ask one question and wait:

> What is the source for this presentation? It can be notes, an existing deck,
> a URL, or a topic. Default: notes in the current folder.

Do not ask for mode or engine yet. Mode is evaluated after source intake and the
engine is selected at the prototype gate.

## 4. Run the orchestrator

Initialize the tracker, then load `make-presentation/SKILL.md`:

```bash
node .agents/skills/make-presentation/scripts/status.mjs \
  init presentation-work/<deck-id> <deck-id> <source-root>
node .agents/skills/make-presentation/scripts/status.mjs \
  next presentation-work/<deck-id>
```

Run exactly one focused skill for the earliest unresolved gate. `SKILL.md` is
the agent contract; `skills/SKILLS-INDEX.md` is the human-facing catalog.
Create each named artifact yourself from its template. Never skip a gate
because an output already exists.

Never hand-edit `STATUS.md`. Use only `init`, `next`, `result`, `invalidate`,
`set-mode`, and `set-engine` from the status helper. Mark a gate passed only
with real `--artifact` paths.

At the prototype gate, ask the user to choose an installed adapter (default:
`open-slide`), verify its directory, record it with `set-engine`, and read that
adapter's `README.md` and `prototype.md`. Production QA inherits the choice and
must also read `qa.md`.

## 5. Completion contract

Do not claim success until `next` reports `complete`. Then provide:

- `presentation-work/<deck-id>/STATUS.md`
- every exported file path
- the pipeline work directory

Do not skip evidence, readability, or export checks. If the environment or a
verification step is unclear, stop and ask instead of guessing.
