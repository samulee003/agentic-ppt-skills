# Presentation status schema

Agents update presentation status through `.agents/skills/make-presentation/scripts/status.mjs`. Do not hand-edit the JSON block inside `STATUS.md`.

## Gates

- `source-intake`
- `product-grill`
- `evidence`
- `story-architecture`
- `story-grill`
- `deck-prototype`
- `stage-grill`
- `production-qa`

## Status values

- `pending`
- `in_progress`
- `passed`
- `needs_revision`
- `blocked`

## JSON marker format

Every `STATUS.md` file contains a machine-readable state block between these markers:

````md
<!-- presentation-status:start -->
```json
{"schemaVersion":3}
```
<!-- presentation-status:end -->
````

The helper validates the gate order and rewrites both the JSON block and the rendered table together. Each gate records `artifacts` as separate real paths, reviewed status, review time, inputs, decisions, invalidation time/cause, and review/invalidation reasons. The top-level state records `mode`, `modeReviewedAt`, `modeReason`, and `engine` (e.g. `open-slide`, `genoffice`, `marp`, `pptxgenjs`). Schema version 1 and 2 files are migrated deterministically to schema version 3 on load.

Invalidation changes reviewed gates at or after the selected gate to `needs_revision` (or only the target gate when `--selective` is passed). Untouched `pending` gates remain pending and unreviewed. Earlier gates stay unchanged. Invalidation preserves `reviewedAt` and the review reason, then records `invalidatedAt`, `invalidatedBy`, and `invalidationReason`. Passing the gate again clears all invalidation metadata.

## Commands

```bash
node .agents/skills/make-presentation/scripts/status.mjs init ./work/demo demo-deck /source/material general "Internal low-risk deck"
node .agents/skills/make-presentation/scripts/status.mjs init ./work/demo demo-deck /source/material research-enhanced "Consequential statistics detected" --force
node .agents/skills/make-presentation/scripts/status.mjs validate ./work/demo
node .agents/skills/make-presentation/scripts/status.mjs next ./work/demo
node .agents/skills/make-presentation/scripts/status.mjs summary ./work/demo
node .agents/skills/make-presentation/scripts/status.mjs set ./work/demo evidence in_progress "Reviewing claims" --input SOURCE-INVENTORY.md
node .agents/skills/make-presentation/scripts/status.mjs invalidate ./work/demo evidence "A source changed"
node .agents/skills/make-presentation/scripts/status.mjs invalidate ./work/demo evidence "Refresh single gate" --selective
node .agents/skills/make-presentation/scripts/status.mjs set-mode ./work/demo research-enhanced "Consequential claims detected"
node .agents/skills/make-presentation/scripts/status.mjs set-engine ./work/demo genoffice
node .agents/skills/make-presentation/scripts/status.mjs result ./work/demo production-qa passed "Exports verified" --artifact QA-REPORT.md --artifact exports/demo.pptx --artifact exports/demo.pdf --input slides/demo-deck --decision "Approve PPTX and matching PDF"
node .agents/skills/make-presentation/scripts/status.mjs result ./work/demo story-grill "needs_revision: evidence" "Counter-evidence is missing"
```

`init` refuses to overwrite an existing `STATUS.md`; `--force` is an explicit reset. Deck ids must be safe kebab-case. A passed `result` requires at least one `--artifact`; repeat it for multiple outputs. Repeat `--input` and `--decision` to replace those arrays with the values supplied in that command. `next` prints the earliest gate whose status is not `passed`, or `complete`.
