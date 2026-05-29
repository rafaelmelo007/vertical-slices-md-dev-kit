**Task:** Compute and display lifecycle state, composite score, ship-gate status, and top blocker for every feature. Read-only — writes nothing.

**Lifecycle state computation (evaluated top-to-bottom; first match wins):**

| Priority | State | Condition |
|---------|-------|-----------|
| 0 | Deprecated | SPEC.md frontmatter contains `Deprecated: <date> — <reason>` |
| 1 | Backlog | feature folder exists; SPEC.md missing or has no §3 ACs |
| 2 | Spec In Progress | SPEC.md has §3 ACs AND (Documentation score < 7 OR §9 has unresolved Open Questions) |
| 3 | Spec Ready | Documentation ≥ 7 AND no unresolved Open Questions AND (TASKS.md zero rows OR all rows Pending) |
| 4 | Shipped | All TASKS Done AND ship gate passed AND ≥1 deploy row in SCORE.md Score History |
| 5 | Testing | All TASKS Done AND (ship gate not passed OR no deploy row) |
| 6 | In Development | TASKS.md has ≥1 In Progress or In Review row, OR mix of Pending and Done |

**Top blocker:** the most critical unmet ship-gate requirement (hard block > soft block > none).

**Print table:**
```
| Feature | State | Composite | Gate | Top Blocker |
|---------|-------|-----------|------|-------------|
| <slug>  | In Development | 7.2 | SOFT | Composite < 8.0 |
| <slug>  | Spec Ready | 0.0 | HARD | Never scored |
| <slug>  | Shipped | 8.9 | CLEAR | — |
```

After the table, print summary counts:
```
Backlog: N  |  Spec In Progress: N  |  Spec Ready: N  |  In Development: N  |  Testing: N  |  Shipped: N  |  Deprecated: N
```

**Writes nothing.**
