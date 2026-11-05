# The presentation grill tree

The grilling skills from `mattpocock/skills` work a **design tree** in rounds:
the frontier is every decision whose prerequisites are settled, and each round
asks the whole frontier. This file is the tree for presentations: the
decisions every deck needs, what each one depends on, and which ones are
load-bearing.

Use it at every grill gate. Each row you write to `GRILL-LOG.md` names the
node it settles in the `Node` column, and `scripts/grill-check.mjs` verifies
that every node for the gate is covered.

## How to work the tree

1. Settle what the sources already answer. Log those nodes as `Decided` with
   the source as the reason ("brief from client email, 3 May"), or ask a
   one-line confirmation in round 1.
2. Round 1 is every remaining node with no unsettled prerequisite (for the
   product grill: profile, deck type, audience, and brand), **plus every node
   the sources already answer**, asked as a confirmation with the source's
   answer as the recommendation, whatever its prerequisites. Such a row's
   *Reason* starts with `Source:` and names where the source says it.
   With the shared tree the product grill takes three or four rounds, fewer
   when the sources answer the early nodes.
3. Each later round is the new frontier. Do not ask a load-bearing node in
   the same round as its prerequisite: `grill-check.mjs` fails it unless its
   *Reason* starts with `Source:`. A premise line ("I have assumed a 3-hour
   training deck for staff") asks nothing: each node needs its own numbered
   question with the recommended answer shown.
4. Every question carries a recommended answer worded so "yes" accepts it.
5. Stop when every applicable node for the gate has a row.

## Every decision needs its round

`GRILL-LOG.md` has two tables. **Rounds** records each round you actually
asked: its id, the phase, the node ids it asked, and the user's reply copied
verbatim. **Decisions** has one row per node; a `Decided` row names the round
that settled it in its `Round` column. `grill-check.mjs` fails a `Decided` row
whose round does not exist, is in another phase, or did not ask that node.

Never mark a node `Decided` that the user did not answer in a recorded round.
If you chose it yourself, it is `Assumed`, and load-bearing assumptions block
delivery until a round confirms them.

## Status values

| Status | Meaning | Allowed |
| --- | --- | --- |
| `Decided` | The user answered (a "yes" to the recommendation counts), or a source the user supplied settles it and is named in *Reason* | always |
| `Assumed` | You chose, because the node is reversible, the user asked you to proceed, or the run is headless. *Reason* says why and what would change your mind | always needs a reason; a load-bearing node must be confirmed (`Decided`) before `production-qa` |
| `Deferred` | Waiting on someone else (use `to-questionnaire`) | blocks the gate until it becomes `Decided` or `Assumed` |

A later row for the same node replaces the earlier one. Never delete rows.

## Nodes

`Load-bearing` nodes change who the deck is for, what it claims, or whether it
works on the day. They are asked, not assumed, whenever a person can answer.

```json grill-tree
{
  "product-grill": [
    { "id": "profile", "title": "Profile", "question": "Which profile applies (default, training-zh-hant, or another)?", "deps": [], "loadBearing": false },
    { "id": "deck-type", "title": "Deck type", "question": "Is this a decision, update, pitch, training, keynote, or technical deck?", "deps": [], "loadBearing": true },
    { "id": "audience", "title": "Audience", "question": "Who exactly is in the room, what do they already know, and who decides?", "deps": [], "loadBearing": true },
    { "id": "outcome", "title": "Outcome", "question": "What should the audience decide, do, or believe afterwards?", "deps": ["deck-type", "audience"], "loadBearing": true },
    { "id": "promise", "title": "Promise", "question": "In one sentence, what does the deck promise the audience?", "deps": ["outcome"], "loadBearing": true },
    { "id": "evidence-threshold", "title": "Evidence threshold", "question": "How much proof will this audience demand, and which claims need hard support?", "deps": ["audience", "outcome"], "loadBearing": true },
    { "id": "constraints", "title": "Constraints", "question": "Talk length, Q&A, venue and screen, on-screen and spoken language?", "deps": ["deck-type"], "loadBearing": true },
    { "id": "deliverables", "title": "Deliverables", "question": "Presenting deck, reading deck, or both; formats; must the .pptx be editable, and where will the team edit it?", "deps": ["audience"], "loadBearing": false },
    { "id": "brand", "title": "Brand template", "question": "Is there a brand template or guide (or none)?", "deps": [], "loadBearing": false },
    { "id": "visual", "title": "Visual direction", "question": "Which of these two or three themes (shown with a sample), or which benchmark deck?", "deps": ["deck-type", "brand"], "loadBearing": true },
    { "id": "must-avoid", "title": "Must avoid", "question": "What must the deck never look like or contain: styles, colours, layouts, clip-art, words, topics?", "deps": [], "loadBearing": true },
    { "id": "imagery", "title": "Imagery", "question": "What carries the visuals: photos, illustrations, icons, diagrams, screenshots, or data charts, and where do they come from?", "deps": ["visual"], "loadBearing": true },
    { "id": "success-test", "title": "Success test", "question": "What observable signal will show the deck worked?", "deps": ["outcome"], "loadBearing": true },
    { "id": "out-of-scope", "title": "Out of scope", "question": "What must the deck not cover or claim?", "deps": ["outcome"], "loadBearing": false }
  ],
  "story-grill": [
    { "id": "opposition", "title": "Strongest objection", "question": "What is the strongest case against the thesis, and does the story answer it?", "deps": [], "loadBearing": true },
    { "id": "headline-test", "title": "Headline test", "question": "Read only the titles: do they carry the argument? Which gaps or redundant slides did it expose?", "deps": [], "loadBearing": true },
    { "id": "counter-evidence", "title": "Counter-evidence", "question": "Which counter-evidence goes in the talk, in backup, or nowhere?", "deps": ["opposition"], "loadBearing": true },
    { "id": "cuts", "title": "Cuts", "question": "Which slides are cut, merged, or moved to backup?", "deps": ["headline-test"], "loadBearing": false },
    { "id": "structure", "title": "Structure", "question": "Does the structure follow the deck type's default, and if not, why?", "deps": [], "loadBearing": false },
    { "id": "slide-budget", "title": "Slide budget", "question": "Why this many slides: minutes per slide, slides per chapter, and what was cut to stay there?", "deps": ["cuts"], "loadBearing": true }
  ],
  "deck-prototype": [
    { "id": "engine", "title": "Engine", "question": "Which engine builds the deck?", "deps": [], "loadBearing": false },
    { "id": "visual-confirm", "title": "Visual direction confirmed", "question": "Seen on real pages, does the theme work, or what changes?", "deps": ["engine"], "loadBearing": true },
    { "id": "representative-set", "title": "Representative set", "question": "Which pages prove the deck (hook, thesis, data, densest page, ending)?", "deps": [], "loadBearing": false }
  ],
  "stage-grill": [
    { "id": "opening", "title": "Opening", "question": "Do the first two minutes deliver the promise (and, for a decision deck, the ask)?", "deps": [], "loadBearing": true },
    { "id": "timing", "title": "Timing", "question": "Does the main talk fit the slot, and what is cut first if it runs long?", "deps": [], "loadBearing": true },
    { "id": "challenges", "title": "Audience challenges", "question": "What are the three hardest questions, and where is each answered (slide, backup, or verbal)?", "deps": [], "loadBearing": true },
    { "id": "language", "title": "Language and register", "question": "Is every surface in the right language and register, speakable aloud?", "deps": [], "loadBearing": false },
    { "id": "resets", "title": "Attention resets", "question": "Where are the attention resets in this long talk?", "deps": [], "loadBearing": false, "when": "longTalk" }
  ]
}
```

## Conditions

- `longTalk`: the brief's *Time* is over 30 minutes. If the length cannot be
  read from the brief, the node applies.

## Profiles

A profile may add nodes in its own *Grill nodes* section. Log them with the
profile's ids; `grill-check.mjs` reports unknown ids as warnings, not errors.
