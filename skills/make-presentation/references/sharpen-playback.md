# Sharpen and play back

Adapted from the MIT-licensed `sharpen` and `in-your-own-words` skills in
`backnotprop/pstack`. Playback makes the first round of grilling sharper. It
does not replace grilling.

## Before the first question

1. **Sharpen.** Ask how a strong presentation designer would approach this deck: what raw sources they would read, what the real audience decision is, and what outside check would prove the deck works (a pilot listener, a source verification, a timing run). Note whether the request is over- or under-specified. Leave choices that belong to the user open.
2. **Play back.** Write one tight paragraph: who the audience is, the problem the talk solves, the outcome after the talk, and the main constraint. Put it at the top of `PRESENTATION-BRIEF.md` as `## Playback` and show it to the user with round 1. If the user already confirmed it in this session, do not repeat it.

## What gets asked, what gets a default

| Node | Treatment |
| --- | --- |
| Load-bearing (`grill-tree.md`): deck type, audience, outcome, promise, evidence threshold, constraints, success test, and the story and stage nodes marked load-bearing | Always asked while a person can answer. A source can settle one only if the user confirms it. |
| Reversible: profile, deliverables, brand, visual, out of scope, prototype nodes | Asked in the same round with a recommended answer, so "yes to all" settles them. If the user skips one, log it `Assumed` with the reason; they correct it on the prototype. |
| Any node, headless run or the user says "stop asking" | Resolve per the gate's autonomous fallback, log `Assumed` with reason and confidence. Load-bearing ones go under `## Unconfirmed` in the brief and must be confirmed before `production-qa`. |

## Limits

- Keep a round to about 8 questions. If more nodes are on the frontier, ask the load-bearing ones first and carry the rest to the next round; do not convert them to silent defaults.
- Never invent audience facts, numbers, or sources. Defaults cover taste and structure, not evidence.
- Every `Assumed` row names what it would invalidate downstream if wrong, so a later correction can use `status.mjs invalidate`.
