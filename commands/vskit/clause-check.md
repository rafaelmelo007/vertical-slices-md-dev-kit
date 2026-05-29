**Task:** Re-evaluate one or all active clauses for a feature against SPEC and codebase.

**Input:** `<slug> [<clause-id>]`
- `<slug>` — feature folder name under `docs/features/`
- `<clause-id>` — optional `CLA-NN` to check a single clause; omit to check all active clauses

**Owner:** `security-specialist` by default. Per-clause override: if the clause row has a `Scorer:` field, use that agent instead.

**For each clause evaluated:**

**Spec check:** evaluate the clause rule against the current SPEC.md (all sections). Determine:
- Verdict: `PASS` / `FAIL` / `INDETERMINATE`
- Confidence: 0–100%
- Reasoning: one paragraph explaining the verdict
- Top 5 enforcement files: paths most relevant to upholding this clause, ordered by relevance

**Code check:** evaluate the clause rule against the actual codebase (use SPEC `Touches:` pathspec as scope, fallback to full repo). Same output shape.

**Confidence rules:**
- Confidence < 60% → force verdict to `INDETERMINATE` (INV-3 — do not present soft answers as authoritative)
- Typical PASS: 80–95%, typical FAIL: 70–90%

**Update CLAUSES.md** for each evaluated clause:
- `Last Spec Check` column: `<date> · <verdict> · <confidence>% · <reasoning summary>`
- `Last Code Check` column: same shape
- `Top 5 Enforcement Files` column: comma-separated paths

**Exit behavior:**
- Exit non-zero if any `High` or `Critical` severity clause has verdict `FAIL` at confidence ≥ 80% (spec OR code check).
- Print summary:
```
Checked: N clauses
  PASS: N  |  FAIL: N  |  INDETERMINATE: N
Hard-block clauses (High/Critical FAIL ≥ 80%): <list or "none">
```

**Writes:** `CLAUSES.md` — `Last Spec Check`, `Last Code Check`, `Top 5 Enforcement Files` columns updated for each evaluated clause.
