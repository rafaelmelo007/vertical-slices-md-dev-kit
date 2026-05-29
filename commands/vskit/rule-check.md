**Task:** Re-evaluate one or all active rules for a feature against SPEC and codebase.

**Input:** `<slug> [<rule-id>]`
- `<slug>` — feature folder name under `docs/features/`
- `<rule-id>` — optional `RUL-NN` to check a single rule; omit to check all active rules

**Owner:** `security-specialist` by default. Per-rule override: if the rule row has a `Scorer:` field, use that agent instead.

**For each rule evaluated:**

**Spec check:** evaluate the rule rule against the current SPEC.md (all sections). Determine:
- Verdict: `PASS` / `FAIL` / `INDETERMINATE`
- Confidence: 0–100%
- Reasoning: one paragraph explaining the verdict
- Top 5 enforcement files: paths most relevant to upholding this rule, ordered by relevance

**Code check:** evaluate the rule rule against the actual codebase (use SPEC `Touches:` pathspec as scope, fallback to full repo). Same output shape.

**Confidence rules:**
- Confidence < 60% → force verdict to `INDETERMINATE` (INV-3 — do not present soft answers as authoritative)
- Typical PASS: 80–95%, typical FAIL: 70–90%

**Update RULES.md** for each evaluated rule:
- `Last Spec Check` column: `<date> · <verdict> · <confidence>% · <reasoning summary>`
- `Last Code Check` column: same shape
- `Top 5 Enforcement Files` column: comma-separated paths

**Exit behavior:**
- Exit non-zero if any `High` or `Critical` severity rule has verdict `FAIL` at confidence ≥ 80% (spec OR code check).
- Print summary:
```
Checked: N rules
  PASS: N  |  FAIL: N  |  INDETERMINATE: N
Hard-block rules (High/Critical FAIL ≥ 80%): <list or "none">
```

**Writes:** `RULES.md` — `Last Spec Check`, `Last Code Check`, `Top 5 Enforcement Files` columns updated for each evaluated rule.
