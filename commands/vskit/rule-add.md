**Task:** Add a new invariant rule to `docs/features/<slug>/RULES.md`.

**Input:** `<slug> "<rule>" [--severity=low|medium|high|critical]`
- `<slug>` — feature folder name under `docs/features/`
- `"<rule>"` — one declarative sentence stating the invariant (e.g., "New users must accept terms before any data write")
- `--severity` — default: `Medium`

**Steps:**

**1. Validate inputs:**
- Feature folder `docs/features/<slug>/` must exist. Fail loud if not.
- Rule must be a complete sentence (non-empty string). Fail if empty.
- Severity must be one of: `Low`, `Medium`, `High`, `Critical` (case-insensitive). Fail if invalid.

**2. Ensure RULES.md exists:**
If `docs/features/<slug>/RULES.md` does not exist, create it with headers:
```markdown
# Rules — <Feature Name>
**Feature:** <slug>

## Active Rules

| ID | Rule | Severity | Added | Last Spec Check | Last Code Check | Top 5 Enforcement Files |
|----|------|----------|-------|-----------------|-----------------|------------------------|

## Removed / Superseded Rules

| ID | Rule | Severity | Added | Removed | Reason | Final Verdict | Supersedes |
|----|------|----------|-------|---------|--------|---------------|------------|
```

**3. Ensure `rules` in SPEC Applies:**
Read SPEC.md `Applies:` field. If `rules` is not listed, add it.

**4. Assign next RUL-NN ID:**
Read existing active rules to find the highest N. New ID = next N.

**5. Append new row to `## Active Rules` table:**
```
| RUL-NN | <rule> | <Severity> | <YYYY-MM-DD> | pending | pending | pending |
```

**6. Run baseline check:**
Immediately run `/vskit:rule check <slug> RUL-NN` to record an initial verdict before exiting.

**Print after completion:**
```
Added: RUL-NN — "<rule>" [<Severity>]
RULES.md: docs/features/<slug>/RULES.md
Applies: updated to include rules
Baseline check: <PASS|FAIL|INDETERMINATE> @ <confidence>%
```

**Writes:** `RULES.md` new row + SPEC.md `Applies:` field update (if needed).
