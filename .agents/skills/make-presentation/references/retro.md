# Retro: after the talk

Adapted from the MIT-licensed [`reflect`](https://github.com/backnotprop/pstack/tree/main/skills/reflect)
skill in `backnotprop/pstack`: mine what happened for durable learnings, then
route each one to a concrete edit. Run it after the deck is delivered, when the
user says "retro" or "the talk is done". It is optional and outside the eight
gates; `STATUS.md` stays `complete`.

## 1. Grill the user about the talk

One round, every question with a recommended answer:

1. Which questions did the audience ask? Which did the deck or backup answer?
2. Where did time run over or under, slide by slide?
3. Which slide landed best, and which fell flat or confused people?
4. Did the success test in the brief happen? What did the audience do afterwards?
5. What did you change on the fly while presenting?

Read the brief, storyboard, speaker script, `GRILL-LOG.md`, and `INTERROGATION.md`
first, so each question can name the slide or decision it is about.

## 2. Turn answers into learnings

A learning is something that would change the **next** deck, not a one-off.
For each one, decide its routing, most durable first (see `encode-lessons.md`):

| Routing | When | Example |
| --- | --- | --- |
| `check` | a script could catch it every time | "titles over 12 words never got read" → a title-length rule in `storyboard-check.mjs` |
| `grill-tree` | a question was never asked and should have been | "nobody asked about the room's screen" → a node |
| `interrogation` | an adversary was missing | "the union rep's objection was not anticipated" → an adversary for that deck type |
| `template` | an artifact needs a field | a "venue tech check" line in the brief |
| `profile` | it holds for this kind of work only | a Cantonese phrasing rule in `training-zh-hant` |
| `theme` | a visual rule | sticker-pop card titles need one more size step |
| `deck-only` | it matters for this deck's next run only | a slide to add before the repeat session |

Repeated learnings outrank new ones: if the same correction appears in two
retros, it must be routed to `check`, `grill-tree`, or `template`.

## 3. Propose, then apply on approval

Write `RETRO.md` from `templates/RETRO.md` with each learning marked
`Accepted`, `Rejected`, or `Backlog`, and its routing and exact edit. Show it
and **wait for the user's approval before editing any skill, profile, theme, or
check**; these edits change every future deck. Apply the approved ones, run
`npm test` (or the edited script's own test), and list what changed.
