# Arena: competing prototype directions

Adapted from the MIT-licensed [`arena`](https://github.com/backnotprop/pstack/tree/main/skills/arena) and `principle-exhaust-the-design-space` skills in `backnotprop/pstack`. Use it at `deck-prototype` when one attempt would lock in the wrong visual or narrative direction.

## When to run

Run the arena when any of these is true:
- the brief's visual direction is still a vague adjective, or two registered themes both fit
- the deck is high stakes (external audience, keynote, funding, policy)
- the first prototype page was rejected twice

Skip it in `fast-track` mode, for decks under 10 slides, or when the user has already named an exact theme and reference deck.

## Phases

1. **Frame.** Write the shared prompt: the representative set from `presentation-prototype/references/prototype-set.md`, the brief, the storyboard slice, and the engine adapter. Derive a rubric of 3 to 6 gradeable criteria for this deck, for example: one dominant message per slide, projector legibility at the declared type scale, archetype variety, fidelity to the declared visual direction, speakability of the notes. Candidates see the task. Only the picker sees the rubric.
2. **Fan out.** Make 2 or 3 candidates, each with a deliberately different direction (for example a different theme from `themes/*.md`, a different archetype mix, or a different cover concept). Each candidate lives in its own slide folder, `slides/<deck-id>-arena-a`, `-b`, `-c`, so nothing is overwritten. When subagents are available, run candidates in parallel. Otherwise build them one after another and cap each at the representative set (opening, thesis, evidence, dense page, ending).
3. **Cross-judge.** When subagents are available, spawn one read-only judge that sees the rubric and the rendered candidates by label and scores each criterion. Otherwise score them yourself from renders, not from source code.
4. **Pick a base.** Score each candidate criterion by criterion from the actual renders. Compare with the judge. Pick the base that is easiest to extend across the full deck without breaking the page grammar. If two are tied, take the simpler one.
5. **Graft.** From each runner-up, port one or two specific elements into the base (a cover treatment, a card style, a diagram pattern). Fold them in by hand so the deck still follows one visual system.
6. **Verify.** Run the engine's live review on the grafted result. If verification exposes a problem a candidate had already solved, return to the graft step.

If all candidates converge, that is agreement. Ship the consensus and skip grafting. If they diverge wildly, the frame was under-specified: tighten it and re-run once instead of averaging.

## Cleanup and record

Keep only the winning slide folder as `slides/<deck-id>`. Delete or archive the candidate folders so they do not leak into exports. Write a short synthesis note under `## Arena` in `GRILL-LOG.md`: candidates tried, the base and why, each graft with its source, what was rejected, and the verification result.
