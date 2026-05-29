**Task:** Recommend the single highest-priority unblocked task across all features. Read-only — writes nothing.

**Ranking criteria (apply in order — first differentiator wins):**
1. Feature lifecycle state priority: In Development > Testing > Spec Ready > Spec In Progress > Backlog. (Never recommend tasks for Deprecated features.)
2. Task Priority: High > Medium > Low.
3. Task Status: Pending > In Progress (an In Progress task is already owned — prefer if no Pending of equal rank).
4. Feature composite score: lower score = more urgent improvement.
5. Alphabetical feature slug as tiebreaker.

**Blocked tasks (skip these):**
- Tasks whose feature has `Blocked-by:` slugs that are not yet Shipped.
- Tasks owned by an agent whose pre-conditions are not met (e.g., `db-architect` tasks when DBSCHEMA.md is empty).

**Output:** one paragraph naming the recommendation:
```
Recommended next task: [Feature: <slug>] [T-NN] <description>
Owner: <agent>
Priority: <High|Medium|Low>
Rationale: <one or two sentences explaining why this task ranks highest — feature state, score gap, blocking status, unblocked vs. alternatives>
```

If no unblocked tasks exist across any feature, print:
```
No unblocked tasks found. All features are either Shipped, Deprecated, or blocked by upstream dependencies.
```

**Writes nothing.**
