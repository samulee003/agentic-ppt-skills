# Marp adapter

This adapter supplies the engine-specific rules for the **prototype** (`deck-prototype`) and **deck-qa** (`production-qa`) gates when the deck is built with [Marp](https://marp.app/) — Markdown → slides, exported by a real CLI.

The pipeline skills (`skills/presentation-prototype`, `skills/presentation-deck-qa`) are engine-agnostic. When the user picks `marp` as the engine, those skills read the two files in this folder:

- [`prototype.md`](./prototype.md) — authoring rules for the prototype gate: the Markdown file contract, the `---` page separator, frontmatter theming, and projector-safe type.
- [`qa.md`](./qa.md) — QA rules for the deck-qa gate: the `marp` CLI export command (PPTX/PDF/HTML), integrity checks, and inspection.

Marp is the lightest-weight engine this repo supports: the "real slide source" is a single Markdown file, there is no canvas/browser/runtime to run, and export is one shell command. It is a good default for agents that cannot drive a browser or scaffold a full workspace.

## Prerequisites

Marp runs through `npx`; no global install is required, but **Node 18+** must be present (it already is — the pipeline's status helper needs it too). The first export downloads `@marp-team/marp-cli`, so an internet connection is needed once.

```bash
npx @marp-team/marp-cli@latest --version    # confirms Marp is reachable
```

No workspace scaffold, no `node_modules` to manage by hand, no dev server.

## Relationship to the pipeline

| Pipeline concept | Marp realization |
| --- | --- |
| "the real slide source" | a single `slides/<deck-id>.md` file |
| "live review surface" | render the Markdown to HTML and open it (`marp deck.md -o deck.html`), or use a Marp preview extension |
| "canonical authoring rules" | this adapter's `prototype.md` (Marp Markdown + projector-safe type) |
| "export" | `marp deck.md -o deck.pptx` / `-o deck.pdf` / `-o deck.html` via CLI |

See the repo root [README](../../README.md) for how the adapter slot fits into the pipeline.
