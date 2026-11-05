# Revising an existing deck

Use when the source is a finished deck (`.pptx`, `.pdf`, Google Slides export,
or an engine source) and the user wants it improved, translated, rebranded, or
tightened rather than rebuilt from notes.

## Decide the scope first

At `source-intake`, run the existing deck through the checks before reading it
in detail:

```bash
node .agents/skills/make-presentation/scripts/pptx-check.mjs <deck.pptx> --json
```

Then classify the request in `SOURCE-INVENTORY.md` (and confirm at `product-grill`):

| Scope | What changes | Gates |
| --- | --- | --- |
| `polish` | wording, layout fixes, type floors, notes | all gates run, `fast-track` mode; product and story gates confirm the existing brief and storyline instead of writing new ones |
| `rebrand` | theme or brand template only | as `polish`, plus the theme or brand template recorded in the brief |
| `translate` | language of slides and notes | as `polish`; evidence re-checks any figure whose definition is language- or region-specific |
| `restructure` | storyline, slide order, cuts | `general` or `research-enhanced`; story gates run in full |

## Rules

- Never edit the original file in place. Work on a copy in the work area or
  rebuild in the chosen engine.
- Reconstruct the missing artifacts from the deck: the implied brief, a ledger
  of the claims on its slides, and a storyboard of its current slides with
  action titles. Mark reconstructed rows `Inferred`.
- Keep slides whose job is already done well; record them as reused in
  `SOURCE-INVENTORY.md`.
- To keep the original file's master and native objects, prefer the `genoffice`
  engine (`slides read` → `slides apply`) for `polish`, `rebrand`, and
  `translate`. Rebuild in another engine only for `restructure` or when the
  user accepts a new master.
- A `polish` that turns into a storyline change is a `restructure`: switch mode
  with `status.mjs set-mode` and say so.
