**Task:** Run `/vskit:score <slug>` for every feature folder in `docs/features/`. Honor per-feature cache.

**No arguments required.** Optional: `--force` to bypass cache on all features.

**Steps:**
1. List all `docs/features/*/` directories.
2. For each slug, run `/vskit:score <slug>` (with `--force` if flag passed).
3. Collect result: `[cached]` or updated composite score.
4. Do not halt on a single feature failure — continue all features and report all failures at the end.

**Print summary table after all features are processed:**
```
| Feature | Result | Composite | Gate |
|---------|--------|-----------|------|
| <slug>  | scored | 8.2 | CLEAR |
| <slug>  | cached | 7.4 | SOFT |
| <slug>  | FAILED | — | — |
```

After the table:
```
Scored: N features  |  Cached: N  |  Failed: N
```

If any features failed, exit non-zero. Otherwise exit 0.

**Writes:** all SCORE.md files where cache is missed. Cached features are not written.
