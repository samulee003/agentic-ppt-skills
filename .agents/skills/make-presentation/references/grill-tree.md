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
2. Round 1 is every remaining node with no unsettled prerequisite. For the
   product grill that is usually profile, deck type, and audience, plus any
   later node the sources made answerable.
3. Each later round is the new frontier. Do not ask a node whose
   prerequisite is still open in the same round.
4. Every question carries a recommended answer worded so "yes" accepts it.
5. Stop when every applicable node for the gate has a row.

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
    { "id": "deliverables", "title": "Deliverables", "question": "Presenting deck, reading deck, or both; formats; must the .pptx be editable, and where will the team edit it?", "deps": ["audience", "constraints"], "loadBearing": false },
    { "id": "brand", "title": "Brand template", "question": "Is there a brand template or guide (or none)?", "deps": ["deliverables"], "loadBearing": false },
    { "id": "visual", "title": "Visual direction", "question": "Which theme, or which benchmark deck?", "deps": ["deck-type", "brand"], "loadBearing": false },
    { "id": "success-test", "title": "Success test", "question": "What observable signal will show the deck worked?", "deps": ["outcome", "promise"], "loadBearing": true },
    { "id": "out-of-scope", "title": "Out of scope", "question": "What must the deck not cover or claim?", "deps": ["promise"], "loadBearing": false }
  ],
  "story-grill": [
    { "id": "opposition", "title": "Strongest objection", "question": "What is the strongest case against the thesis, and does the story answer it?", "deps": [], "loadBearing": true },
    { "id": "headline-test", "title": "Headline test", "question": "Read only the titles: do they carry the argument? Which gaps or redundant slides did it expose?", "deps": [], "loadBearing": true },
    { "id": "counter-evidence", "title": "Counter-evidence", "question": "Which counter-evidence goes in the talk, in backup, or nowhere?", "deps": ["opposition"], "loadBearing": true },
    { "id": "cuts", "title": "Cuts", "question": "Which slides are cut, merged, or moved to backup?", "deps": ["headline-test"], "loadBearing": false },
    { "id": "structure", "title": "Structure", "question": "Does the structure follow the deck type's default, and if not, why?", "deps": [], "loadBearing": false }
  ],
  "deck-prototype": [
    { "id": "engine", "title": "Engine", "question": "Which engine builds the deck?", "deps": [], "loadBearing": false },
    { "id": "visual-confirm", "title": "Visual direction confirmed", "question": "Seen on real pages, does the theme work, or what changes?", "deps": ["engine"], "loadBearing": false },
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
