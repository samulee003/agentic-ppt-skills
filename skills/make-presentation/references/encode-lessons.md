# Encode lessons in structure

Adapted from the MIT-licensed `correct`, `reflect`, and `principle-encode-lessons-in-structure` skills in `backnotprop/pstack`. When the user corrects the same kind of deck mistake twice, change the pipeline so the next run cannot repeat it.

## Trigger

A mistake class counts once it has happened twice: text overflow, CJK line breaks, missing speaker notes, stale numbers, mismatched slide and note counts, off-palette colors, repeated layouts, AI-sounding copy.

## Fix at the highest level that works

1. **Eliminate it in the template or engine.** Put the rule in the theme, the layout library, or the page template so the wrong thing cannot be authored. Delete old patterns an agent would copy.
2. **Enforce it with a deterministic check.** Prefer an existing validator: `status.mjs validate`, `genoffice slides check`, `genoffice slides audit`, `scripts/unslop-check.mjs`, the engine's build. If none exists, add one whose error names the file and the fix.
3. **Test it.** Add a test that fails on a real past mistake. Show it failing before the fix.
4. **Write a skill or reference note last.** Only for judgment calls nothing can check.

## Rule table

Keep this table current. Each rule pairs with what enforces it. A rule enforced only by docs is a repeat risk.

| Rule | Enforced by | Level |
| --- | --- | --- |
| Gates run in order and a passed gate has artifact provenance | `scripts/status.mjs` (`validate`, `result`) | check |
| Slide count equals note count equals PDF page count | `genoffice slides read --full`, `qa.md` checklist; open-slide export check | check (engine) |
| No text overflow, off-slide or overlapping boxes | `genoffice slides audit` (`detail.issues` empty) | check (engine) |
| Colors stay in the deck palette | `genoffice slides check` (`offPalette`) | check (engine) |
| No repeated layout on consecutive content pages | `genoffice slides check` outline findings | check (engine) |
| Slide copy and notes avoid AI tells | `scripts/unslop-check.mjs --strict` | check |
| One dominant message per slide, no 3-tier text walls | `presentation-prototype` guardrails | doc (judgment) |
| Evidence claims trace to the ledger | `presentation-evidence` | doc (judgment) |

## When corrected

Fix the mistake. Then look up the rule in the table. If it is missing, add it at the highest level you can. If it is present and nothing enforces it, treat it as a repeat: move enforcement up a level in the same change. Drop a rule once its mistake can no longer happen.

Reply with each mistake class, the evidence (the two occurrences), the level you picked, and why a higher level did not work.
