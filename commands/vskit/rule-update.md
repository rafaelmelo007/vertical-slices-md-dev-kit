**Task:** Edit a rule rule text or severity. Preserves full history — old row moves to Superseded, new row inserted.

**Input:** `<slug> <id> "<new rule>" [--severity=low|medium|high|critical]`
- `<slug>` — feature folder name under `docs/features/`
- `<id>` — existing rule ID to update (e.g., `RUL-03`)
- `"<new rule>"` — replacement rule text
- `--severity` — optional new severity; if omitted, inherit from old rule

**Steps:**

**1. Validate:**
- Feature folder and RULES.md must exist.
- `<id>` must exist in `## Active Rules` table. Fail loud if not found.
- New rule must be non-empty.

**2. Record old rule in Superseded:**
Move the old `<id>` row from `## Active Rules` to `## Removed / Superseded Rules` with:
- `Removed`: today's date
- `Reason`: `Superseded by <new-id>`
- `Final Verdict`: last verdict from `Last Code Check` column of old row
- `Supersedes`: `—`

**3. Insert new rule:**
Assign next available `RUL-NN` ID.
Append new row to `## Active Rules`:
```
| RUL-NN | <new rule> | <severity> | <today> | pending | pending | pending |
```
Add `Supersedes: <old-id>` in the new row's Notes (add a Notes column if not present, or embed in ID cell as `RUL-NN (supersedes <old-id>)`).

**4. Run check on new rule:**
Immediately run `/vskit:rule check <slug> RUL-NN` to record baseline verdict.

**Print:**
```
Updated: <old-id> → RUL-NN
Old rule: "<old rule>"
New rule: "<new rule>"
Severity: <old> → <new>
Old row moved to: ## Removed / Superseded Rules
Baseline check: <PASS|FAIL|INDETERMINATE> @ <confidence>%
```

**Writes:** `RULES.md` — old row moved to Superseded, new `RUL-NN` row inserted in Active Rules.
