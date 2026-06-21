# PRESENTATION-BRIEF

## Audience

- Primary audience: Software Developers and Tech Leads
- Secondary audience: Product Managers interested in AI features
- What they already know: Basic concepts of LLMs (tokens, prompting, completion)

## Problem

- Decision or tension: Moving from one-shot code generation to bounded agentic execution without confusing capability with unlimited autonomy.
- Why it matters now: Coding agents can read repositories, make multi-file edits, run checks, and use execution feedback, so developers need a clear mental model for both the loop and its safety boundaries.

## Outcome

- What should change after the presentation: Developers will know how an agent structures its loop (read, plan, write, verify) and will match human review to the risk and reversibility of each action.

## Promise

- What the presentation will help the audience do, decide, or understand: Understand how tool feedback changes the workflow from one-shot generation to iterative correction without treating any historical benchmark as a promise of current performance.

## Evidence threshold

- Required proof level: Research-enhanced. Any numerical benchmark claim must use a primary source with its date, benchmark variant, retrieval setup, denominator, and caveat.
- Claims that need hard support: The historical SWE-bench result on slide 4. The loop contrast remains qualitative and must not imply a measured causal uplift.

## Constraints

- Time: 5 minutes (5 slides)
- Format: Open-slide presentation; export and notes verification remain a separate production-QA step
- Tone: Technical, clear, structured, objective
- Non-negotiables: Explain the core loop clearly, label illustrative tools, use risk-based safety gates, and frame the 2023 SWE-bench result as historical.

## Success test

- Observable signal that the presentation worked: The audience can accurately explain the difference between a prompt completion and an agentic loop.

## Out of scope

- Topics to exclude: Deep neural network architectural details of the underlying LLMs.
- Questions to defer: Specific vendor pricing, current leaderboard rankings, and claims that one loop design guarantees a fixed benchmark gain.
