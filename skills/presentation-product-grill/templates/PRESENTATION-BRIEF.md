# PRESENTATION-BRIEF

## Playback

- One paragraph: what this deck is, for whom, and what must be true after it.

## Profile and deck type

- Profile: (`default`, `training-zh-hant`, or another file in `make-presentation/profiles/`)
- Deck type: (`decision`, `update`, `pitch`, `training`, `keynote`, `technical`; see `references/deck-types.md`)
- Story structure: (default for the deck type, or the override and why)

## Audience

- Primary audience:
- Secondary audience:
- What they already know:

## Problem

- Decision or tension:
- Why it matters now:

## Outcome

- What should change after the presentation:

## Promise

- What the presentation will help the audience do, decide, or understand:

## Evidence threshold

- Required proof level:
- Claims that need hard support:

## Constraints

- Time (talk length, Q&A length):
- Slide time (only when the session has long stretches without slides, such as demos or exercises):
- Venue and screen (room size, projector or screen share, aspect ratio):
- Language on screen / language spoken:
- Tone:
- Non-negotiables:

## Deliverables

- Presenting deck / reading deck / both:
- Handouts (pocket card, checklist, worksheet), if any, and where they live (a printable slide or a separate file):
- Formats: (`.pptx`, `.pdf`, `.html`)
- Must the `.pptx` be natively editable in PowerPoint? (yes → `claude-pptx`, `codex-slides`, `pptxgenjs`, or `genoffice`)
- Where will the team edit it? (PowerPoint, Google Slides → `google-slides`, another tool such as ChatGPT/Gamma/Canva → `handoff`)
- Live file link (Google Slides or external tool), if any:
- Speaker notes language:
- Engine preference, if any: (recorded with `status.mjs set-engine` at the prototype gate)

## Brand template

- Master or template file (`.potx`/`.pptx`) or brand guide:
- What it fixes (palette, fonts, logo placement, title area):

## Visual direction

- Theme: (`make-presentation/themes/<id>.md`, a benchmark deck, or "custom" with the fields below)
- Overrides to the theme (palette, fonts, surfaces), if any:
- Imagery: (drawn illustrations, photography, diagrams only; asset sources)
- Prohibited anti-patterns:

## Success test

- Observable signal that the presentation worked:

## Out of scope

- Topics to exclude:
- Questions to defer:
