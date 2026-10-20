# Grilling in rounds

Adapted from the MIT-licensed [`grilling`](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling) skill in `mattpocock/skills`. It replaces the older "one question at a time" loop. Standalone use: `grill-me` or `grilling` in `skills/`.

## The model

Map the open decisions as a **design tree**: every decision branches into the decisions that hang off it. Work the tree in **rounds**.

- The **frontier** is every decision whose prerequisites are already settled. These are the questions you can ask now without guessing at answers you have not heard.
- Ask the **whole frontier in one round**. Never ask a question whose answer depends on another question still open in the same round. Hold it for a later round.
- Each answered round settles decisions, moves the frontier outward, and unblocks the next round. Thirteen questions usually take about three rounds, not thirteen turns.
- The session is done when the frontier is empty: every branch visited, nothing left silently assumed.

## Round format

```
❓ **Q1** - **<question title>**: <question body, with choices when useful>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer. Agreeing must never mean answering "no". The user may answer a whole round with "yes to all, except Q3: ...".

## Facts are yours, decisions are the user's

Find discoverable facts yourself: read the source folder, the slide files, the ledger. When a subagent is available, dispatch one for the lookup and ask the rest of the frontier meanwhile. Only questions downstream of the lookup wait. Never ask the user for something you can look up.

## How many questions per gate

| Gate | Typical shape |
| --- | --- |
| `product-grill` | 2 to 3 rounds covering audience, problem, outcome, promise, evidence threshold, constraints, visual direction, success test, out of scope |
| `story-grill` | 1 round of opposition-driven decisions, after the review buckets are drafted |
| `deck-prototype` | 1 round on the visual direction and representative scope, ideally answered from the prototype pages |
| `stage-grill` | 1 round on timing, trims, and audience challenges |
| `fast-track` mode | 1 round only. Everything else uses recommended defaults marked `Assumed` |

If a round would exceed about 8 questions, keep the ones that change downstream gates and move the rest to `Assumed` defaults.

## Combine with sharpen and playback

Before round 1, follow `references/sharpen-playback.md`: sharpen the task and write the playback paragraph. Reversible and stylistic choices become `Assumed` defaults instead of questions. Rounds are for decisions that would change audience, promise, evidence threshold, or what the deck must not say.

## Overrides

- To go back to strict one question per turn, the user says "ask one question at a time". Honor it for the rest of the session.
- "I don't know" is a real answer. For a look-and-feel question talking cannot settle, build a prototype page and ask again from that.
- When the answer must come from another person (a client, a clinician, a sponsor), use the `to-questionnaire` skill to turn the open items into a document they can fill in. Grill the send (who, and what you need back), not the subject.
- Do not act on the result until the user confirms you reached a shared understanding.
