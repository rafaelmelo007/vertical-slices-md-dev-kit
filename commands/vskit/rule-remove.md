**Task:** Remove an active rule. Requires confirmation. Silent deletion is forbidden (INV-3).

**Input:** `<slug> <id>`
- `<slug>` — feature folder name under `docs/features/`
- `<id>` — rule ID to remove (e.g., `RUL-02`)

**Steps:**

**1. Validate:**
- Feature folder and RULES.md must exist.
- `<id>` must exist in `## Active Rules` table. Fail loud if not found.

**2. Prompt for confirmation:**
Print the rule details then prompt:
```
Rule to remove:
  ID: <id>
  Rule: "<rule>"
  Severity: <severity>
  Last verdict: <last code check verdict @ confidence%>

Provide reason for removal (required): _
Confirm removal? [y/N]: _
```
- If reason is empty: refuse. Print: `Reason is required. Silent deletion is forbidden (INV-3).`
- If `N` or no input: print `Removal cancelled.` Exit 0.

**3. Move to Superseded:**
Append the rule row to `## Removed / Superseded Rules` with:
- `Removed`: today's date
- `Reason`: the entered reason
- `Final Verdict`: last verdict from `Last Code Check` column (or `never checked` if pending)
- `Supersedes`: `—`

Remove the row from `## Active Rules`.

**Print:**
```
Removed: <id> — "<rule>"
Moved to: ## Removed / Superseded Rules
Reason recorded: "<reason>"
Final verdict: <verdict>
```

**Writes:** `RULES.md` — old row moved from Active to Removed/Superseded with reason and final verdict.
