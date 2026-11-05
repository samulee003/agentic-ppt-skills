# GRILL-LOG

Two tables. **Rounds**: one row per round you actually asked, with the node ids
it asked and the user's reply copied verbatim. **Decisions**: one row per node;
a `Decided` row names its round. Append; never delete rows from other phases or
earlier runs. A later row for the same node replaces the earlier one. `Status`
is `Decided` (the user answered in that round), `Assumed` (you chose; say why),
or `Deferred` (waiting on someone else). See `make-presentation/references/grill-tree.md`.

## Rounds

| Round | Phase | Nodes asked | User reply (verbatim) |
| --- | --- | --- | --- |

## Decisions

| Phase | Node | Question | Recommended answer | Decision | Status | Round | Reason | Invalidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
