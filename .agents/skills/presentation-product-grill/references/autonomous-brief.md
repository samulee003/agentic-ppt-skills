# Autonomous brief fallback

Use this only when no person can answer (headless/autonomous run) or the user explicitly says to stop asking. Resolve each unsettled `product-grill` node from `../../make-presentation/references/grill-tree.md` yourself and record it.

For each unsettled node:

- **Node:** its id from the grill tree
- **Resolved value:** the concrete decision
- **Rationale:** why this is the most defensible reading of the sources
- **Downstream impact:** what this invalidates (if any), per the invalidation rules
- **Confidence:** high / medium / low — and if low, the single question you would have asked the user if they were present

Write the resolved values into `PRESENTATION-BRIEF.md` and log one `GRILL-LOG.md` row per node with `Status` = `Assumed` and the rationale and confidence in *Reason*. List every load-bearing node you assumed under `## Unconfirmed` at the top of the brief, each with the one question that would confirm it. They must become `Decided` before `production-qa`; `grill-check.mjs` blocks delivery otherwise.

Return `passed` when every node is resolved to at least medium confidence, `grill-check.mjs <work-root> product-grill` reports no errors, and the brief is coherent enough for the evidence gate to proceed.
