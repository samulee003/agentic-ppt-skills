# GRILL-LOG

Consequential decisions from the grill phases (product, story, stage). Append-only.

## product-grill

- **Audience locked to developers/tech leads** (not execs) — the loop model is too detailed for an exec room.
- **Time capped at 5 minutes / 5 slides** — no backup range; the benchmark caveats already consume slide 4.
- **Evidence threshold escalated to research-enhanced** — the SWE-bench figure is a numerical claim with an external primary source.

## story-grill

- **Opposition considered:** "1.96% is embarrassing-low; why show it?" Resolution: showing a historical baseline, heavily caveated, is more credible than hiding it or replacing it with a flattering current number. The deck's integrity depends on the audience trusting the one number it does show.
- **Opposition considered:** "Skip the benchmark; it dates the talk." Resolution: kept — removing the only quantitative anchor leaves the talk hand-wavy. The caveats are the safeguard, not omission.
- **Loop chapter before tools chapter** — the audience needs "what is happening" before "how it reaches the world." Reversed order tested worse.

## stage-grill

- **Page 4 timing set to 1.5m** (longest) — the caveats cannot be rushed; rushing them makes the number read as a promise.
- **No page reads faster than ~130 spoken words** — projector-readable + speakable verified.
- **Speaker notes added per page** in the Markdown (`<!-- ... -->`) so the notes survive the Marp export.
