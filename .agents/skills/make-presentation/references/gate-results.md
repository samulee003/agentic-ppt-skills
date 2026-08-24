# Gate result translation

Focused skills return one structured result. The router passes it to the status helper instead of interpreting prose.

| Result | Status action |
| --- | --- |
| `passed` | Set the reporting gate to `passed` with actual artifact provenance. |
| `blocked` | Set the reporting gate to `blocked`. |
| `needs_revision: product-grill` | Run `result`; it will invalidate product-grill and reviewed downstream gates. |
| `needs_revision: evidence` | Run `result`; it will invalidate evidence and reviewed downstream gates. |

```bash
node .agents/skills/make-presentation/scripts/status.mjs result presentation-work/demo story-grill passed "Opposition review complete" --artifact presentation-work/demo/GRILL-LOG.md --input presentation-work/demo/STORY.md --decision "Keep the challenged thesis"
node .agents/skills/make-presentation/scripts/status.mjs result presentation-work/demo story-grill "needs_revision: product-grill" "The promise is wrong"
node .agents/skills/make-presentation/scripts/status.mjs result presentation-work/demo story-grill "needs_revision: evidence" "Counter-evidence is missing"
```

Every passed result requires at least one actual `--artifact <path>`. For multi-output gates, repeat `--artifact`; for example Production QA records `QA-REPORT.md`, PPTX, and PDF as separate paths. Repeat `--input` and `--decision` to preserve the evidence and consequential choices behind the review.

Do not manually translate `needs_revision: product-grill` to the story gate. It means invalidate product-grill. Likewise, `needs_revision: evidence` means invalidate evidence.
