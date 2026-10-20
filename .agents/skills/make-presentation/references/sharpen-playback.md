# Sharpen, play back, and proceed

Adapted from the MIT-licensed `sharpen`, `in-your-own-words`, and `principle-never-block-on-the-human` skills in `backnotprop/pstack`. This keeps one-question-at-a-time grilling for decisions that need it and avoids interrogation fatigue for the rest.

## Before the first question

1. **Sharpen.** Ask how a strong presentation designer would approach this deck: what raw sources they would read, what the real audience decision is, and what outside check would prove the deck works (a pilot listener, a source verification, a timing run). Note whether the request is over- or under-specified. Loosen constraints that do not serve the goal. Leave choices that belong to the user open.
2. **Play back.** Write one tight paragraph: who the audience is, the problem the talk solves, the outcome after the talk, and the main constraint. Put it at the top of `PRESENTATION-BRIEF.md` as `## Playback`. If the user already confirmed it in this session, do not repeat it.

## Choose the question mode

| Situation | Mode |
| --- | --- |
| A decision would change audience, promise, evidence threshold, or what the deck must not say, and the sources cannot answer it | Ask one question at a time with a recommended answer (the existing grill behavior). |
| The decision is reversible, stylistic, or easy to see on a slide | Proceed with the recommended default and record it as `Assumed` in the brief. The user corrects it on the prototype. |
| `fast-track` mode, a headless run, or the user says "just do it" | Use `references/autonomous-brief.md`. Proceed on defaults with confidence levels and flag low-confidence load-bearing decisions. |

## Limits

- Ask at most 5 blocking questions before showing something tangible (a one-page brief, an outline, or a prototype page). If more remain, bundle them under `Open questions` in the brief and keep moving.
- Never invent audience facts, numbers, or sources. Defaults cover taste and structure, not evidence.
- Every `Assumed` item names what it would invalidate downstream if wrong, so a later correction can use `status.mjs invalidate`.
