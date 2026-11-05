# Simulated run log

A full pipeline run with a simulated user, made to find where the skills break.
Everything "Ms Chan" says was written by the agent; the case, the figures, and
the logo are fictional.

- **Persona:** Ms Chan (陳姑娘), supervisor at an elderly-services centre in Macau.
- **Deck:** a 45-minute workshop for about 20 new frontline staff, "building
  trust when an elder refuses service".
- **Profile:** `training-zh-hant`, written Chinese on slides, Cantonese notes.
- **Engine:** `claude-pptx`, `sticker-pop` theme.
- **Started from:** `npx github:samulee003/agentic-ppt-skills` into an empty folder.

## What happened at each gate

| Gate | What happened | Checks |
| --- | --- | --- |
| 1 Source intake | Inventoried one notes file; flagged the missing spreadsheet and the unsourced "80%" claim as *Missing* | `source-check` clean |
| 2 Brief | Two grilling rounds, 14 questions, all decided by the user (13 nodes) | `grill-check` clean |
| 3 Evidence | Two internal figures (B), the method and a case (B), the "80%" claim rejected (D) | `ledger-check` (after fix 2) |
| 4 Story | 4MAT, 12 main slides plus 1 backup | `storyboard-check`, `ledger-check` clean |
| 5 Story review | Four adversaries; 4 findings kept (2 Act on), 1 dropped | `interrogation-check`, `grill-check` clean |
| 6 Prototype | Built with PptxGenJS; render review fixed a bad line break and loose connectors | `pptx-check` clean |
| 7 Stage review | Interrogation found unplanned minutes, a practice claim stated as fact, a role-play card with no answer; all fixed. Later `storyboard-check` showed the timing was still unrealistic, so the gate was invalidated, the timing re-grilled (44 → 39.5 minutes), and passed again | all clean |
| 8 QA | First pass blocked: the logo, the spreadsheet, and the "80%" source were still *Missing*. After the user resolved or accepted them, every check passed | `qa-deck` (pptx, plan, ledger, grill, source) clean |

## What the run found, and the fix for each

| # | Found | Kind | Fix |
| --- | --- | --- | --- |
| 1 | The grill tree's dependency chains needed **5 rounds** for the brief | friction | Shorter chains; round 1 also confirms everything the sources answer; a test keeps the brief at 3 rounds or fewer |
| 2 | `ledger-check` failed a **rejected (D) claim for having no source**, though that is why it was rejected | bug | D rows may have no source or date |
| 3 | The profile forbade colloquial Cantonese on slides, but the deck **teaches Cantonese opening lines** | rule conflict | Quoted dialogue in 「」 may stay spoken |
| 4 | Fixing an Act-on finding removed its quote, so **`interrogation-check` called the fix a misquote** | bug | A resolved finding whose quote is gone is a warning, not an error |
| 5 | **Promised inputs** (logo, spreadsheet) were listed as *Missing* at gate 1 and never checked again; the deck passed QA with a placeholder logo | gap | *Missing* rows carry a status; `qa-deck` runs `source-check --final`, which blocks while any row is `Open`; `pptx-check` flags placeholder text |
| 6 | Slots of 3–4 minutes had **notes that take 15 seconds** to say; the 44-minute plan was not real | gap | `storyboard-check` compares each slot with its notes (scheduled activities like 「大約兩分鐘」 count) |
| 7 | `STATUS.md` stored the **source folder as an absolute path**, so the project broke when moved | bug | Stored relative to the work root |
| 8 | The training profile asks for a **take-home scaffold**, but no artifact or brief field existed for it | gap | A *Handouts* line in the brief; the profile and deck types say to build it as a printable last slide |

Two problems were caught by looking at the renders, not by any script: the
opening line on slide 6 broke as 「好正｜常」, and the slide 4 connectors
missed their cards. The skills already require that look; this run is why.

## Not covered by this run

- PowerPoint itself (rendered with LibreOffice; fonts substituted).
- A real person's answers: the grilling rounds show the format, not how long a
  real supervisor takes or which questions annoy her.
- The retro after the talk.
