# Presentation router modes

## General

Use `general` when the deck is internal, creative, operational, or otherwise low-risk and does not depend on consequential external claims. Follows the standard 8-gate workflow.

## Fast-track

Use `fast-track` when producing lightweight, agile presentations (< 10 slides, internal team updates, rapid tech shares, sprint reviews) where minimizing turn latency and artifact overhead is paramount.

- Consolidates Gate 1 & 2 (Source Intake + Product Grill) into a single unified brief.
- Streamlines Gate 3 (Evidence) to focus only on top critical metrics.
- Combines Story & Opposition pass (Gate 4 & 5).
- Directly triggers prototype generation (Gate 6) and fast-path QA (Gate 8).
- Preserves all physical 1080px canvas budgets, CJK typography rules, and export defect checks.

## Research-enhanced

Use `research-enhanced` when the deck includes consequential external claims or source material with citations, datasets, surveys, formal policy, academic research, law, medicine, psychology, finance, safety, statistics, or numerical comparisons.

When enabled, add evidence safety levels (A/B/C/D), primary-source preference, exact dates/definitions/units/denominators, stale-value checks, opposition critique, per-slide fact checks, and a references/Q&A backup plan.

Re-evaluate mode after source intake and whenever later artifacts reveal these triggers. Upgrade with:

```bash
node .agents/skills/make-presentation/scripts/status.mjs set-mode presentation-work/<deck-id> research-enhanced "<reason>"
```

Evidence and Finalization read the current mode from `STATUS.md`; they do not rely on the mode chosen at initial intake.

## Deadline pressure

If the deadline is tight, switch to `fast-track` mode, reduce scope, shorten the prototype set, and defer optional polish or backup material.

Never silently waive evidence, readability, CJK layout margins, or export integrity.