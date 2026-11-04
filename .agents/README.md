# `.agents/` — maintainers' agent setup

This folder is the agent configuration the maintainers use while developing
this repository. **It is not what users install.** The install commands in
[`AGENTS.md`](../AGENTS.md) copy only `skills/` and `adapters/`.

## Mirrors (must stay identical)

Every folder in `../skills/` has a copy in `skills/`, and `adapters/` mirrors
`../adapters/`. `npm test` (`test/mirror.test.mjs`) fails when a mirror drifts.
Edit the top-level copy, then refresh the mirror:

```bash
for d in skills/*/; do n=$(basename "$d"); rm -rf ".agents/skills/$n"; cp -r "$d" ".agents/skills/$n"; done
rm -rf .agents/adapters && cp -r adapters .agents/adapters
```

## Third-party skills (not distributed)

These are used while authoring the examples and adapters. They are not part of
the installable set. Licenses are recorded only where the skill ships one;
check each upstream source before redistributing or copying them into
`skills/`.

| Skill | Bundled license |
| --- | --- |
| `apple-design` | none recorded |
| `apply-comments` | none recorded |
| `create-slide` | none recorded |
| `create-theme` | none recorded |
| `current-slide` | none recorded |
| `diagram-design` | none recorded |
| `emil-design-eng` | none recorded |
| `frontend-design` | `LICENSE.txt` |
| `human-writing` | `LICENSE` |
| `review-animations` | none recorded |
| `shadcn` | none recorded |
| `slide-authoring` | none recorded |
| `vercel-composition-patterns` | none recorded |
| `vercel-react-best-practices` | none recorded |
| `wait-what` | none recorded |
| `wang-yongfu-teaching-craft` | none recorded |
| `web-design-guidelines` | none recorded |

`grill-me`, `grilling`, and `to-questionnaire` moved to `../skills/` and are now
distributed with their upstream MIT license (`mattpocock/skills`).
