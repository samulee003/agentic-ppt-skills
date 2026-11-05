# Profile: training-zh-hant

Traditional Chinese training, workshops, and public-education talks, often
delivered in Cantonese (for example in Hong Kong or Macau). Built from the
production decks this repository was first developed for.

## Language

- On-screen copy: standard Traditional written Chinese (繁體書面語). No
  colloquial Cantonese characters on slides.
- Speaker notes: natural spoken Cantonese the presenter can say aloud without
  stumbling.
- Translate or remove every stray English term on screen unless the audience
  uses it as-is (for example product names).

## Product grill

- Deck type: `training`.
- Theme: `sticker-pop` unless the brief says otherwise.
- Ask for the session length and the interaction format (lecture, workshop,
  mixed) in the first round.

## Evidence

- Local statistics (population, health, social welfare, education) come from
  the official statistics bureau or government department first (for example
  DSEC in Macau, the Census and Statistics Department in Hong Kong), then WHO or
  peer-reviewed sources for the global baseline.
- State the reference year and the global or regional comparison next to every
  local figure.

## Story architecture

- Structure: the 4MAT cycle (see `deck-types.md`, *training*): Why → How it
  works → What to do → Practice and transfer.
- Open with the audience's real situation and acknowledge it before offering
  tools, so participants feel safe to engage.
- Assign every slide an archetype in `STORYBOARD.md`; vary them so no three
  consecutive slides share one.

## Prototype

- Include at least one interaction layout in the representative set: a poll or
  temperature card, a pair-discussion prompt with a timer, a dialogue template,
  or a take-home checklist.
- Prefer drawn SVG illustrations in the sticker-pop stroke over photos.

## Grill nodes

Extra nodes this profile adds to `references/grill-tree.md`. `grill-check.mjs`
requires them when the brief names this profile.

```json grill-nodes
{
  "product-grill": [
    { "id": "interaction-format", "title": "Interaction format", "question": "Is the session a lecture, a workshop, or mixed, and how many participants?", "deps": ["constraints"], "loadBearing": true }
  ],
  "stage-grill": [
    { "id": "transfer", "title": "Behaviour transfer", "question": "For each tool taught, where is the rehearsal moment and what is the take-home scaffold?", "deps": [], "loadBearing": false },
    { "id": "framing", "title": "Constructive framing", "question": "For local policy or community cases, is what already exists separated from the next challenge, without blaming the audience?", "deps": [], "loadBearing": false }
  ]
}
```

## Stage grill

- Attention reset at least every 15–20 minutes (poll, pair discussion, choral
  rehearsal of a dialogue line, silent reflection).
- Every tool taught on screen gets a rehearsal moment and a take-home scaffold
  (pocket card, checklist), aiming at behaviour change after the session
  (Kirkpatrick level 3).
- For local policy or community cases, separate what is already in place from
  the next challenge. Avoid framing that blames the audience or their
  community.
