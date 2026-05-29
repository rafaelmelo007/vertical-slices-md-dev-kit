**Task:** Implement all Pending tasks in `docs/features/<slug>/TASKS.md` per the SPEC.

**Input:** `<slug>` — feature folder name under `docs/features/`.

**Pre-checks (hard stop if any fail — print reason and exit non-zero):**
- SCORE.md Documentation dimension ≥ 7 (feature must be in Spec Ready state).
- TASKS.md has ≥ 1 Pending task.
- DECISIONS.md has no orphan rows (every row has non-empty `Updates` OR is in `## Deferred Items`).
- If SPEC frontmatter `Prototype: required` → must be `Prototype: approved` before proceeding.
- If `dbschema` in Applies → DBSCHEMA.md has content for every table the feature touches.
- If `interface-contracts` in Applies → INTERFACE-CONTRACTS.md has content for every endpoint added/modified.
- Feature is not Deprecated.

**Implementation loop:**
For each Pending task in priority order (High → Medium → Low):
1. Update TASKS.md row Status: `Pending` → `In Progress`.
2. Implement the code changes per the task description and its Linked ACs.
3. Update TASKS.md row Status: `In Progress` → `In Review`.
4. Commit the changes. **Commit trailers are mandatory:**
   - `Closes-AC: <slug>#AC-NN` for each AC linked to this task (mandatory — fail loud if missing).
   - `Decision: <slug>#D-NN` when the task's Decision column is not `—` (mandatory when present).
5. Update TASKS.md row Status: `In Review` → `Done`.

**Commit trailer enforcement:** if a commit is made without `Closes-AC:` trailer, print:
`[INV-3 VIOLATION] Commit <sha> missing Closes-AC trailer — amend before proceeding.`
Do not proceed to the next task until the trailer is present.

**TASKS.md status is the progress record.** Re-running this command is safe: tasks already `Done` are skipped; `In Progress` tasks are resumed from the implementation step.

**Writes:** source code changes + TASKS.md status column updates + git commits with mandatory trailers.
