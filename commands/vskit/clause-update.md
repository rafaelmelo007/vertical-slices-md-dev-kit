**Task:** Edit a clause rule text or severity. Preserves full history — old row moves to Superseded, new row inserted.

**Input:** `<slug> <id> "<new rule>" [--severity=low|medium|high|critical]`
- `<slug>` — feature folder name under `docs/features/`
- `<id>` — existing clause ID to update (e.g., `CLA-03`)
- `"<new rule>"` — replacement rule text
- `--severity` — optional new severity; if omitted, inherit from old clause

**Steps:**

**1. Validate:**
- Feature folder and CLAUSES.md must exist.
- `<id>` must exist in `## Active Clauses` table. Fail loud if not found.
- New rule must be non-empty.

**2. Record old clause in Superseded:**
Move the old `<id>` row from `## Active Clauses` to `## Removed / Superseded Clauses` with:
- `Removed`: today's date
- `Reason`: `Superseded by <new-id>`
- `Final Verdict`: last verdict from `Last Code Check` column of old row
- `Supersedes`: `—`

**3. Insert new clause:**
Assign next available `CLA-NN` ID.
Append new row to `## Active Clauses`:
```
| CLA-NN | <new rule> | <severity> | <today> | pending | pending | pending |
```
Add `Supersedes: <old-id>` in the new row's Notes (add a Notes column if not present, or embed in ID cell as `CLA-NN (supersedes <old-id>)`).

**4. Run check on new clause:**
Immediately run `/vskit:clause check <slug> CLA-NN` to record baseline verdict.

**Print:**
```
Updated: <old-id> → CLA-NN
Old rule: "<old rule>"
New rule: "<new rule>"
Severity: <old> → <new>
Old row moved to: ## Removed / Superseded Clauses
Baseline check: <PASS|FAIL|INDETERMINATE> @ <confidence>%
```

**Writes:** `CLAUSES.md` — old row moved to Superseded, new `CLA-NN` row inserted in Active Clauses.
