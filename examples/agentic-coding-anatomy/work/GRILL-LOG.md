# GRILL-LOG

Append rows. Preserve existing decisions from other phases and earlier runs.

| Phase | Question | Recommended answer | Decision | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- |
| product-grill | Should we cover agent benchmarks? | Yes, but use one primary-source historical baseline and avoid an unsupported modern comparison. | Use Claude 2's 1.96% BM25 result on full SWE-bench from the 2023 paper; contrast with iterative feedback qualitatively. | The original generic SWE-bench Lite comparison had no support or controlled denominator. | evidence, story-architecture, deck-prototype, stage-grill, production-qa |
| product-grill | What should the slide count constraint be? | Exactly 5 slides. | 5 slides total. | 5-minute presentation limit. | story-architecture, deck-prototype |
| story-grill | Is the term 'agentic coding' too broad? | Yes, clarify it specifically means prompt loops + tool usage. | Focus specifically on Prompt Loop and Tool usage. | Avoids confusing audience with general LLM chat. | storyboard, deck-prototype |
| story-grill | Does the historical baseline prove that agent loops cause a specific performance gain? | No. Separate the sourced baseline from the qualitative loop mechanism. | State that execution feedback can inform retries; provide no second number and no causal uplift claim. | Benchmark variants, models, retrieval, tools, and evaluation settings are not interchangeable. | storyboard, deck-prototype, stage-grill, production-qa |
| stage-grill | Are the shown sandbox tool names actual Open-slide or vendor APIs? | No. Label them as illustrative. | Keep generic example names and explicitly say interfaces and permissions vary. | Prevents the demo from implying a vendor-specific implementation contract. | deck-prototype, stage-grill, production-qa |
| stage-grill | Should every command or file write require approval? | No. Gate by consequence, reversibility, permissions, and scope. | Require human review for risky or irreversible actions; allow bounded routine work to proceed autonomously. | A universal approval claim is neither accurate nor a useful safety design rule. | deck-prototype, stage-grill, production-qa |
