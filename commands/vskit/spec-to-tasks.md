**Task:** Break `docs/features/<slug>/SPEC.md` §3 Acceptance Criteria into `TASKS.md` implementation rows.

**Input:** `<slug>` — feature folder name under `docs/features/`.

**Pre-checks (fail loud if any fail):**
- SPEC.md §3 contains at least one AC.
- DECISIONS.md has no orphan rows (every row has non-empty `Updates` OR is in `## Deferred Items`).
- Feature is not Deprecated (SPEC frontmatter contains no `Deprecated:` line).

**Task creation rules:**
- Every task must link to ≥ 1 AC. A task with no AC origin is forbidden (INV-4 — enforceability).
- One AC may generate multiple tasks if implementation work is separable.
- All ACs must be covered — verify no AC is left with zero tasks.
- Assign `Owner` from the agent roster based on the work type:
  - server-side code → `backend-lead`
  - client-side code → `frontend-lead`
  - schema/migrations → `db-architect`
  - test files → `testing-lead`
  - docker/CI/deploy → `devops-lead`
  - prototype/UX → `ux-specialist`
- Assign `Priority`: map from the AC's implied risk/blocking nature (High = blocking or security-related, Medium = functional, Low = polish/non-blocking).
- `Decision` column: if a task exists because of a DECISIONS.md row, put the `D-NN` slug; else `—`.

**TASKS.md columns:** ID (T-NN, sequential) | Description | Owner | Priority | Status (always `Pending`) | Linked ACs | Decision

**Output format:**
```
| T-01 | <description> | backend-lead | High | Pending | AC-01, AC-03 | — |
```

**After writing:** print a coverage summary:
```
Tasks created: N
ACs covered: AC-01, AC-02, ... (M of M total ACs)
ACs with no task: none  [or list any gaps — fail loud if gaps exist]
```

**Writes:** `TASKS.md` — populated rows replacing headers-only stub.
