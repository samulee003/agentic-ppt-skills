# GRILL-LOG

Append rows. Never delete or rewrite rows from other phases or earlier runs; a
later row for the same node replaces the earlier one. `Node` is an id from
`make-presentation/references/grill-tree.md`. `Status` is `Decided`,
`Assumed`, or `Deferred`.

> Worked example: the user's answers are illustrative, written to show the format.

| Phase | Node | Question | Recommended answer | Decision | Status | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| product-grill | profile | Use the default profile? | Yes, `default`. | `default` | Decided | English talk for developers; no training profile needed. | — |
| product-grill | deck-type | Is this a technical explainer? | Yes, `technical`. | `technical` | Decided | The notes teach a mechanism; no decision is requested. | story-architecture |
| product-grill | audience | Developers and tech leads who know LLM basics, with PMs as a secondary audience? | Yes. | Developers and tech leads; PMs secondary. | Decided | Matches the meetup invitation in the source notes. | evidence, story-architecture |
| product-grill | outcome | After the talk, can they explain the read-plan-write-verify loop and match review to risk? | Yes. | Explain the loop; gate human review by consequence and reversibility. | Decided | User confirmed in round 1. | story-architecture |
| product-grill | promise | Promise: understand how tool feedback turns one-shot generation into iterative correction, without treating a benchmark as a performance promise? | Yes. | As recommended. | Decided | User confirmed in round 2. | story-architecture |
| product-grill | evidence-threshold | Should we cover agent benchmarks? | Yes, but use one primary-source historical baseline and avoid an unsupported modern comparison. | Use Claude 2's 1.96% BM25 result on full SWE-bench from the 2023 paper; contrast with iterative feedback qualitatively. | Decided | The notes' "< 5% vs 30%+" SWE-bench Lite comparison had no source or controlled denominator. | evidence, story-architecture, deck-prototype, stage-grill, production-qa |
| product-grill | constraints | Five minutes, five slides, English on screen and spoken? | Yes. | 5 slides, 5 minutes, English. | Decided | Meetup lightning-talk slot. | story-architecture, deck-prototype |
| product-grill | deliverables | Presenting deck only, `.pptx` plus `.pdf`? | Yes. | Presenting deck; `.pptx` and `.pdf`. | Decided | No reading version is sent afterwards. | production-qa |
| product-grill | brand | No brand template? | Yes, none. | None. | Decided | Personal talk at a community meetup. | deck-prototype |
| product-grill | visual | Use `editorial-minimal`? | Yes. | `editorial-minimal` | Assumed | Reversible; the user said "pick something clean" and will see it on the prototype. | deck-prototype |
| product-grill | success-test | Success = attendees can explain completion vs agentic loop in their own words? | Yes. | As recommended. | Decided | User confirmed in round 2. | — |
| product-grill | out-of-scope | Exclude model internals, vendor pricing, and leaderboard rankings? | Yes. | As recommended. | Decided | User confirmed in round 2. | story-architecture |
| story-grill | structure | Is the term 'agentic coding' too broad? | Yes, clarify it specifically means prompt loops + tool usage. | Focus specifically on Prompt Loop and Tool usage. | Decided | Avoids confusing the audience with general LLM chat. | story-architecture, deck-prototype |
| story-grill | opposition | Does the historical baseline prove that agent loops cause a specific performance gain? | No. Separate the sourced baseline from the qualitative loop mechanism. | State that execution feedback can inform retries; provide no second number and no causal uplift claim. | Decided | Benchmark variants, models, retrieval, tools, and evaluation settings are not interchangeable. | story-architecture, deck-prototype, stage-grill, production-qa |
| story-grill | headline-test | Do the five action titles alone tell the argument? | Yes, after rewriting slide 1 from a topic label to "Agentic coding is a loop, not a single answer". | Rewrite slide 1's title; keep the other four. | Decided | "The Anatomy of Agentic Coding" said nothing on its own. | story-architecture, deck-prototype |
| story-grill | counter-evidence | Put the "no fixed uplift" caveat on slide 4 rather than in backup? | Yes. | On slide 4, as a bullet and in the notes. | Decided | The objection will be raised live in a 5-minute talk; there is no Q&A backup time. | deck-prototype |
| story-grill | cuts | Cut the multi-agent "future" section from the notes? | Yes. | Cut. | Decided | It does not serve the promise and does not fit five minutes. | story-architecture |
| deck-prototype | engine | Build with `claude-pptx`? | Yes. | `claude-pptx` (also built with Marp and PptxGenJS as separate examples). | Decided | Editable `.pptx` for the organiser. | deck-prototype, production-qa |
| deck-prototype | visual-confirm | Keep `editorial-minimal` after seeing the prototype pages? | Yes. | Keep it. | Decided | User approved the prototype pages. | — |
| deck-prototype | representative-set | Prototype the hero, the loop diagram, and the 1.96% data slide? | Yes. | As recommended. | Decided | They cover the hook, the mechanism, and the only number. | — |
| stage-grill | opening | Does slide 1 deliver the promise in the first 30 seconds? | Yes. | Keep the hero line; say "workflow, not a vendor product" in the first sentence. | Decided | Sets the frame before the loop slide. | stage-grill |
| stage-grill | timing | Do the slides fit 5 minutes, and is slide 4's benchmark detail the first trim? | Yes. | 30 + 60 + 60 + 90 + 60 seconds; trim slide 4's setup sentence first. | Decided | Timed read-through came to 4:50. | stage-grill |
| stage-grill | challenges | Are the sandbox tool names actual vendor APIs? | No. Label them as illustrative. | Keep generic example names and say interfaces and permissions vary. | Decided | Prevents the demo from implying a vendor-specific contract. | deck-prototype, stage-grill, production-qa |
| stage-grill | challenges | Should every command or file write require approval? | No. Gate by consequence, reversibility, permissions, and scope. | Require human review for risky or irreversible actions; let bounded routine work proceed. | Decided | A universal approval rule is neither accurate nor a useful safety design. | deck-prototype, stage-grill, production-qa |
| stage-grill | language | English on screen and spoken, plain register? | Yes. | As recommended. | Decided | Read aloud once; no stumbles. | — |
