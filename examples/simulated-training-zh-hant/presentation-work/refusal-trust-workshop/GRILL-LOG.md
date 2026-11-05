# GRILL-LOG

Two tables. **Rounds**: one row per round you actually asked, with the node ids
it asked and the user's reply copied verbatim. **Decisions**: one row per node;
a `Decided` row names its round. Append; never delete rows from other phases or
earlier runs. A later row for the same node replaces the earlier one. `Status`
is `Decided` (the user answered in that round), `Assumed` (you chose; say why),
or `Deferred` (waiting on someone else). See `make-presentation/references/grill-tree.md`.

> Simulated run: the user's answers were written by the agent.

## Rounds

| Round | Phase | Nodes asked | User reply (verbatim) |
| --- | --- | --- | --- |
| P1 | product-grill | profile, deck-type, audience, outcome, constraints, brand, evidence-threshold | 全部照建議。Q6：logo 我之後畀你。 |
| P2 | product-grill | interaction-format, promise, deliverables, visual, success-test, out-of-scope, must-avoid, imagery | 全部照建議，另外唔好用公仔圖。 |
| S1 | story-grill | opposition, headline-test, counter-evidence, cuts, structure, slide-budget | 全部照建議。 |
| V1 | deck-prototype | engine, visual-confirm, representative-set | 好，就咁。 |
| T1 | stage-grill | opening, timing, challenges, language, resets, transfer, framing | 全部照建議。 |
| T2 | stage-grill | timing | 好，時間就咁改。 |

## Decisions

| Phase | Node | Question | Recommended answer | Decision | Status | Round | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| product-grill | profile | Use training-zh-hant? | Yes | `training-zh-hant` | Decided | P1 | Round 1 Q1 | — |
| product-grill | deck-type | Is this a training deck? | Yes | `training` | Decided | P1 | Round 1 Q2 | story-architecture |
| product-grill | audience | ~20 new frontline staff, no home-visit experience? | Yes | As recommended | Decided | P1 | Round 1 Q3 | evidence, story-architecture |
| product-grill | outcome | When refused, don't give up; use the three steps? | Yes | As recommended | Decided | P1 | Round 1 Q4, from the notes | story-architecture |
| product-grill | constraints | 45 min incl. role-play, projector 16:9, written Chinese on screen, Cantonese spoken? | Yes | As recommended | Decided | P1 | Round 1 Q5, from the notes | story-architecture, deck-prototype |
| product-grill | brand | No template; logo on cover and last slide? | Yes | As recommended; logo to follow | Decided | P1 | Round 1 Q6 | deck-prototype |
| product-grill | evidence-threshold | Drop the unsourced "80%" claim; use the internal 2025 figures labelled as internal? | Yes | Drop 80%; use 38/120 and 21/38 as "centre's 2025 review" | Decided | P1 | Round 1 Q7–Q8 | evidence |
| product-grill | interaction-format | Workshop with a 15-minute pair role-play? | Yes | As recommended | Decided | P2 | Round 2 Q9 | story-architecture |
| product-grill | promise | "Three opening lines you can use tomorrow and a plan for not giving up"? | Yes | As recommended | Decided | P2 | Round 2 Q10 | story-architecture |
| product-grill | deliverables | Presenting deck + printable pocket card; editable .pptx? | Yes | As recommended | Decided | P2 | Round 2 Q11 | deck-prototype, production-qa |
| product-grill | visual | Use sticker-pop? | Yes | `sticker-pop` | Decided | P2 | Round 2 Q12 | deck-prototype |
| product-grill | success-test | Every pair completes all three steps in the role-play? | Yes | As recommended | Decided | P2 | Round 2 Q13 | — |
| product-grill | out-of-scope | Exclude safeguarding cases and capacity assessment? | Yes | As recommended | Decided | P2 | Round 2 Q14 | story-architecture |
| product-grill | must-avoid | Anything the slides must never show? (real elders' photos, blaming wording, text-only pages) | None of those | As recommended; also no clip-art | Decided | P2 | Round 2 | deck-prototype |
| product-grill | imagery | Drawn shapes and the centre logo, no photos of people? | Yes | As recommended | Decided | P2 | Round 2 | deck-prototype |
| story-grill | opposition | The veteran's objection (S1): data before method implies causation. Keep the data slide but say it plainly? | Yes, keep it; the note disclaims causation | As recommended | Decided | S1 | Story round Q1 (simulated) | stage-grill |
| story-grill | headline-test | Titles alone tell the 4MAT story (refusal is normal → why → three steps → practise → commit)? | Yes; no gaps | As recommended | Decided | S1 | Story round Q2 | — |
| story-grill | counter-evidence | Put "the figures do not prove the method" in the slide 2 note and the B1 backup, not on screen? | Yes | As recommended | Decided | S1 | Story round Q3 | stage-grill |
| story-grill | cuts | Add "refused even five minutes" as a role-play variant card instead of a new slide (S3)? | Yes | As recommended | Decided | S1 | Story round Q4 | deck-prototype |
| story-grill | structure | Keep the default 4MAT order for training? | Yes | As recommended | Decided | S1 | Story round Q5 | — |
| story-grill | slide-budget | 12 main slides: 3 Why, 1 How, 5 What, 3 practice; role-play gets one slide and 15 minutes? | Yes | As recommended | Decided | S1 | Story round | — |
| deck-prototype | engine | Build with claude-pptx (editable .pptx for next year)? | Yes | `claude-pptx` | Decided | V1 | Prototype round Q1 (simulated) | production-qa |
| deck-prototype | visual-confirm | Seen on the pages, keep sticker-pop? | Yes | Keep; fixed slide 6's line break and slide 4's connectors after review | Decided | V1 | Prototype round Q2 | — |
| deck-prototype | representative-set | Review hero, data, diagram, step 1, role-play, and close first? | Yes | Slides 1, 2, 4, 6, 10, 12 | Decided | V1 | Prototype round Q3 | — |
| stage-grill | opening | Does slide 1's question deliver the promise in the first two minutes? | Yes | As recommended | Decided | T1 | Stage round Q1 (simulated) | — |
| stage-grill | timing | 44 of 45 minutes, with slides 6–8 now carrying room prompts; first trim is slide 4 to one card, then slide 9 to the third visit only? | Yes | As recommended | Decided | T1 | Stage round Q2; finding T1 | — |
| stage-grill | challenges | Hardest questions: causation (B1), "not even five minutes" (slide 10 note), dignity vs no need (verbal)? | Yes | As recommended | Decided | T1 | Stage round Q3; findings T2–T3 | — |
| stage-grill | language | Written Chinese on slides, Cantonese in notes, with quoted opening lines kept in Cantonese? | Yes | As recommended | Decided | T1 | Stage round Q4 | — |
| stage-grill | resets | Attention resets at slide 3 (minute 5), slides 6–8 prompts (minutes 12–21), role-play (minutes 21–36)? | Yes | As recommended | Decided | T1 | Stage round Q5 | — |
| stage-grill | transfer | Each step is rehearsed in the role-play and carried home on the pocket card? | Yes | As recommended | Decided | T1 | Stage round Q6 | — |
| stage-grill | framing | Slide 3 and the notes say refusal is normal, never the worker's fault? | Yes | As recommended | Decided | T1 | Stage round Q7 | — |
| stage-grill | timing | storyboard-check showed the notes could not fill their slots. Rebalance to 39.5 minutes with room prompts on slides 2, 4, 9, and 11, keeping about 5 minutes spare? | Yes | As recommended; replaces the earlier timing row | Decided | T2 | Stage re-grill after invalidation (simulated) | production-qa |
