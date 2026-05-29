**Task:** Run `/vskit:clause check` across every feature that has `clauses` in SPEC `Applies:`.

**No arguments required.**

**Steps:**
1. Scan all `docs/features/*/SPEC.md` files.
2. Collect features where `Applies:` includes `clauses` AND `docs/features/<slug>/CLAUSES.md` exists.
3. If none found, print: `No features with clauses in Applies. Nothing to check.` Exit 0.
4. For each qualifying feature, run `/vskit:clause check <slug>` (all clauses).
5. Collect per-feature exit codes.

**Do not halt on a single feature failure** — run all features, then aggregate.

**Print per-feature summary:**
```
| Feature | Clauses | PASS | FAIL | INDETERMINATE | Hard-Block |
|---------|---------|------|------|---------------|------------|
| <slug>  | 4 | 3 | 1 | 0 | YES (CLA-02 Critical FAIL 85%) |
| <slug>  | 2 | 2 | 0 | 0 | No |
```

After the table:
```
Features checked: N
Hard-block features: <slugs or "none">
Aggregated exit: <0 = all clear | non-zero = any High/Critical FAIL ≥ 80%>
```

**Exit:** non-zero if any feature has a High or Critical clause FAIL at confidence ≥ 80%. Otherwise exit 0.

**Writes:** all `CLAUSES.md` files updated (via the per-feature `/vskit:clause check` calls).
