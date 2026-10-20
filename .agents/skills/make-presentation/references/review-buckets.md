# Review buckets: lead judgment for opposition and QA reviews

Adapted from the MIT-licensed [`interrogate`](https://github.com/backnotprop/pstack/tree/main/skills/interrogate) skill in `backnotprop/pstack`. Use it at `story-grill`, `stage-grill`, and `production-qa` so review output is actionable instead of a flat list of concerns.

## Reviewers

Pick one:

1. **Single reviewer (default).** You run the review yourself. Work through each stakeholder lens (audience member, sponsor, domain expert, skeptic, presenter) in turn.
2. **Parallel reviewers.** When subagents are available and the deck is high stakes, spawn one read-only reviewer per lens or per model. Each gets the intent paragraph, the artifact paths, and the checklist for the gate. Diversity of model or lens is the adversarial signal, not assigned personas.

If a headless run has no subagents, run the lenses sequentially and say so in the report.

## Step 1: State intent

Write one paragraph: audience, outcome, promise, and what this review must decide. Ask the user only if the intent is unclear.

## Step 2: Collect findings

Every finding records: location (slide number or file and line), the problem, which reviewer or lens raised it, and evidence. Merge duplicates. Findings raised independently by two or more reviewers carry the most weight. Note explicit disagreements.

## Step 3: Lead judgment

You are the lead reviewer, not a neutral aggregator. Put every finding in exactly one bucket with a one-line rationale.

| Bucket | Meaning | Effect on the gate |
| --- | --- | --- |
| **Act on** | A real defect that would embarrass the presenter or mislead the audience: unsupported claim, contradiction, overflow, notes drift, failed export check. | Blocks `passed`. Fix, or return `needs_revision`. |
| **Consider** | Legitimate, but the cost of fixing now may outweigh the gain. | Put the tradeoff to the user with a recommended answer. |
| **Noted** | True but low impact at this stage. | Record in `GRILL-LOG.md` or `QA-REPORT.md` caveats. |
| **Dismissed** | Wrong, nitpicky, or missing context. | Record a short reason so it is not re-raised. |

Routing for `story-grill`: an **Act on** finding about audience, problem, outcome, or promise returns `needs_revision: product-grill`. An **Act on** finding about unsupported claims or missing counter-evidence returns `needs_revision: evidence`. Any other **Act on** finding is fixed in place before the gate passes.

Do not apply changes during the review itself. Report first, then fix.

## Output format

```md
### Intent
> <one paragraph>

### Reviewers
- <lens or model>, <N findings>

### Act on
- <finding>. Raised by <who>. Why it matters.

### Consider
- <finding>. Raised by <who>. Tradeoff and recommended answer.

### Noted
- <brief>

### Dismissed
- <finding>. Reason.

### Agreement map
<where reviewers agreed or diverged, and what that pattern suggests>
```

Write the consequential parts to `GRILL-LOG.md` (decisions) or `QA-REPORT.md` (caveats). Do not paste the whole review into either file.
