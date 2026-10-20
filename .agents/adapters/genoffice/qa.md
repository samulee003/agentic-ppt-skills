# GenOffice: deck-qa gate

Engine rules for the `production-qa` gate when the deck is built with [GenOffice](https://github.com/genspark-ai/genoffice). The pipeline skill (`presentation-deck-qa`) calls this; the generic backbone (align content, verify preview, export, record) lives in that skill — this file supplies the GenOffice-specific verification, speaker-notes injection, rendering, and exports.

## Prerequisites — read this first

Resolve the `genoffice` CLI binary (`genoffice` on `PATH`, `~/.genoffice/launcher`, or `/Applications/GenOffice.app/Contents/Resources/cli/genoffice` on macOS) and confirm the deck's staged source files exist under `slides/<deck-id>/` (`style.md`, `outline.json`, `pages/01.json` … `pages/NN.json`).

## 1. Validate outline & every page spec

Before building the final `.pptx`, run `slides check` across the outline and every page spec:

```bash
genoffice slides check slides/<deck-id>/outline.json --json
for f in slides/<deck-id>/pages/*.json; do
  genoffice slides check "$f" --json
done
```

Confirm zero errors, zero `detail.audit` geometry issues, zero `detail.outline.findings`, and zero unintended `detail.style.offPalette` colors.

## 2. Build the native `.pptx` and attach 1:1 speaker notes

1. Assemble the `.pptx` from the checked page specs:
   ```bash
   mkdir -p exports
   genoffice create --type pptx \
     --spec slides/<deck-id>/pages \
     --outline slides/<deck-id>/outline.json \
     --out exports/<deck-id>.pptx \
     --force --json
   ```
2. Attach speaker notes (`setNotes` op, 0-based `slide` index) for **every slide** so `Slide Count === Speaker Note Count`:
   ```json
   [
     { "op": "setNotes", "target": { "slide": 0 }, "text": "Speaker notes for slide 1..." },
     { "op": "setNotes", "target": { "slide": 1 }, "text": "Speaker notes for slide 2..." }
   ]
   ```
   Apply the notes batch atomically:
   ```bash
   genoffice slides apply exports/<deck-id>.pptx --ops slides/<deck-id>/notes-ops.json --json
   ```
3. Read back the full deck structure to verify 1:1 parity of slides and speaker notes:
   ```bash
   genoffice slides read exports/<deck-id>.pptx --full --json
   ```

## 3. Preview surface & geometry audit

GenOffice provides both a **deterministic geometry auditor** and a **headless page/grid renderer**:

1. **Geometry audit** (`out_of_bounds`, `off_slide`, `text_overflow`, `text_overflow_width`, `overlap`, `picture_distorted`):
   ```bash
   genoffice slides audit exports/<deck-id>.pptx --json
   ```
   - `detail.issues` MUST be empty (`[]`).
   - If any issue is reported, either fix the coordinates in `slides/<deck-id>/pages/NN.json` and run `genoffice slides replace exports/<deck-id>.pptx --slide <n> --spec slides/<deck-id>/pages/NN.json --json` (where `n` is 0-based and `NN` is `n+1`), or apply the `suggest` `setTransform` op via `genoffice slides apply`. Re-apply speaker notes for any replaced slide (`slides replace` rebuilds that slide).
2. **Visual render & contact-sheet inspection**:
   ```bash
   genoffice render exports/<deck-id>.pptx --out slides/<deck-id>/shots --grid --scale 2 --json
   ```
   - Open the contact sheet (`slides/<deck-id>/shots/<deck-id>-grid.png`) and full-resolution slide PNGs (`<deck-id>-01.png`, …) with your vision tool.
   - Verify projector readability, balanced optical centering, CJK/Latin line-wrap cleanliness, and zero visual collisions.

## 4. Companion PDF export

Produce the matching PDF from the verified `.pptx` using GenOffice's on-device renderer:

```bash
genoffice convert exports/<deck-id>.pptx --to pdf --out exports/<deck-id>.pdf --force --json
# Verify PDF page count and 16:9 geometry:
genoffice info exports/<deck-id>.pdf --json
```

### Mandatory QA verification checklist

1. **Strict 1:1 Parity**:
   - `Outline Page Count === Page Spec File Count === PPTX Slide Count === Speaker Note Count === PDF Page Count`.
2. **Zero Audit Defects**:
   - `genoffice slides audit exports/<deck-id>.pptx --json` returns `status: "ok"` with `detail.issues: []` and zero `detail.imageFailures`.
3. **Visual Contact-Sheet & Full-Slide Inspection**:
   - Contact sheet (`--grid`) and dense/changed slides inspected at `--scale 2` PNG resolution.
4. **File Lock & Overwrite Hygiene**:
   - If GenOffice returns exit code 2 (`file_open_in_gui`), ask the user to close the tab in the GenOffice editor or write to a fresh `--out` path before re-running QA.

## Evidence to record

In the `QA-REPORT.md` `## Preview` and `## Exports` sections, capture:

- Preview: the `genoffice slides audit` JSON summary (`issues: 0`), the contact sheet path (`<deck-id>-grid.png`), and which individual slide PNGs were inspected at 2x scale.
- Exports: direct links to `exports/<deck-id>.pptx` and `exports/<deck-id>.pdf`, exact slide/note/PDF page counts, and confirmation that speaker notes were verified via `genoffice slides read --full --json`.
