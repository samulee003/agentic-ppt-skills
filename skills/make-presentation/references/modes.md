# Presentation router modes

## General

Use `general` when the deck is internal, creative, operational, or otherwise low-risk and does not depend on consequential external claims.

## Research-enhanced

Use `research-enhanced` when the deck includes consequential external claims or source material with citations, datasets, surveys, formal policy, academic research, law, medicine, psychology, finance, safety, statistics, or numerical comparisons.

When enabled, add evidence safety levels, primary-source preference, exact dates/definitions/units/denominators, stale-value checks, opposition critique, per-slide fact checks, and a references/Q&A backup plan.

Re-evaluate mode after source intake and whenever later artifacts reveal these triggers. Upgrade with:

```bash
node .agents/skills/make-presentation/scripts/status.mjs set-mode presentation-work/<deck-id> research-enhanced "<reason>"
```

Evidence and Finalization read the current mode from `STATUS.md`; they do not rely on the mode chosen at initial intake.

## Deadline pressure

If the deadline is tight, reduce scope, shorten the prototype set, and defer optional polish or backup material.

Never silently waive evidence, readability, or export integrity.
