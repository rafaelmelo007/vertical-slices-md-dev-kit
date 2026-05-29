**Task:** Run `/vskit:rule check` across every feature that has `rules` in SPEC `Applies:`.

**No arguments required.**

**Steps:**
1. Scan all `docs/features/*/SPEC.md` files.
2. Collect features where `Applies:` includes `rules` AND `docs/features/<slug>/RULES.md` exists.
3. If none found, print: `No features with rules in Applies. Nothing to check.` Exit 0.
4. For each qualifying feature, run `/vskit:rule check <slug>` (all rules).
5. Collect per-feature exit codes.

**Do not halt on a single feature failure** — run all features, then aggregate.

**Print per-feature summary:**
```
| Feature | Rules | PASS | FAIL | INDETERMINATE | Hard-Block |
|---------|---------|------|------|---------------|------------|
| <slug>  | 4 | 3 | 1 | 0 | YES (RUL-02 Critical FAIL 85%) |
| <slug>  | 2 | 2 | 0 | 0 | No |
```

After the table:
```
Features checked: N
Hard-block features: <slugs or "none">
Aggregated exit: <0 = all clear | non-zero = any High/Critical FAIL ≥ 80%>
```

**Exit:** non-zero if any feature has a High or Critical rule FAIL at confidence ≥ 80%. Otherwise exit 0.

**Writes:** all `RULES.md` files updated (via the per-feature `/vskit:rule check` calls).
