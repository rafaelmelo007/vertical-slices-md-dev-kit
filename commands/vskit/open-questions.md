**Task:** Aggregate all unresolved `§9 Open Questions` from all feature SPECs and print a sorted report. Read-only — writes nothing.

**Steps:**
1. Read every `docs/features/*/SPEC.md`.
2. Parse each file's `## §9 Open Questions` table.
3. Collect rows where `Status` is not `Resolved` (case-insensitive).
4. Sort: by feature slug alphabetically, then by Owner slug alphabetically within each feature.

**Output format:**
```
| Feature | # | Question | Owner | Status | Resolution |
|---------|---|----------|-------|--------|------------|
| <slug>  | 1 | ... | backend-lead | Open | |
| <slug>  | 3 | ... | product-owner | Deferred | Revisit at multi-tenant epic |
```

After the table, print:
```
Total unresolved: N questions across M features
Features with open questions: <slug>, <slug>, ...
```

If no unresolved questions exist, print:
```
All Open Questions are resolved across all features.
```

**Writes nothing.**
