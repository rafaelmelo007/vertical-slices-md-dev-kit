**Task:** Run a round-table critique of the PRD until all 11 specialists score ≥ 9 or 5 rounds are exhausted.

**Input:** `<prd-path>` — path to the PRD markdown file (e.g., `docs/prds/draft/2026-05-17-auth.md`).

**Agents (all 11, run IN PARALLEL each round):**
product-owner, task-manager, backend-lead, frontend-lead, db-architect, testing-lead, devops-lead, security-specialist, perf-specialist, prompt-engineer, ux-specialist

**Each specialist scores 0–10 against their domain lens (portfolio-level only — see rubric below) and states the ONE thing blocking a higher score.**

| Agent | Scores PRD against |
|-------|--------------------|
| product-owner | §1 vision is one clear bet · §2 metrics testable · §3 has ≥3 verbatim signals · §13 open questions have owners |
| task-manager | §6 features sized for SPEC decomposition · no feature > ~2 weeks · §14 dependencies explicit |
| backend-lead | §6 covers backend complexity · §7 names auth + rate-limit baseline |
| frontend-lead | §7 includes UX baseline (browser support, WCAG, loading/empty/error conventions) |
| db-architect | §6 flags shared-data features · §14 names shared-schema dependencies |
| testing-lead | every §2 metric measurable · §7 NFRs testable · §3.2 pre-build assumption tests present |
| devops-lead | §10 portfolio metrics/dashboards listed · §14 dependencies versioned · env vars enumerable |
| security-specialist | §7 security baseline present (auth model, input-surface posture, rate limits) · no PII in §10 |
| perf-specialist | §7 latency/quota baseline quantified (not "fast") · §10 SLI/SLO defined at portfolio level |
| prompt-engineer | §3.1 has ≥3 verbatim signals (not paraphrases) · §13 has resolution paths |
| ux-specialist | §6 flags user-facing surfaces · §7 includes UX baseline |

**Per-round loop:**
1. All 11 agents score in parallel.
2. Append one row per agent to PRD `## Round-Table Scores` table (columns: Specialist | Score | Round | Key Concerns).
3. Append one summary row to PRD `## Score History` (columns: Date | Round | Min Score | Specialists < 9 | Notes).
4. If all scores ≥ 9 → done (exit 0).
5. If round < 5 → revise PRD per stated blockers → repeat from step 1.
6. If round 5 exhausted and any score < 9 → **FAIL LOUD**: print "Round-table failed to reach all ≥ 9 after 5 rounds. Remaining gaps: [list]" → exit non-zero. Do not silently pass.

**Score history deduplication (INV-1):** if consecutive rows have identical Min Score AND identical Specialists < 9 set, collapse: expand the most recent row's Date to range `<first>..<last>` instead of duplicating.

**Writes:** PRD `## Round-Table Scores` table (appended each round) + `## Score History` rows (appended each round).
