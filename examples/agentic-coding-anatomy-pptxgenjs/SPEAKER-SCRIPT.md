# SPEAKER-SCRIPT

Deck: `slides/build.mjs` → 5 native-shape PPTX pages. Total: ~5 minutes.

## Page 1 — Welcome (0.5m)

> "Let's explore the anatomy of agentic coding. Five slides, five minutes: the loop, the tools, the one historical benchmark, and how human review matches risk."

Hold on the title. Do not preview slide 4's number.

## Page 2 — The Prompt Loop (1m)

> "The core mental model is a loop: read, plan, write, verify — then repeat. The agent loads repository context, chooses one bounded action, makes the edit, runs the checks, and reads the result. Each retry uses what the last attempt learned. Note: bounded, not autonomous. Each turn is one action, verified, before the next."

## Page 3 — Tools connect the model to the world (1m)

> "To do this, the agent needs tools — files, commands, search, tests. The names shown here are illustrative, not a specific product's API. What matters is the contract: input in, result back, and the model decides the next step. The model never executes directly; it calls a tool that a runtime guards."

## Page 4 — One historical benchmark — read carefully (1.5m)

> "This feedback loop changes what the next attempt can use — and there's one number people reach for. The 2023 Claude 2 result with BM25 retrieval on full SWE-bench is 1.96 percent. Source: the SWE-bench paper, Table 5. Hear the caveats: it's a 2023 historical baseline, full SWE-bench not Lite, BM25 retrieval. It is not a current leaderboard figure and it is not a measure of what the iterative loop adds. The loop can retry using feedback — that part stays qualitative."

This is the slide's load-bearing moment. Say every caveat.

## Page 5 — Human review matches risk (1m)

> "Ultimately, autonomy needs boundaries — calibrated to consequence. Match your review to the action's consequence, reversibility, and scope. A risky, irreversible, broad action needs a human; a safe, reversible, narrow one may not. This is risk-based review, not 'approve everything' and not 'approve nothing.' The loop's safety is a dial, turned per action."

## Readability / timing checks

- Every page's speaker notes fit the page's density at ≤1.5m. ✅
- Page 4 is the longest (1.5m) — warranted by the caveats. ✅
- No page reads faster than ~130 words spoken. ✅
- Speaker notes are embedded in `build.mjs` via `addNotes(...)` and survive into the PPTX.
