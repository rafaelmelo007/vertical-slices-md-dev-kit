**Task:** Read all `docs/features/*/TASKS.md` and print an aggregated task list. Read-only — writes nothing.

**Optional filter arguments (combinable):**
- `--status=<pending|in-progress|done>` — filter by Status column value (case-insensitive)
- `--owner=<agent-slug>` — filter by Owner column (e.g., `backend-lead`, `testing-lead`)
- `--priority=<high|medium|low>` — filter by Priority column (case-insensitive)

**Valid agent slugs:** product-owner, task-manager, backend-lead, frontend-lead, db-architect, testing-lead, devops-lead, security-specialist, perf-specialist, prompt-engineer, ux-specialist

**Steps:**
1. Read every `docs/features/*/TASKS.md`.
2. Collect all task rows (skip header rows and features with no tasks).
3. Apply any filters. If filters yield no results, print: `No tasks match the given filters.`
4. Sort: by Priority (High first) then by Feature slug alphabetically.

**Output format:**
```
| Feature | ID | Description | Owner | Priority | Status | Linked ACs | Decision |
|---------|----|-------------|-------|----------|--------|------------|----------|
| <slug>  | T-01 | ... | backend-lead | High | Pending | AC-01 | — |
```

After the table, print:
```
Total: N tasks  (Pending: N | In Progress: N | In Review: N | Done: N)
Filters applied: <list or "none">
```

**Writes nothing.**
