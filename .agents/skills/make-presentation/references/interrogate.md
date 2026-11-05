# Interrogate the deck

Adapted from the MIT-licensed [`interrogate`](https://github.com/backnotprop/pstack/tree/main/skills/interrogate)
skill in `backnotprop/pstack`: adversaries try to break the work, and **a
finding survives only when it is proven**. Grilling questions the author;
interrogation questions the deck. Run it at `story-grill` (on the story,
storyboard, and ledger) and at `stage-grill` (on the renders, speaker script,
and exported file).

## 1. Frame

Write the intent in one paragraph: audience, outcome, promise, and what this
interrogation must decide. Take it from the brief's `## Playback`.

## 2. Cast the adversaries

Pick at least three for the deck type, always including **the newcomer**.

| Deck type | Adversaries |
| --- | --- |
| `decision` | the CFO who doubts every number; the operator who must execute it; the rival sponsor whose budget it takes; the newcomer |
| `update` | the executive who only reads titles; the dependent team waiting on you; the auditor; the newcomer |
| `pitch` | the buyer comparing you to the incumbent; procurement; the internal champion who must re-tell it; the newcomer |
| `training` | the veteran who thinks this is obvious; the participant who will try it tomorrow; the manager who paid for it; the newcomer |
| `keynote` | the skeptic in row one; the journalist looking for a quote; the person who checked their phone for two minutes; the newcomer |
| `technical` | the senior reviewer; the on-call engineer who runs it; the security reviewer; the newcomer |

A profile may add adversaries in its *Story architecture* or *Stage grill*
section.

## 3. Attack

Give each adversary the intent, its persona, and the artifact paths. When
subagents are available, run one per adversary in parallel, each read-only;
otherwise run them one after another and say so. Each adversary reports
findings in this shape:

- **Slide**: the slide number (or `deck` for the whole talk).
- **Quote**: the exact words from the slide, title, note, or story, copied verbatim.
- **Proof type** and **Proof**, one of:

| Proof type | What proves it |
| --- | --- |
| `ledger` | the claim in the quote has no `EVIDENCE-LEDGER.md` row, or its row is safety `C`/`D`, or its allowed use excludes the main talk. Proof: the claim ID and what is wrong, or `no row` |
| `contradiction` | two places disagree. Proof: the second quote in double quotes, with its location |
| `check` | a script reports it. Proof: the exact output line from `storyboard-check.mjs`, `pptx-check.mjs`, or `grill-check.mjs` |
| `arithmetic` | numbers, percentages, or timings do not add up. Proof: the calculation |
| `unanswered` | a question this adversary will ask that no slide, backup slide, or note answers. Proof: the question, and the files searched |

Opinions without proof ("feels long", "might confuse people") are not
findings. Re-word them as an `unanswered` question or drop them.

## 4. Verify

You are the lead. For every finding, re-read the proof against the files:
the quote must exist verbatim, the ledger row must say what the finding claims,
the second quote must exist, the check line must reproduce, the arithmetic must
be right. Keep a finding only when the proof holds **and** the failure breaks
the intent. Merge findings that share a root cause. Run
`node .agents/skills/make-presentation/scripts/interrogation-check.mjs <work-root>`:
it re-verifies quotes and claim IDs mechanically.

## 5. Judge and resolve

Sort every kept finding into a bucket from `review-buckets.md` (Act on,
Consider, Noted). Every **Act on** finding gets a *Resolution*: the change
made (with the file), or the gate result it triggers (`needs_revision: evidence`,
`needs_revision: product-grill`). Settle the gate's grill nodes from the
result: `opposition`, `counter-evidence`, and `cuts` at `story-grill`;
`challenges` at `stage-grill`.

Write everything to `INTERROGATION.md` from
`presentation-story-grill/templates/INTERROGATION.md`. Append the stage-grill
round below the story-grill round; never delete earlier rounds.
