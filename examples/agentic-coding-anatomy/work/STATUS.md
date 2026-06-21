# Presentation Status

<!-- presentation-status:start -->
```json
{
  "schemaVersion": 2,
  "deckId": "agentic-coding-anatomy",
  "mode": "research-enhanced",
  "modeReviewedAt": "2026-06-21T00:40:21.555Z",
  "modeReason": "The deck includes a sourced academic benchmark and a numerical comparison.",
  "sourceRoot": "../source",
  "gates": {
    "source-intake": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/SOURCE-INVENTORY.md"
      ],
      "reviewedAt": "2026-06-21T00:45:06.485Z",
      "invalidatedAt": null,
      "inputs": [
        "presentation-source/agentic-coding-anatomy/raw_notes.md",
        "https://arxiv.org/abs/2310.06770v1"
      ],
      "decisions": [
        "Use the paper only for the historical 1.96% Claude 2 BM25 result."
      ],
      "invalidatedBy": [],
      "reason": "Inventoried the original notes and the primary SWE-bench paper; unsupported benchmark numbers are marked stale.",
      "invalidationReason": ""
    },
    "product-grill": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/PRESENTATION-BRIEF.md",
        "presentation-work/agentic-coding-anatomy/GRILL-LOG.md"
      ],
      "reviewedAt": "2026-06-21T00:45:06.595Z",
      "invalidatedAt": null,
      "inputs": [
        "presentation-work/agentic-coding-anatomy/SOURCE-INVENTORY.md"
      ],
      "decisions": [
        "Keep five slides; do not add a current comparison number."
      ],
      "invalidatedBy": [],
      "reason": "Reframed the deck around one sourced historical baseline and a qualitative iterative-loop contrast.",
      "invalidationReason": ""
    },
    "evidence": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/EVIDENCE-LEDGER.md"
      ],
      "reviewedAt": "2026-06-21T00:45:06.668Z",
      "invalidatedAt": null,
      "inputs": [
        "https://arxiv.org/abs/2310.06770v1"
      ],
      "decisions": [
        "Claim 1 is main-talk safe with date, dataset, and retrieval caveats; claim 2 remains qualitative."
      ],
      "invalidatedBy": [],
      "reason": "Mapped the historical benchmark to safety A and the qualified loop mechanism to safety B.",
      "invalidationReason": ""
    },
    "story-architecture": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/STORY.md",
        "presentation-work/agentic-coding-anatomy/STORYBOARD.md"
      ],
      "reviewedAt": "2026-06-21T00:45:06.738Z",
      "invalidatedAt": null,
      "inputs": [
        "presentation-work/agentic-coding-anatomy/EVIDENCE-LEDGER.md"
      ],
      "decisions": [
        "Slide 4 separates historical evidence from qualitative loop mechanics."
      ],
      "invalidatedBy": [],
      "reason": "Aligned the thesis, story, storyboard, and Q&A with the historical baseline and risk-based safety framing.",
      "invalidationReason": ""
    },
    "story-grill": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/GRILL-LOG.md"
      ],
      "reviewedAt": "2026-06-21T00:45:06.807Z",
      "invalidatedAt": null,
      "inputs": [
        "presentation-work/agentic-coding-anatomy/STORY.md"
      ],
      "decisions": [
        "Reject universal benchmark uplift and universal approval claims."
      ],
      "invalidatedBy": [],
      "reason": "Recorded decisions on benchmark scope, illustrative tools, causal caution, and risk-based approvals.",
      "invalidationReason": ""
    },
    "deck-prototype": {
      "status": "passed",
      "artifacts": [
        "apps/demo/slides/agentic-coding-anatomy/index.tsx"
      ],
      "reviewedAt": "2026-06-21T00:45:06.877Z",
      "invalidatedAt": null,
      "inputs": [
        "presentation-work/agentic-coding-anatomy/STORYBOARD.md"
      ],
      "decisions": [
        "Tool names are illustrative; slide 2 descriptions use 30px type."
      ],
      "invalidatedBy": [],
      "reason": "Updated the five-slide demo with neutral labeling, readable loop cards, sourced slide 4 content, and five note entries.",
      "invalidationReason": ""
    },
    "stage-grill": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/SPEAKER-SCRIPT.md"
      ],
      "reviewedAt": "2026-06-21T00:45:06.946Z",
      "invalidatedAt": null,
      "inputs": [
        "apps/demo/slides/agentic-coding-anatomy/index.tsx"
      ],
      "decisions": [
        "Slide 4 delivery states the source, setup, denominator, and non-causal caveat."
      ],
      "invalidatedBy": [],
      "reason": "Aligned the speaker script and exported source notes with benchmark caveats and Q&A risks.",
      "invalidationReason": ""
    },
    "production-qa": {
      "status": "passed",
      "artifacts": [
        "presentation-work/agentic-coding-anatomy/QA-REPORT.md",
        "test-results/agentic-coding-anatomy-editable.pptx",
        "test-results/agentic-coding-anatomy-editable.pdf",
        "test-results/agentic-coding-anatomy-final-review/contact-sheet.png"
      ],
      "reviewedAt": "2026-06-21T00:51:04.373Z",
      "invalidatedAt": null,
      "inputs": [
        "apps/demo/slides/agentic-coding-anatomy/index.tsx"
      ],
      "decisions": [
        "Approve five-slide visual-faithful delivery with five speaker notes and historical benchmark caveats."
      ],
      "invalidatedBy": [],
      "reason": "Fresh browser, PPTX, PDF, notes, and PowerPoint checks pass after correcting export-time header/footer wrapping.",
      "invalidationReason": ""
    }
  }
}
```
<!-- presentation-status:end -->

| Gate | Status | Artifacts | Inputs | Decisions | Invalidated by | Reviewed | Review reason | Invalidated | Invalidation reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source-intake | passed | presentation-work/agentic-coding-anatomy/SOURCE-INVENTORY.md | presentation-source/agentic-coding-anatomy/raw_notes.md<br>https://arxiv.org/abs/2310.06770v1 | Use the paper only for the historical 1.96% Claude 2 BM25 result. |  | 2026-06-21T00:45:06.485Z | Inventoried the original notes and the primary SWE-bench paper; unsupported benchmark numbers are marked stale. |  |  |
| product-grill | passed | presentation-work/agentic-coding-anatomy/PRESENTATION-BRIEF.md<br>presentation-work/agentic-coding-anatomy/GRILL-LOG.md | presentation-work/agentic-coding-anatomy/SOURCE-INVENTORY.md | Keep five slides; do not add a current comparison number. |  | 2026-06-21T00:45:06.595Z | Reframed the deck around one sourced historical baseline and a qualitative iterative-loop contrast. |  |  |
| evidence | passed | presentation-work/agentic-coding-anatomy/EVIDENCE-LEDGER.md | https://arxiv.org/abs/2310.06770v1 | Claim 1 is main-talk safe with date, dataset, and retrieval caveats; claim 2 remains qualitative. |  | 2026-06-21T00:45:06.668Z | Mapped the historical benchmark to safety A and the qualified loop mechanism to safety B. |  |  |
| story-architecture | passed | presentation-work/agentic-coding-anatomy/STORY.md<br>presentation-work/agentic-coding-anatomy/STORYBOARD.md | presentation-work/agentic-coding-anatomy/EVIDENCE-LEDGER.md | Slide 4 separates historical evidence from qualitative loop mechanics. |  | 2026-06-21T00:45:06.738Z | Aligned the thesis, story, storyboard, and Q&A with the historical baseline and risk-based safety framing. |  |  |
| story-grill | passed | presentation-work/agentic-coding-anatomy/GRILL-LOG.md | presentation-work/agentic-coding-anatomy/STORY.md | Reject universal benchmark uplift and universal approval claims. |  | 2026-06-21T00:45:06.807Z | Recorded decisions on benchmark scope, illustrative tools, causal caution, and risk-based approvals. |  |  |
| deck-prototype | passed | apps/demo/slides/agentic-coding-anatomy/index.tsx | presentation-work/agentic-coding-anatomy/STORYBOARD.md | Tool names are illustrative; slide 2 descriptions use 30px type. |  | 2026-06-21T00:45:06.877Z | Updated the five-slide demo with neutral labeling, readable loop cards, sourced slide 4 content, and five note entries. |  |  |
| stage-grill | passed | presentation-work/agentic-coding-anatomy/SPEAKER-SCRIPT.md | apps/demo/slides/agentic-coding-anatomy/index.tsx | Slide 4 delivery states the source, setup, denominator, and non-causal caveat. |  | 2026-06-21T00:45:06.946Z | Aligned the speaker script and exported source notes with benchmark caveats and Q&A risks. |  |  |
| production-qa | passed | presentation-work/agentic-coding-anatomy/QA-REPORT.md<br>test-results/agentic-coding-anatomy-editable.pptx<br>test-results/agentic-coding-anatomy-editable.pdf<br>test-results/agentic-coding-anatomy-final-review/contact-sheet.png | apps/demo/slides/agentic-coding-anatomy/index.tsx | Approve five-slide visual-faithful delivery with five speaker notes and historical benchmark caveats. |  | 2026-06-21T00:51:04.373Z | Fresh browser, PPTX, PDF, notes, and PowerPoint checks pass after correcting export-time header/footer wrapping. |  |  |
