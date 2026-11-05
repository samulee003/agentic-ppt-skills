# Deck types

The deck type sets the default story structure, opening, density, and what
"done" means. Record it in `PRESENTATION-BRIEF.md`. A profile can set the
default type; the brief can override it.

| Type | Audience wants | Default structure | Open with | Close with |
| --- | --- | --- | --- | --- |
| `decision` (board, exec, investment committee) | the answer and what you need from them | Answer first (pyramid): recommendation → 3 supporting reasons → risks → the ask | the recommendation and the decision requested | the decision, owner, and date |
| `update` (status, QBR, project review) | what changed and what needs attention | Headline → progress vs plan → issues and asks → next period | the one-line status | asks and owners |
| `pitch` (sales, fundraising, partnership) | why this, why you, why now | SCQA or problem → stakes → solution → proof → plan → ask | the customer's problem in their words | the specific next step |
| `training` (workshop, course, onboarding) | to be able to do something new | 4MAT: Why → How it works → What to do → Practice and transfer | the learner's real situation | practice, a take-home scaffold (a printable last slide or a one-page handout listed under *Deliverables*), commitment |
| `keynote` (conference, all-hands, launch) | one idea worth remembering | Tension → journey → revelation → call to action | a story, image, or question | the one idea, restated |
| `technical` (design review, research talk, architecture) | to understand and challenge the reasoning | Problem → constraints → options considered → decision → evidence → open questions | the problem and why it is hard | open questions and what feedback is needed |

## Presenting deck vs reading deck

- **Presenting deck**: built for a speaker. Sparse slides, the detail lives in
  the speaker notes. Default for every type except when the brief says the deck
  will be sent without a presenter.
- **Reading deck**: built to be read alone. Each slide carries a full-sentence
  takeaway and enough supporting text to stand without narration (still within
  the typography floors). Common for `decision` and `update` decks sent before
  a meeting.
- When both are needed, build the presenting deck first, then derive the
  reading deck from it plus the speaker script. Do not try to make one deck do
  both jobs.

Record the choice under *Deliverables* in the brief.

## Action titles and the headline test

For every type except `keynote` section dividers:

- Each slide title is a full sentence that states the slide's takeaway
  ("Churn rose 4 points because of the March price change"), not a topic label
  ("Churn").
- **Headline test**: read only the slide titles, in order. They must tell the
  whole argument on their own. If a title can be removed without a gap in the
  argument, the slide is a candidate for cutting.
- `scripts/storyboard-check.mjs` flags topic-label titles in `STORYBOARD.md`;
  the story grill runs the headline test by hand.
