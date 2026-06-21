---
marp: true
theme: default
size: 16:9
title: The Anatomy of Agentic Coding
---

<!-- _color: #1a1814 -->
<!-- _backgroundColor: #f7f5f0 -->

# The Anatomy of Agentic Coding

How an agent structures its loop — and where the safety boundaries live.

<!--
Welcome. Five slides, five minutes. We'll cover the loop, the tools, the one historical benchmark, and how human review matches risk.
-->

---

## The Prompt Loop

**Read → Plan → Write → Verify** — then repeat using execution feedback.

- **Read:** the agent loads repository context
- **Plan:** it chooses the next bounded action
- **Write:** it makes multi-file edits
- **Verify:** it runs checks and reads the result

Each retry uses what the last attempt learned.

<!--
This is the core mental model. The loop is bounded, not autonomous — each turn is one action, verified, before the next.
-->

---

## Tools connect the model to the world

Files · commands · search · tests — *the interface shown is illustrative.*

- A tool is a **named, permissioned capability** the model can call
- The shown names (read / edit / run / search) are illustrative, not a specific product's API
- What matters is the **contract**: input in, result back, model decides the next step

<!--
Tool names here are placeholders. The point is the shape: the model never executes directly — it calls a tool that a runtime guards.
-->

---

## One historical benchmark — read carefully

The **2023 Claude 2 + BM25** result on full SWE-bench is **1.96%**.

- **Source:** SWE-bench paper, arXiv:2310.06770v1, Table 5
- **Setup:** Claude 2 with BM25 retrieval, full SWE-bench
- **What it is:** a historical baseline
- **What it is NOT:** SWE-bench Lite, a current leaderboard figure, or a measure of iterative-loop uplift

The loop can retry using feedback — that is qualitative, not a measured gain.

<!--
claim-01 (the 1.96% figure) is safety level A: supportable as historical fact, but only with date, dataset, and retrieval caveats. Do not let it read as a performance promise.
-->

---

## Human review matches risk

Autonomy needs boundaries — **calibrated to consequence.**

- Match review to the action's **consequence**, **reversibility**, and **scope**
- A risky, irreversible, broad action needs a human; a safe, reversible, narrow one may not
- This is **risk-based review**, not "approve everything" or "approve nothing"

<!--
The closing principle: the loop's safety is not a switch but a dial, turned per action.
-->
