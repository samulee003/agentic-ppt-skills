# SOURCE-INVENTORY

## Source root

- Path: presentation-source/agentic-coding-anatomy/
- Intake date: 2026-06-21
- Reviewer: Open-slide demo review

## Handoff docs

- Read: raw_notes.md
- Open questions carried in: None

## File map

| Path | Type | Topic | Lineage class | Relationship | Latest source | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| raw_notes.md | Markdown | Topic overview and core concepts | draft | Original notes | Yes for structure | Original 5-slide outline; benchmark numbers are unsupported and must not be reused |
| https://arxiv.org/abs/2310.06770 | Academic paper | Original SWE-bench benchmark and 2023 model baselines | primary | External benchmark source | Yes for the historical claim | Use v1 / 2023 framing; Table 5 reports Claude 2 at 1.96% with BM25 retrieval |

## Authoritative

| Topic | Source path | Why authoritative | Evidence note |
| --- | --- | --- | --- |
| Agent loop structure | raw_notes.md | Original deck brief | Supports the read-plan-write-verify teaching structure, not benchmark performance |
| Historical SWE-bench baseline | https://arxiv.org/abs/2310.06770v1 | Original 2023 SWE-bench paper | Full benchmark contains 2,294 tasks; Table 5 reports Claude 2 at 1.96% resolved with BM25 retrieval |

## Reusable

| Asset or source | Reuse role | Conditions | Notes |
| --- | --- | --- | --- |
| None | - | - | - |

## Stale

| Path | Superseded by | Risk if reused | Notes |
| --- | --- | --- | --- |
| raw_notes.md benchmark section | Jimenez et al., SWE-bench (2023 v1) | Contains an unsupported generic SWE-bench Lite comparison | Retain only as provenance for why the claim was audited |

## Conflict

| Topic | Conflicting sources | Working assumption | Resolution needed |
| --- | --- | --- | --- |
| Benchmark performance | raw_notes.md vs original SWE-bench paper | Use only the paper's precise historical 1.96% Claude 2 result; make no numbered modern comparison | Resolved in deck and evidence ledger |

## Missing

| Needed item | Why needed | Likely owner or location | Next step |
| --- | --- | --- | --- |
| Current agent benchmark comparison | Would be needed for a present-day numerical claim | Current benchmark paper or official leaderboard with variant and date | Out of scope; the deck intentionally uses no current comparison number |

## Access issue

| Blocked item | Why blocked | Impact | Help needed |
| --- | --- | --- | --- |
| None | - | - | - |
