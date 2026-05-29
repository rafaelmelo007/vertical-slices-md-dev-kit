**Task:** Add a new invariant clause to `docs/features/<slug>/CLAUSES.md`.

**Input:** `<slug> "<rule>" [--severity=low|medium|high|critical]`
- `<slug>` — feature folder name under `docs/features/`
- `"<rule>"` — one declarative sentence stating the invariant (e.g., "New users must accept terms before any data write")
- `--severity` — default: `Medium`

**Steps:**

**1. Validate inputs:**
- Feature folder `docs/features/<slug>/` must exist. Fail loud if not.
- Rule must be a complete sentence (non-empty string). Fail if empty.
- Severity must be one of: `Low`, `Medium`, `High`, `Critical` (case-insensitive). Fail if invalid.

**2. Ensure CLAUSES.md exists:**
If `docs/features/<slug>/CLAUSES.md` does not exist, create it with headers:
```markdown
# Clauses — <Feature Name>
**Feature:** <slug>

## Active Clauses

| ID | Rule | Severity | Added | Last Spec Check | Last Code Check | Top 5 Enforcement Files |
|----|------|----------|-------|-----------------|-----------------|------------------------|

## Removed / Superseded Clauses

| ID | Rule | Severity | Added | Removed | Reason | Final Verdict | Supersedes |
|----|------|----------|-------|---------|--------|---------------|------------|
```

**3. Ensure `clauses` in SPEC Applies:**
Read SPEC.md `Applies:` field. If `clauses` is not listed, add it.

**4. Assign next CLA-NN ID:**
Read existing active clauses to find the highest N. New ID = next N.

**5. Append new row to `## Active Clauses` table:**
```
| CLA-NN | <rule> | <Severity> | <YYYY-MM-DD> | pending | pending | pending |
```

**6. Run baseline check:**
Immediately run `/vskit:clause check <slug> CLA-NN` to record an initial verdict before exiting.

**Print after completion:**
```
Added: CLA-NN — "<rule>" [<Severity>]
CLAUSES.md: docs/features/<slug>/CLAUSES.md
Applies: updated to include clauses
Baseline check: <PASS|FAIL|INDETERMINATE> @ <confidence>%
```

**Writes:** `CLAUSES.md` new row + SPEC.md `Applies:` field update (if needed).
