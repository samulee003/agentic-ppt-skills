# INTERROGATION

One section per round (`story-grill`, then `stage-grill`). See
`make-presentation/references/interrogate.md`.

> Worked example: the findings are illustrative, written to show the format.

## Round: story-grill

### Intent

> Developers and tech leads should leave able to explain the read-plan-write-verify loop and match human review to risk, without reading the 2023 benchmark as a performance promise. This round decides whether the storyboard survives its harshest technical audience.

### Adversaries

- the senior reviewer: 2 raised, 1 kept
- the on-call engineer: 1 raised, 1 kept
- the security reviewer: 1 raised, 1 kept
- the newcomer: 2 raised, 1 kept

### Findings

| ID | Adversary | Slide | Quote | Proof type | Proof | Verdict | Bucket | Resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | the senior reviewer | 4 | Feedback lets each retry build on the last, beyond a 1.96% baseline | ledger | `claim-02` is safety B with "no numerical uplift"; "beyond a baseline" can be heard as a measured gain | kept | Act on | Slide 4 adds "Gains vary by model, tools, and task" and the note says the slide claims no universal uplift (`slides/build.mjs`, `SPEAKER-SCRIPT.md` row 4) |
| S2 | the senior reviewer | 4 | In the original 2023 SWE-bench paper, Claude 2 resolved 1.96 percent | ledger | `claim-01` says full SWE-bench with BM25; the old notes compared SWE-bench Lite numbers | dropped | | The current slide uses `claim-01` exactly; the Lite comparison was already removed at product-grill |
| S3 | the newcomer | 2 | The agent reads, plans, writes, and verifies in a repeating loop | unanswered | "When does the loop stop?" Searched STORYBOARD.md and SPEAKER-SCRIPT.md | dropped | | `SPEAKER-SCRIPT.md` row 2 answers it: completion criteria, budgets, escalation |
| S4 | the newcomer | 1 | Agentic coding is a loop, not a single answer | unanswered | "What is the 'single answer' it is compared to?" Searched STORYBOARD.md and SPEAKER-SCRIPT.md: no slide or note names one-shot completion | kept | Consider | Recommended: say "one autocomplete suggestion" in the first spoken line; settled at stage-grill |
| S5 | the security reviewer | 3 | Tools connect the model to files, commands, search, and tests | unanswered | "What stops run_command from deleting the repo?" Only covered as a Q&A risk in SPEAKER-SCRIPT.md row 3, not on any slide | kept | Noted | Slide 5 covers approval by risk; the Q&A answer is in the script |
| S6 | the on-call engineer | 5 | Human review should match each action's consequence, reversibility, and scope | unanswered | "Who decides what counts as irreversible?" Searched STORYBOARD.md and SPEAKER-SCRIPT.md | kept | Noted | Out of scope for a 5-minute talk; listed as a Q&A risk |

### Dropped

- the senior reviewer: 1 dropped, because the Lite comparison is no longer in the deck.
- the newcomer: 1 dropped, because the script already answers it.

## Round: stage-grill

### Intent

> Same audience and promise. This round decides whether the talk works aloud, in five minutes, for someone hearing it once.

### Adversaries

- the senior reviewer: 1 raised, 1 kept
- the person who checked their phone for two minutes: 1 raised, 1 kept
- the newcomer: 1 raised, 1 kept

### Findings

| ID | Adversary | Slide | Quote | Proof type | Proof | Verdict | Bucket | Resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | the newcomer | 4 | with BM25 retrieval | unanswered | "What is BM25?" Searched SPEAKER-SCRIPT.md row 4 and the slide: never explained | kept | Consider | If asked, answer "a keyword search that picks which files the model sees"; not worth slide space in 5 minutes |
| T2 | the person who checked their phone for two minutes | 5 | Human review should match each action's consequence, reversibility, and scope | unanswered | "What was the point?" Slide 5 is the last slide and the talk has no recap line | kept | Act on | `SPEAKER-SCRIPT.md` row 5 now ends on the thesis: "a loop, with review matched to risk" |
| T3 | the senior reviewer | 4 | That is a historical baseline, not a current leaderboard result | arithmetic | 30 + 60 + 60 + 90 + 60 seconds = 5:00 with no margin for the BM25 question | kept | Noted | First trim is slide 4's setup sentence (stage-grill `timing`) |

### Dropped

- none
