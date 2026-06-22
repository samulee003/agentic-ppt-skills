# Autonomous stage fallback

Use this when the user is unavailable (headless/autonomous run) or the remaining stage decisions are resolvable from the deck and the upstream artifacts without human judgment. Instead of asking one question at a time, apply `references/stage-questions.md` yourself to the prototype/deck and resolve each finding.

For each stage question that surfaces a real issue (not a pass):

- **Slide:** which page
- **Finding:** the readability / speakability / timing / defensibility / audience-fit problem
- **Resolved change:** the concrete edit to the slide or `SPEAKER-SCRIPT.md`
- **Rationale:** why this change fixes the finding
- **Confidence:** high / medium / low — and if low, the single question you would have asked the user if they were present

Apply the resolved changes to `SPEAKER-SCRIPT.md` (and the deck source where a slide-level edit is needed), and log each consequential decision in `GRILL-LOG.md` with the rationale and confidence. Flag any low-confidence change that alters the talk's load-bearing claims or timing for later human review — do not silently rewrite a defensible-but-subtle slide.

Return `passed` when every page is readable, speakable, timed within budget, defensible against the evidence ledger, and audience-appropriate at medium confidence or higher.
