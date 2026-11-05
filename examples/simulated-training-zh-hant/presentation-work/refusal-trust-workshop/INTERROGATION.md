# INTERROGATION

One section per round (`story-grill`, then `stage-grill`). See
`make-presentation/references/interrogate.md`.

> Simulated run: the findings were written by the agent playing each adversary.

## Round: story-grill

### Intent

> 約 20 位新同工聽完 45 分鐘後，被拒絕時唔放棄，識得用三步。This round decides whether the storyboard survives the people in that room.

### Adversaries

- the veteran who thinks this is obvious: 2 raised, 1 kept
- the participant who will try it tomorrow: 1 raised, 1 kept
- the manager who paid for it: 1 raised, 1 kept
- the newcomer: 1 raised, 1 kept

### Findings

| ID | Adversary | Slide | Quote | Proof type | Proof | Verdict | Bucket | Resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | the veteran who thinks this is obvious | 2 | 去年三成新個案首次被拒，其中過半之後接受服務 | ledger | `E2` caveat: "does not show the three steps caused it"; slide 2 sits right before the method, so the room will hear "the method works" | kept | Act on | Speaker note for slide 2 says the figures show refusal is not the end, not that the method caused acceptance (SPEAKER-SCRIPT.md row 2) |
| S2 | the veteran who thinks this is obvious | 6 | 先承認對方的感受，不急著說服 | unanswered | "Does acknowledging mean agreeing to close the case?" | dropped | | Slide 6 is a split with the example line and step 2 follows; it answers this |
| S3 | the participant who will try it tomorrow | 7 | 第二步：只提一個五分鐘的小請求 | unanswered | "What if the elder refuses even five minutes?" Searched STORYBOARD.md and STORY.md: no slide or note covers it | kept | Consider | Recommended: add it as a variant card in the role-play (slide 10), not a new slide |
| S4 | the manager who paid for it | 10 | 角色扮演：兩人一組，十五分鐘完成三步 | arithmetic | 20 people = 10 pairs; swapping roles gives each person about 7 minutes and leaves no debrief, while the main talk already totals 44 of 45 minutes | kept | Act on | Slide 10's 15 minutes become two 5-minute rounds with swapped roles plus a 5-minute debrief (SPEAKER-SCRIPT.md row 10) |
| S5 | the newcomer | 4 | 拒絕多數是在保護尊嚴，不是針對你 | unanswered | "How do I tell protecting dignity apart from really not needing help?" Searched STORYBOARD.md and STORY.md | kept | Noted | Partly out of scope (capacity assessment); answered verbally: "if unsure, keep visiting and ask your supervisor" |

### Dropped

- the veteran who thinks this is obvious: 1 dropped, because slide 6's example line already answers it.

## Round: stage-grill

### Intent

> Same audience and promise. This round decides whether the talk works aloud, in 45 minutes, in Cantonese, with role-play.

### Adversaries

- the veteran who thinks this is obvious: 1 raised, 1 kept
- the participant who will try it tomorrow: 1 raised, 1 kept
- the manager who paid for it: 1 raised, 1 kept
- the newcomer: 1 raised, 1 kept

### Findings

| ID | Adversary | Slide | Quote | Proof type | Proof | Verdict | Bucket | Resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | the manager who paid for it | 6 | 第一步：先承認對方的感受，不急著說服 | arithmetic | Slides 6–8 get 3 minutes each, but their notes are 67, 52, and 45 characters, about 11–17 seconds aloud at 4 characters a second; over 7 minutes are unplanned | kept | Act on | Each of slides 6–8 now ends with a two-minute prompt for the room (notes.json, SPEAKER-SCRIPT.md rows 6–8) |
| T2 | the veteran who thinks this is obvious | 7 | 請求越小，對方越容易答應 | ledger | Stated as a general fact, but `E4` is "Practice-based, not a research finding" | kept | Act on | On-screen line now reads 「本中心經驗：請求越小，越容易開始」 (build.mjs slide 7) |
| T3 | the newcomer | 10 | 變化卡：長者連五分鐘都不肯，你會怎樣做？ | unanswered | "What is the answer?" Searched SPEAKER-SCRIPT.md row 10 and the slide: no suggested answer | kept | Act on | Slide 10's note now gives one: leave a contact card and agree to come back (SPEAKER-SCRIPT.md row 10) |
| T4 | the participant who will try it tomorrow | 3 | 請舉手作答 | unanswered | "What about the quiet ones who won't raise a hand?" | kept | Noted | The supervisor reads the room; no slide change |

### Dropped

- none
