# STORY

## Thesis

- Memorable thesis: Agentic coding turns one-shot generation into a bounded loop that acts, observes, verifies, and revises.

## Audience change

- Starting state: View AI as a magic autocompleter.
- Ending state: View AI as an agent executing in a risk-bounded prompt loop, with historical benchmarks interpreted in context.

## Audience journey

- Why they should care: Coding agents can act on repositories and execution environments, shifting developer work toward scoping, reviewing, and deciding when intervention is required.
- What they should now believe, decide, or do: Design agent workflows with observable verification, bounded permissions, rollback, and human review for consequential actions.

## Chapters

| Chapter | Role | Main claim | Evidence IDs | Transition in | Transition out |
| --- | --- | --- | --- | --- | --- |
| Chapter 1 | Introduction | Autocomplete vs. Agentic coding | None | Welcome | Introduce loop |
| Chapter 2 | Core loop | The prompt-loop manages files and tests | None | Prompt-loop | Introduce tool-use |
| Chapter 3 | Historical benchmark | Claude 2 resolved 1.96% in the paper's 2023 full SWE-bench BM25 setup; iterative loops add a mechanism for correction, not a guaranteed score | claim-01, claim-02 | Historical context | Introduce safety |
| Chapter 4 | Safeguards | Human review should match action risk and reversibility | None | Safeguards | Wrap up |
| Chapter 5 | Summary | Coding agents shift developer roles to auditing | None | Summary | End Q&A |

## Main-talk range

- Included: Slides 1-5
- Excluded: None

## Backup / Q&A

- Reserve topics:
  - Why 1.96%? It is the Claude 2 BM25-retrieval result in Table 5 of the original 2023 paper on full SWE-bench.
  - Does this prove modern loops achieve a particular uplift? No. The deck makes a qualitative mechanism contrast and provides no current comparison score.
  - Are the tool names standard? No. They are illustrative interfaces; actual tools, permissions, and sandboxes vary.
- Claims that need careful handling: Benchmark version, retrieval setup, dataset size, historical date, and the distinction between a mechanism and a causal performance estimate.
