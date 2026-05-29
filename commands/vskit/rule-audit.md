**Task:** Read-only scan of all RULES.md files. Report stale, failing, and indeterminate rules. Writes nothing.

**No arguments required.**

**Staleness threshold:** last code check date older than 14 days, OR `Last Code Check` = `pending`.

**Steps:**
1. Scan all `docs/features/*/RULES.md`.
2. For each RULES.md, parse `## Active Rules` table.
3. Classify each rule:
   - **Stale:** last code check > 14 days old or pending
   - **FAIL:** last code check verdict is `FAIL` (regardless of staleness)
   - **INDETERMINATE:** last code check verdict is `INDETERMINATE` (or confidence < 60%)
   - **PASS:** last code check verdict is `PASS` and not stale

**Sort output:** by severity (Critical → High → Medium → Low) then by staleness (most stale first).

**Print report:**
```
| Feature | ID | Rule | Severity | Status | Last Code Check | Days Stale |
|---------|----|------|----------|--------|-----------------|------------|
| <slug>  | RUL-03 | No PII in logs | Critical | STALE+FAIL | 2026-04-10 · FAIL · 88% | 49d |
| <slug>  | RUL-01 | Auth on all routes | High | STALE | 2026-05-10 · PASS · 90% | 19d |
```

After the table:
```
Stale: N rules  |  FAIL: N  |  INDETERMINATE: N  |  PASS (fresh): N
Hard-block items (High/Critical FAIL): <list or "none">
```

**Exit:** non-zero if any High or Critical rule is FAIL or stale. Otherwise exit 0.

**Writes nothing.**
