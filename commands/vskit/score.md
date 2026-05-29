**Task:** Score `docs/features/<slug>` across up to 8 dimensions and update SCORE.md.

**Input:** `<slug>` — feature folder name. Optional flag: `--force` to bypass cache.

**Cache check (skip if --force):**
Run: `git diff <last_scored_sha>..HEAD -- docs/features/<slug>/ <SPEC Touches: paths>`
- If output is empty → print `[cached] last_scored_sha=<sha> diff=clean` and exit 0. Do NOT append a Score History row.
- If output is non-empty or `last_scored_sha` is missing/empty → proceed with full re-score.

**Applies-aware scoring — dimension is scored only when its prerequisite holds:**

| # | Dimension | Owner | Scored when |
|---|-----------|-------|-------------|
| 1 | Documentation | prompt-engineer | always |
| 2 | Test Coverage | testing-lead | always |
| 3 | Module Clarity | backend-lead (+ frontend-lead if `ux` in Applies or client/ files touched — record lower score) | always |
| 4 | Requirements Coverage | product-owner | always |
| 5 | Logging | devops-lead | feature has ≥1 implemented task in `server/` or `client/` |
| 6 | Error Handling | backend-lead | feature has ≥1 implemented task in `server/` or `client/` |
| 7 | Security | security-specialist | **always — no opt-out** |
| 8 | NFR Compliance | perf-specialist | SPEC.md §4 has ≥1 measurable row (non-N/A) |

Dimensions that do not apply → write `N/A — <reason>` in SCORE.md and exclude from composite denominator.

**Run all applicable scorers in parallel.** Each scorer outputs: score 0–10, key evidence (file:line citations), top improvement action.

**Score integer bands:**
- 9–10: all criteria met, zero/one minor defects
- 7–8: substantially met (gate floor for non-security dims)
- 5–6: one gate criterion not met
- 0–4: critical fail

**Ship gate floors:**
- Hard block: Security < 8, any TASKS not Done, `last_scored_sha` missing/stale, any DECISIONS orphan row, upstream blocker not Shipped, any High/Critical rule FAIL ≥ 80% confidence.
- Soft block: composite < 8.0, any non-security scored dim < 7, e2e gap, rule FAIL 60–79%.

**SCORE.md updates (write all of the following):**
1. `## Scores` table — all 8 rows (score or N/A, scorer, notes with evidence).
2. Composite — arithmetic mean of scored (non-N/A) dimensions, rounded to 1 decimal.
3. Ship gate status line.
4. `## Drift Findings` — list code:line mismatches against SPEC §3 ACs (format: `AC-NN: <file>:<line> — <description>`).
5. `## Improvement Actions` — one ACTION-NN per dimension scoring < 9 with owner.
6. `## Score History` — append one row: Date | Composite | Trigger (`manual` or `--force`) | Notes.
7. Update `last_scored_sha` to current `git rev-parse HEAD`.

**Consecutive identical rows (INV-1):** if the new Score History row has identical Composite AND Trigger as the previous row, expand the previous row's Date to `<first>..<last>` rather than appending.

**Writes:** full SCORE.md update.
