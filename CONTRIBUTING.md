# Contributing

Thanks for helping. This repository is mostly instructions for agents, plus a
few zero-dependency Node scripts that check their work.

## Ground rules

- **Encode lessons, do not just document them.** When an agent makes the same
  mistake twice, fix the template or add a check first, a test next, and prose
  last (`skills/make-presentation/references/encode-lessons.md`).
- **Keep the core neutral.** Language, structure, or style rules for one kind of
  work belong in a profile (`skills/make-presentation/profiles/`) or a theme
  (`skills/make-presentation/themes/`), not in a pipeline skill.
- **No dependencies in the scripts.** They must run on a bare Node 18+.
- **Write for agents in `SKILL.md`, for people in READMEs.** `SKILL.md` files are
  short imperative contracts; explanations go in references.

## Workflow

1. Edit `skills/` or `adapters/` (never the `.agents/` copies directly).
2. Refresh the mirrors:
   ```bash
   for d in skills/*/; do n=$(basename "$d"); rm -rf ".agents/skills/$n"; cp -r "$d" ".agents/skills/$n"; done
   rm -rf .agents/adapters && cp -r adapters .agents/adapters
   ```
3. Run `npm test`. It also checks the mirrors and every relative link in the docs.
4. Update `CHANGELOG.md` and, when behaviour changes, the three READMEs.

## Adding an engine

Create `adapters/<engine>/` with `README.md`, `prototype.md`, and `qa.md`
(copy the closest existing adapter), register the engine in
`skills/make-presentation/scripts/deck-engines.mjs`, and add a dry-run test in
`test/cli.test.mjs`. The adapter must say how the deck reaches
`exports/<deck-id>.pptx`, because every engine is checked by `pptx-check.mjs`.

## Adding a theme or profile

Copy an existing file, keep its headings, and run
`node skills/make-presentation/scripts/theme-check.mjs` for themes.
