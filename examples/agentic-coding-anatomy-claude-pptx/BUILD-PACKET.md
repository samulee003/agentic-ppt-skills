# BUILD-PACKET

Build the slides below exactly as specified:

- One slide per block, in this order. Do not add, merge, split, or reorder slides.
- Use each action title verbatim as the slide title.
- Put the speaker notes in the notes field of each slide, not on the slide.
- Follow the archetype and the theme. Keep body text at or above the type floor.
- Give every image and chart alt text.
- Export as PowerPoint (.pptx) and PDF.

## Deck

- Deck type: `technical` (short explainer)
- Audience: Software Developers and Tech Leads
- Language on screen / spoken: (not recorded)
- Aspect ratio: 16:9
- Slides: 5

## Type scale (share of slide height)

- Slide title 4.5–7.5%; body 3.0–4.1%, never under 2.6%; captions and source lines never under 2.0%.
- On a 10 × 5.625 in slide: title 18–30 pt, body 12–17 pt (floor 10.5 pt), captions ≥ 8 pt.
- On a 13.33 × 7.5 in slide: title 24–40 pt, body 16–22 pt (floor 14 pt), captions ≥ 11 pt.
- If content does not fit, split the slide; never shrink text below the floor.

## Archetypes

- hero: one dominant statement or number, no bullets.
- split: two asymmetric columns, visual on one side, explanation on the other.
- diagram: a system or process drawing filling most of the slide, labels inside it.
- cards: 2–4 parallel items with clear hierarchy.
- data: one chart, table, or hero number that proves the title; highlight the series the title names; source line on the slide.
- section: chapter divider.
- interaction: a poll, discussion prompt, exercise, or demo cue.

## Theme

# editorial-minimal

The default. A white page, confident type, one accent colour. It lets the
argument carry the deck.

```json theme
{
  "id": "editorial-minimal",
  "palette": {
    "background": "#FFFFFF",
    "text": "#111827",
    "muted": "#4B5563",
    "accent": "#1D4ED8",
    "alert": "#B91C1C",
    "rule": "#E5E7EB"
  },
  "bodyPairs": [["text", "background"], ["muted", "background"], ["accent", "background"], ["alert", "background"]],
  "largeOnlyPairs": []
}
```

## Type

- Fonts: one sans family for everything (Inter, Source Sans 3, or Noto Sans TC /
  Noto Sans SC for Chinese). Weight carries hierarchy: 700 titles, 400 body.
- Titles at the low end of the title range; body at 3.2–3.6%.

## Surfaces

- No card shadows. Group with whitespace first, a 1 px `rule` line second.
- Margins: 6–8% of slide height on every side.
- Charts: grey (`muted`) for context series, `accent` for the series the title
  talks about. One accent per slide.

## Anti-patterns

- Gradient backgrounds, drop shadows, stock-photo backdrops behind text.
- More than one accent colour on a slide.
- Centred body text.

## Slides

### Slide 1: Agentic coding is a loop, not a single answer

- Archetype: hero
- Audience job: Welcome
- Time: 0.5m
- Speaker notes: "Hello everyone. This Open-slide demo looks at agentic coding as a workflow, not as a vendor product. The important shift is from generating code once to acting, observing, and revising."

### Slide 2: The agent reads, plans, writes, and verifies in a repeating loop

- Archetype: diagram
- Audience job: Understand loop
- Sources: claim-02 (see EVIDENCE-LEDGER.md; show the source line on data slides)
- Time: 1m
- Speaker notes: "The core loop is Read, Plan, Write, Verify. The agent reads the request and repository, chooses a focused change, applies it, and checks the result. Verification is part of the loop, not an optional final step."

### Slide 3: Tools connect the model to files, commands, search, and tests

- Archetype: split
- Audience job: Understand tools
- Sources: claim-02 (see EVIDENCE-LEDGER.md; show the source line on data slides)
- Time: 1m
- Speaker notes: "These tool names are illustrative. Real agents expose different interfaces, permissions, and sandboxes. The general role is the same: connect the model to files, commands, search, and test output."

### Slide 4: Feedback lets each retry build on the last, beyond a 1.96% baseline

- Archetype: data
- Audience job: Interpret evidence
- Sources: claim-01, claim-02 (see EVIDENCE-LEDGER.md; show the source line on data slides)
- Time: 1.5m
- Speaker notes: "In the original 2023 SWE-bench paper, Claude 2 resolved 1.96 percent of the full 2,294-task benchmark with BM25 retrieval. That is a historical baseline, not a current leaderboard result. An iterative observe-edit-test-retry loop can use execution feedback to shape the next attempt, but this slide does not claim a universal numerical uplift."

### Slide 5: Human review should match each action's consequence, reversibility, and scope

- Archetype: cards
- Audience job: Accept safety
- Time: 1m
- Speaker notes: "Safety should follow the risk of the action. Consequential, irreversible, or out-of-scope actions should trigger human review. Routine, reversible work can stay autonomous when permissions and rollback are clear."

