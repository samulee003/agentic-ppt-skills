# Unslop: cut AI tells from slide copy and speaker notes

Adapted from the MIT-licensed [`unslop`](https://github.com/backnotprop/pstack/tree/main/skills/unslop) skill in `backnotprop/pstack`. Rule numbers match upstream so findings can cite them. Use this file with `speak-human-tw` when the deck is Traditional Chinese.

## When to run

| Gate | What to scan |
| --- | --- |
| `story-architecture` | draft on-screen copy and spoken transitions in `STORYBOARD.md` |
| `deck-prototype` | slide text in the prototype pages |
| `stage-grill` | every speaker note and `SPEAKER-SCRIPT.md` |
| `production-qa` | final slide text and notes (last check before export) |

Run the deterministic scan first, then rewrite by hand. Preserve meaning and the intended tone.

```bash
node .agents/skills/make-presentation/scripts/unslop-check.mjs <file-or-dir>... [--strict]
```

The script prints `file:line  rule  matched text  fix`. It exits `0` unless `--strict` is passed and a finding exists. It catches surface patterns only. Rules 27 to 33 still need your judgment.

## Rules that apply to slides and notes

Content
- **3. Superficial -ing phrases.** "highlighting", "ensuring", "showcasing". Delete, or name the real source.
- **5. Vague attributions.** "Experts believe", "Studies show". Name the source from `EVIDENCE-LEDGER.md` or delete the claim.

Language
- **7. AI vocabulary.** additionally, crucial, delve, enhance, landscape (abstract), pivotal, showcase, tapestry, testament, underscore, vibrant. Use the plain word.
- **8. Fancy ways to say "is".** "serves as", "stands as", "boasts". Say "is" or "has".
- **9. "Not just X, but Y."** State the point directly.
- **10. Rule of three.** Do not force a third item. Use the natural count.
- **11. Synonym cycling.** Pick one term for one thing and repeat it.

Style
- **13. Em dashes.** Use a period or comma.
- **15. Boldface overuse.** Bold only the one phrase the audience must remember.
- **16. Inline-header restatement.** `**Cost:** Cost rose...` becomes one sentence.
- **17. Title case headings.** Use sentence case for English slides.
- **18. Decorative emoji.** Remove. The prototype rules already forbid OS emoji as icons.

Filler and plain speech
- **23. Filler phrases.** "In order to" becomes "To". Delete "It is important to note that".
- **25. Generic conclusions.** "The future looks bright" becomes a specific next step, date, or number.
- **26. Abstract metaphor nouns.** substrate, vector, nexus, paradigm, bedrock, scaffolding, north star, flywheel. Use the concrete word.
- **27. Say what it does, not how it feels.** If a slide line could appear unchanged in another deck, cut it or add the number or mechanism that makes it about this deck.
- **28. Split dense sentences.** One idea per sentence. This matters most in speaker notes, which are read aloud.
- **29. Active voice.** Name the actor.
- **30. Cut adverbs.** "significantly improves" becomes the measured delta from the ledger.
- **32. Mannered prose.** Aphorisms and personified abstractions. Say the literal thing.
- **33. Over-compression.** Do not reduce a slide line to a verbless fragment or arrow-speak. The anti-over-pruning rule in `presentation-story-architecture` applies.

## Chinese decks

On-screen copy stays in written Traditional Chinese, and speaker notes stay in natural spoken phrasing. Run `speak-human-tw` on both. `unslop-check.mjs` also flags common Chinese tells: "不僅…更是", "值得注意的是", "綜上所述", "賦能", "閉環", "抓手", and "讓我們一起".

## Exceptions

Quoted source material, proper names, and legal or clinical wording stay as written. Record each exception inline in `STORYBOARD.md` or `SPEAKER-SCRIPT.md` with the reason.
