# Autonomous brief fallback

Use this when the user is unavailable (headless/autonomous run) or the remaining product decisions are resolvable from the sources without human judgment. Instead of asking one question at a time, resolve each open product decision yourself and record it.

For each unresolved field in `PRESENTATION-BRIEF.md`:

- **Field:** audience / problem / outcome / promise / evidence threshold / constraints / success test / out of scope
- **Resolved value:** the concrete decision
- **Rationale:** why this is the most defensible reading of the sources
- **Downstream impact:** what this invalidates (if any), per the invalidation rules
- **Confidence:** high / medium / low — and if low, the single question you would have asked the user if they were present

Write the resolved values into `PRESENTATION-BRIEF.md` and log each consequential decision in `GRILL-LOG.md` with the rationale and confidence. When confidence is low on a load-bearing field (e.g. audience or outcome), flag it plainly in the brief and the grill log so a human reviewer can revisit it — do not silently guess on the most consequential decisions.

Return `passed` when every required field is resolved to at least medium confidence and the brief is coherent enough for the evidence gate to proceed.
