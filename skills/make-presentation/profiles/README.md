# Profiles

A profile bundles the defaults for a recurring kind of work: language rules,
deck type, theme, and extra checks. The core skills stay neutral; a profile
adds rules on top. Record it in `PRESENTATION-BRIEF.md` under *Profile*. If no
profile is recorded, use `default`.

| Profile | Use it for |
| --- | --- |
| [`default`](./default.md) | anything; language and structure follow the audience and deck type |
| [`training-zh-hant`](./training-zh-hant.md) | Traditional Chinese training and workshops, with Cantonese delivery |

## Rules

- A profile can add rules and change defaults. It cannot remove a gate, waive
  evidence, or lower the type floors.
- When the brief and the profile disagree, the brief wins; log the override in
  `GRILL-LOG.md`.
- Each focused skill reads the profile's section for its gate, if there is one.
- A profile can add grill nodes in a `json grill-nodes` block (same shape as `references/grill-tree.md`). `grill-check.mjs` requires them when the brief names the profile.

## Adding a profile

Copy `default.md`, keep its headings (one per gate that the profile changes),
and add the file to the table above.
