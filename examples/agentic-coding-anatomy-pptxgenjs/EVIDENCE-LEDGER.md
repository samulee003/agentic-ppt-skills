# EVIDENCE-LEDGER

Mode: research-enhanced. Every material claim on the deck is classified to a safety level and resolved.

## Claims

### claim-01 — SWE-bench 1.96% figure (slide 4)

- **Safety level: A** — directly supportable historical fact, usable in the main talk.
- **Statement:** "The 2023 Claude 2 + BM25 result on full SWE-bench is 1.96%."
- **Source:** SWE-bench paper, arXiv:2310.06770v1, Table 5.
- **Required caveats (must travel with the claim):**
  - Date: 2023 (historical baseline, not current).
  - Variant: full SWE-bench (not SWE-bench Lite).
  - Setup: Claude 2 with BM25 retrieval.
  - Denominator: full SWE-bench instance set.
- **Rejection triggers:** do not present as a current leaderboard result, a controlled estimate of agent-loop uplift, or a SWE-bench Lite figure.

### claim-02 — Iterative loop uses feedback to retry (slide 4)

- **Safety level: B** — cautious qualitative interpretation, usable with a hedge.
- **Statement:** "The loop can retry using feedback — that is qualitative, not a measured gain."
- **Source:** the loop model itself (read/plan/write/verify); no numerical source.
- **Required caveats:** must remain qualitative. Do not attach a percentage, an uplift factor, or a comparison to the 1.96% figure.

## Rejected claims

- "Current comparison number" (e.g. a modern leaderboard %): rejected — no primary source verified at the deck's evidence threshold. The deck explicitly avoids any current figure.
