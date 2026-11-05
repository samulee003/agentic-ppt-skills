# Autonomous stage fallback

Use this only when no person can answer (headless/autonomous run) or the user explicitly says to stop asking. Instead of asking one question at a time, apply `references/stage-questions.md` yourself to the prototype/deck and resolve each finding.

For each stage question that surfaces a real issue (not a pass):

- **Slide:** which page
- **Finding:** the readability / speakability / timing / defensibility / audience-fit problem
- **Resolved change:** the concrete edit to the slide or `SPEAKER-SCRIPT.md`
- **Rationale:** why this change fixes the finding
- **Confidence:** high / medium / low — and if low, the single question you would have asked the user if they were present

Apply the resolved changes to `SPEAKER-SCRIPT.md` (and the deck source where a slide-level edit is needed), and log one `GRILL-LOG.md` row per `stage-grill` node with `Status` = `Assumed` and the rationale and confidence. Load-bearing stage nodes (opening, timing, challenges) must be confirmed by a person before `production-qa`. Flag any low-confidence change that alters the talk's load-bearing claims or timing for later human review — do not silently rewrite a defensible-but-subtle slide.

Return `passed` when every page is readable, speakable, timed within budget, defensible against the evidence ledger, and audience-appropriate at medium confidence or higher.
