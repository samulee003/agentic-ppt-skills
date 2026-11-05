# Opposition review

Use this only when no person can answer (headless/autonomous run) or the user explicitly says to stop asking. Run the interrogation (`../../make-presentation/references/interrogate.md`) yourself, then settle each `story-grill` node and log it `Assumed` with reason and confidence.

- Strongest reasonable case against the story
- What the opposition must concede
- Missing counter-evidence or overreach
- Failure mode if the current story stays unchanged
- Smallest revision that would remove the objection
- Findings sorted into Act on, Consider, Noted, and Dismissed, per `../../make-presentation/references/review-buckets.md`
- Decision: `passed`, `needs_revision: product-grill`, or `needs_revision: evidence`
- Confidence: high / medium / low for the overall decision — and if low, flag the load-bearing objection plainly in `GRILL-LOG.md` so a human reviewer can revisit it. Do not silently pass when the strongest opposition is unresolved at low confidence.
