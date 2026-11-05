# GRILL-LOG

Two tables. **Rounds**: one row per round you actually asked, with the node ids
it asked and the user's reply copied verbatim. **Decisions**: one row per node;
a `Decided` row names its round. Append; never delete rows from other phases or
earlier runs. A later row for the same node replaces the earlier one. `Status`
is `Decided` (the user answered in that round), `Assumed` (you chose; say why),
or `Deferred` (waiting on someone else). See `make-presentation/references/grill-tree.md`.

> Worked example: the user's answers are illustrative, written to show the format.

## Rounds

| Round | Phase | Nodes asked | User reply (verbatim) |
| --- | --- | --- | --- |
| P1 | product-grill | profile, deck-type, audience, deliverables, brand | Yes to all. |
| P2 | product-grill | outcome, constraints | Yes. |
| P3 | product-grill | evidence-threshold, promise, visual, success-test, out-of-scope, must-avoid | Yes to all; and no robot pictures, please. |
| P4 | product-grill | imagery | Yes. |
| S1 | story-grill | structure, opposition, headline-test, cuts | Yes. Agreed on the slide 1 title. |
| S2 | story-grill | counter-evidence, slide-budget | Yes. |
| V1 | deck-prototype | engine, representative-set | Looks good, keep it. |
| V2 | deck-prototype | visual-confirm | Yes. |
| T1 | stage-grill | opening, timing, challenges, language | Yes to all. |

## Decisions

| Phase | Node | Question | Recommended answer | Decision | Status | Round | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| product-grill | profile | Use the default profile? | Yes, `default`. | `default` | Decided | P1 | English talk for developers; no training profile needed. | — |
| product-grill | deck-type | Is this a technical explainer? | Yes, `technical`. | `technical` | Decided | P1 | The notes teach a mechanism; no decision is requested. | story-architecture |
| product-grill | audience | Developers and tech leads who know LLM basics, with PMs as a secondary audience? | Yes. | Developers and tech leads; PMs secondary. | Decided | P1 | Matches the meetup invitation in the source notes. | evidence, story-architecture |
| product-grill | outcome | After the talk, can they explain the read-plan-write-verify loop and match review to risk? | Yes. | Explain the loop; gate human review by consequence and reversibility. | Decided | P2 | User confirmed in round 1. | story-architecture |
| product-grill | promise | Promise: understand how tool feedback turns one-shot generation into iterative correction, without treating a benchmark as a performance promise? | Yes. | As recommended. | Decided | P3 | User confirmed in round 2. | story-architecture |
| product-grill | evidence-threshold | Should we cover agent benchmarks? | Yes, but use one primary-source historical baseline and avoid an unsupported modern comparison. | Use Claude 2's 1.96% BM25 result on full SWE-bench from the 2023 paper; contrast with iterative feedback qualitatively. | Decided | P3 | The notes' "< 5% vs 30%+" SWE-bench Lite comparison had no source or controlled denominator. | evidence, story-architecture, deck-prototype, stage-grill, production-qa |
| product-grill | constraints | Five minutes, five slides, English on screen and spoken? | Yes. | 5 slides, 5 minutes, English. | Decided | P2 | Meetup lightning-talk slot. | story-architecture, deck-prototype |
| product-grill | deliverables | Presenting deck only, `.pptx` plus `.pdf`? | Yes. | Presenting deck; `.pptx` and `.pdf`. | Decided | P1 | No reading version is sent afterwards. | production-qa |
| product-grill | brand | No brand template? | Yes, none. | None. | Decided | P1 | Personal talk at a community meetup. | deck-prototype |
| product-grill | visual | Use `editorial-minimal`? | Yes. | `editorial-minimal` | Decided | P3 | Round 2: chose editorial-minimal from three samples | deck-prototype |
| product-grill | success-test | Success = attendees can explain completion vs agentic loop in their own words? | Yes. | As recommended. | Decided | P3 | User confirmed in round 2. | — |
| product-grill | out-of-scope | Exclude model internals, vendor pricing, and leaderboard rankings? | Yes. | As recommended. | Decided | P3 | User confirmed in round 2. | story-architecture |
| product-grill | must-avoid | Anything the deck must never show? | No vendor logos, no robot stock photos, no leaderboard claims | As recommended | Decided | P3 | Round 2 | deck-prototype |
| product-grill | imagery | Diagrams and one data figure, no photos? | Yes | As recommended | Decided | P4 | Round 2 | deck-prototype |
| story-grill | structure | Is the term 'agentic coding' too broad? | Yes, clarify it specifically means prompt loops + tool usage. | Focus specifically on Prompt Loop and Tool usage. | Decided | S1 | Avoids confusing the audience with general LLM chat. | story-architecture, deck-prototype |
| story-grill | opposition | Does the historical baseline prove that agent loops cause a specific performance gain? | No. Separate the sourced baseline from the qualitative loop mechanism. | State that execution feedback can inform retries; provide no second number and no causal uplift claim. | Decided | S1 | Benchmark variants, models, retrieval, tools, and evaluation settings are not interchangeable. | story-architecture, deck-prototype, stage-grill, production-qa |
| story-grill | headline-test | Do the five action titles alone tell the argument? | Yes, after rewriting slide 1 from a topic label to "Agentic coding is a loop, not a single answer". | Rewrite slide 1's title; keep the other four. | Decided | S1 | "The Anatomy of Agentic Coding" said nothing on its own. | story-architecture, deck-prototype |
| story-grill | counter-evidence | Put the "no fixed uplift" caveat on slide 4 rather than in backup? | Yes. | On slide 4, as a bullet and in the notes. | Decided | S2 | The objection will be raised live in a 5-minute talk; there is no Q&A backup time. | deck-prototype |
| story-grill | cuts | Cut the multi-agent "future" section from the notes? | Yes. | Cut. | Decided | S1 | It does not serve the promise and does not fit five minutes. | story-architecture |
| story-grill | slide-budget | Five slides for five minutes, one idea each, multi-agent section cut? | Yes | As recommended | Decided | S2 | Story round | — |
| deck-prototype | engine | Build with `claude-pptx`? | Yes. | `claude-pptx` (also built with Marp and PptxGenJS as separate examples). | Decided | V1 | Editable `.pptx` for the organiser. | deck-prototype, production-qa |
| deck-prototype | visual-confirm | Keep `editorial-minimal` after seeing the prototype pages? | Yes. | Keep it. | Decided | V2 | User approved the prototype pages. | — |
| deck-prototype | representative-set | Prototype the hero, the loop diagram, and the 1.96% data slide? | Yes. | As recommended. | Decided | V1 | They cover the hook, the mechanism, and the only number. | — |
| stage-grill | opening | Does slide 1 deliver the promise in the first 30 seconds? | Yes. | Keep the hero line; say "workflow, not a vendor product" in the first sentence. | Decided | T1 | Sets the frame before the loop slide. | stage-grill |
| stage-grill | timing | Do the slides fit 5 minutes, and is slide 4's benchmark detail the first trim? | Yes. | 30 + 60 + 60 + 90 + 60 seconds; trim slide 4's setup sentence first. | Decided | T1 | Timed read-through came to 4:50. | stage-grill |
| stage-grill | challenges | Are the sandbox tool names actual vendor APIs? | No. Label them as illustrative. | Keep generic example names and say interfaces and permissions vary. | Decided | T1 | Prevents the demo from implying a vendor-specific contract. | deck-prototype, stage-grill, production-qa |
| stage-grill | challenges | Should every command or file write require approval? | No. Gate by consequence, reversibility, permissions, and scope. | Require human review for risky or irreversible actions; let bounded routine work proceed. | Decided | T1 | A universal approval rule is neither accurate nor a useful safety design. | deck-prototype, stage-grill, production-qa |
| stage-grill | language | English on screen and spoken, plain register? | Yes. | As recommended. | Decided | T1 | Read aloud once; no stumbles. | — |
