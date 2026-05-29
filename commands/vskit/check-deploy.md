**Task:** Read-only ship-gate evaluation across all features. Writes nothing.

**No arguments required.** Reads all `docs/features/*/SCORE.md` and `TASKS.md` and `DECISIONS.md` and `CLAUSES.md`.

**For each feature, evaluate hard blocks then soft blocks:**

**Hard blocks (exit code 1 — deploy refused):**
- Security dimension score < 8
- Any TASKS.md entry not `Done`
- `last_scored_sha` missing or empty in SCORE.md
- `git diff <last_scored_sha>..HEAD -- docs/features/<slug>/ <SPEC Touches: paths>` is non-empty (score is stale)
- DECISIONS.md has a row where `Updates` is empty AND the row is not in `## Deferred Items`
- SPEC §8 `Blocked-by:` lists a feature slug not in `Shipped` state
- Any active clause in CLAUSES.md with severity `High` or `Critical`, verdict `FAIL`, confidence ≥ 80% (spec OR code check)

**Soft blocks (exit code 2 — deploy proceeds only with waiver):**
- Composite score < 8.0
- Any scored non-security dimension < 7
- E2E tests do not cover all happy-path ACs (check SCORE.md Test Coverage notes)
- Any active clause with severity `High` or `Critical`, verdict `FAIL`, confidence 60–79%
- Any active clause with severity `Medium`, verdict `FAIL`, confidence ≥ 80%
- Any active clause with severity `Medium` or higher, stale (last code check > 14 days)

Low-severity clause FAILs are reported but do not gate.

**Output — print per-feature table:**
```
| Feature | Sec | Comp | Tasks | Scored | Decisions | Blocker | Clauses | Gate |
|---------|-----|------|-------|--------|-----------|---------|---------|------|
| <slug>  | 8   | 8.4  | Done  | Fresh  | Clean     | None    | PASS    | CLEAR |
| <slug>  | 6   | 7.1  | 2 Pnd | Stale | 1 orphan  | None    | FAIL    | HARD BLOCK |
```

After the table, print a summary:
```
HARD BLOCK: <N> features  (blocking features: <slugs>)
SOFT BLOCK: <N> features  (soft-block features: <slugs>)
CLEAR: <N> features
```

**Exit codes:**
- `0` — all features clear
- `1` — any hard block
- `2` — soft block only (no hard blocks)

**Writes nothing.**
