---
name: presentation-story-architecture
description: Turns an approved brief and supported claims into a thesis, audience journey, chapter roles, transitions, and slide-by-slide jobs for the main talk and backup. Incorporates human-writing craftsmanship, diagram-design visual pattern mapping, and subagent parallel expansion rules. Use when the story-architecture gate is current for a presentation project or when a router asks for the story and storyboard.
---

# Build the story architecture

Use when `story-architecture` is the current gate.

- Read repo instructions, `PRESENTATION-BRIEF.md`, `EVIDENCE-LEDGER.md`, and cited source files before structuring the talk.
- Require one memorable thesis.
- Require an explicit audience change from where the talk starts to where it should end.
- Write `STORY.md` from `templates/STORY.md`.
- Write `STORYBOARD.md` from `templates/STORYBOARD.md`.
- Build the story from the approved brief and supported evidence claims only.
- If a chapter needs unsupported evidence, return the work to evidence instead of letting the chapter enter the story.
- Assign each chapter a role such as context, tension, proof, decision, action, or closing commitment.
- Write spoken transitions that explain why the next chapter or slide must exist.
- Separate the main-talk range from backup or Q&A material.
- Require one necessary job and one dominant message per slide. Split the slide rather than shrink text or pack distinct messages onto one page. Remove ornamental, duplicate, or “nice to have” pages.

## Human-Writing & Narrative Craftsmanship (`human-writing`)

- **Material-First**: Base every slide's dominant message on verified evidence, real data, or concrete case studies. Never invent hypothetical filler to inflate page count.
- **Zero AI Clichés**: Ban empty buzzwords, corporate jargon, fake slogans, "不是...而是..." formulaic sentences, and symmetric bullet padding.
- **Audience-Centric Progression**: Ensure each slide naturally resolves the audience's immediate question raised by the previous slide.

## Wang Yong-Fu (福哥) Instructional Design (`wang-yongfu-teaching-craft`)

- **Opening 5 Essentials (開場五件事)**: Structure Opening Slides (01-03) with:
  1. Self-Intro (Why Me / Credibility)
  2. Ice-breaker (Relevant, low-risk emotional connection)
  3. Roadmap & Time Agenda
  4. Team Dynamics / Alignment
  5. Commitment Request (Easy-to-commit micro-actions)
- **Interactive Teaching Method Mapping**: In `STORYBOARD.md`, assign each slide/section its active learning modality:
  - `問答法 (Questioning)`: Cue -> Mirror -> Praise -> Insight
  - `個案討論/事件還原法 (Case Reconstruction)`: Incident -> Dilemma Choice -> Reveal Reality
  - `PESOS 演練法 (Practice)`: Explain -> Demonstrate -> Practice -> Feedback
  - `小組討論法 (Group Dialogue)`: Prompt -> Timeboxed Discussion -> Report -> Summary
- **"Teacher Speaks Less, Students Learn More"**: Shift cognitive load to the audience through prompts, choices, and exercises rather than endless lecturing.

## Visual Pattern Mapping (`diagram-design`)

In `STORYBOARD.md`, assign each slide a concrete visual archetype from `diagram-design` (39 patterns) or UI layout:
- `Hero/Title`: High-impact typography + single subtitle
- `KPI/Metrics`: 2–4 bold numeric callout cards
- `Architecture/System`: Component blocks + directional data paths
- `Matrix/Quadrant`: 2×2 decision or prioritization matrix
- `Process/Timeline`: Linear or stage progression with distinct milestones
- `Flywheel/Loop`: Reinforcing state cycle
- `Comparison/Table`: Side-by-side card grid or 2-column contrast

## Sub-agent Parallel Deck Expansion Rules

Once the representative prototype (Gate 6) is approved:
- Split the `STORYBOARD.md` chapters across **parallel sub-agents** (e.g. Chapter 1 slides to Agent A, Chapter 2 slides to Agent B).
- Each sub-agent consumes the approved `design` token system, layout rules, and component patterns, drafting their assigned `Page` components in parallel.
- Assemble the generated pages into `slides/<id>/index.tsx` before proceeding to Gate 7 (`stage-grill`).