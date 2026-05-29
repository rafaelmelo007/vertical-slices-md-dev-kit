**Task:** Print all active clauses for a feature. Read-only — writes nothing.

**Input:** `<slug> [--status=pass|fail|stale|indeterminate]`
- `<slug>` — feature folder name under `docs/features/`
- `--status` — optional filter; `stale` = last code check older than 14 days

**Steps:**
1. Read `docs/features/<slug>/CLAUSES.md`. If not found, print: `No CLAUSES.md for <slug>.` Exit 0.
2. Parse `## Active Clauses` table.
3. Compute staleness: a clause is stale if its `Last Code Check` date is > 14 days ago, or if `Last Code Check` is `pending`.
4. Apply `--status` filter if provided.
5. Sort by severity (Critical → High → Medium → Low) then by ID.

**Output format:**
```
| ID | Rule | Severity | Last Spec Check | Last Code Check | Stale? |
|----|------|----------|-----------------|-----------------|--------|
| CLA-01 | New users must accept terms... | High | 2026-05-20 · PASS · 87% | 2026-05-20 · PASS · 82% | No |
| CLA-02 | No PII in logs | Critical | 2026-05-01 · PASS · 91% | 2026-04-30 · PASS · 89% | YES (29d ago) |
```

After the table:
```
Active clauses: N  |  PASS: N  |  FAIL: N  |  INDETERMINATE: N  |  Stale: N
Filter applied: <status value or "none">
```

If no clauses match the filter, print: `No clauses match --status=<value>.`

**Writes nothing.**
