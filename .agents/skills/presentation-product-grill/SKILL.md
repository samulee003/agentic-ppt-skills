---
name: presentation-product-grill
description: Turns a source inventory into a presentation brief by resolving audience, problem, outcome, promise, constraints, and success decisions through round-by-round frontier grilling. Use when the product-grill gate is current for a presentation project or when a router asks for the presentation brief and consequential decision log.
---

# Grill the presentation product

Use when `product-grill` is the current gate.

- Read repo instructions, `SOURCE-INVENTORY.md`, and cited source files before asking anything.
- **Finding facts is your job, never the user's**: explore files, data, and citations directly instead of asking the user for discoverable facts.
- Map the product definition as a **design tree**: Audience, Problem, Outcome, Promise, Evidence threshold, Constraints, Success test, and Out of scope.

## Wang Yong-Fu (福哥) Teaching Craft Integration (`wang-yongfu-teaching-craft`)

In `PRESENTATION-BRIEF.md`:
- **ASK Objective Model**: Explicitly declare 3 dimensions of learning objectives:
  - **Knowledge (知識/知道)**: What concepts or frameworks must the audience understand?
  - **Skill (技巧/得到)**: What actionable methods or tools will they master?
  - **Attitude (態度/心態)**: What emotional shift or mindset change will take place?
- **Learning Levels (知道 → 得到 → 做到)**: Ensure the session does not stop at mere cognitive knowledge ("知道"); design concrete moments where the audience converts insight into practice ("做到").
- **Observable Success Criteria**: Reject vague slogans ("improve parenting quality"); require measurable, observable end-of-session behaviors (e.g. completing a 3-rule compact card, passing an alignment roleplay).

## Frontier Grilling Flow
- Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask *now* without guessing at answers you haven't heard yet.
- Ask the whole frontier in one round: number each question, explain downstream impact, and provide your recommended answer.
- Format every question in a round with the standard grilling card syntax:

```
❓ **Q1** - **<question title>**: <question body, trade-offs, options>

➡️ <your recommended answer & downstream impact>

---

❓ **Q2** - **<question title>**: <question body, trade-offs, options>

➡️ <your recommended answer & downstream impact>
```

- Each round the user answers unblocks downstream decisions: recompute the frontier and ask the next round.
- Use `references/autonomous-brief.md` for the autonomous fallback when the user is unavailable (headless run) or the remaining product decisions are resolvable from sources — resolve each open field with a defensible value, rationale, and confidence level, and flag low-confidence load-bearing decisions for later human review.
- Let any consequential change to Audience, Problem, Outcome, Promise, Evidence threshold, Constraints, Success test, or Out of scope invalidate downstream gates.
- **Confirmation Gate**: Do not finalize or advance past the product-grill gate until the user confirms you have reached a shared understanding on the brief.

Write `PRESENTATION-BRIEF.md` from `templates/PRESENTATION-BRIEF.md`.

- Update the brief as soon as decisions are settled.
- Keep the brief decision-oriented and concrete.
- Prefer short sentences, explicit tradeoffs, and measurable success tests.

Write only consequential decisions to `GRILL-LOG.md` from `templates/GRILL-LOG.md`.

- Append new decisions without deleting or rewriting entries from other grill phases or earlier runs.
- Preserve existing decisions from story or stage grilling.
- Log decisions that materially change evidence, story, prototype, stage, or production work.
- Skip minor wording preferences and reversible drafting details.
- Stop once the brief is coherent and confirmed.