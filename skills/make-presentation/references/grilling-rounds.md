# Grilling in rounds

Adapted from the MIT-licensed [`grilling`](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling) skill in `mattpocock/skills`. It replaces the older "one question at a time" loop. Standalone use: `grill-me` or `grilling` in `skills/` (installed with the other skills).

## The model

Map the open decisions as a **design tree**: every decision branches into the decisions that hang off it. Work the tree in **rounds**. For presentations the tree is written down in `grill-tree.md`: its nodes, their prerequisites, and which are load-bearing. Start from it, add any deck-specific decisions as extra rows, and log every node you settle in `GRILL-LOG.md`.

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
| `product-grill` | 2 to 3 rounds over the 12 product nodes |
| `story-grill` | 1 round over the 5 story nodes, after the interrogation (`interrogate.md`) has produced its verified findings |
| `deck-prototype` | 1 round over the 3 prototype nodes, answered from the prototype pages |
| `stage-grill` | 1 round over the stage nodes (timing, challenges, opening, language, resets for long talks) |
| `fast-track` mode | 1 round per grill gate that asks every load-bearing node; reversible nodes carry recommended defaults the user accepts with "yes to all" |

If a round would exceed about 8 questions, ask the load-bearing nodes first and carry the rest to the next round.

Before passing a grill gate, run `node .agents/skills/make-presentation/scripts/grill-check.mjs <work-root> <gate>`.

## Combine with sharpen and playback

Before round 1, follow `references/sharpen-playback.md`: sharpen the task and show the playback paragraph with round 1. Load-bearing nodes are always asked; reversible nodes are asked too, with recommended answers, so one "yes to all" settles them.

## Overrides

- To go back to strict one question per turn, the user says "ask one question at a time". Honor it for the rest of the session.
- "I don't know" is a real answer. For a look-and-feel question talking cannot settle, build a prototype page and ask again from that.
- When the answer must come from another person (a client, a clinician, a sponsor), use the `to-questionnaire` skill to turn the open items into a document they can fill in. Grill the send (who, and what you need back), not the subject.
- Do not act on the result until the user confirms you reached a shared understanding.
