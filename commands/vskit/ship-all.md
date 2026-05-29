**Task:** Run `/vskit:ship <slug>` for every feature currently in `Spec Ready` or `Testing` lifecycle state.

**Lifecycle state computation (do not read a declared field — compute from observable signals):**

| State | Condition |
|-------|-----------|
| Spec Ready | Documentation score ≥ 7 AND no unresolved Open Questions AND (TASKS.md zero rows OR all rows Pending) |
| Testing | All TASKS rows Done AND (ship gate not passed OR no deploy row in SCORE.md Score History) |

**Steps:**
1. Read all `docs/features/*/SPEC.md` and `SCORE.md` files.
2. Compute lifecycle state for each feature.
3. Collect features in `Spec Ready` or `Testing` state.
4. If none found, print: `No features in Spec Ready or Testing state. Nothing to ship.` Exit 0.
5. Print the list of features to be shipped.
6. For each feature (in order — alphabetical by slug):
   - Run `/vskit:ship <slug>`
   - On failure: halt immediately, print failing feature + output, exit non-zero.
   - On success: continue to next feature.

**Halt behavior:** stop on the first feature failure. Do not skip and continue — partial fleet deploys hide failures (INV-3).

**Summary table (print after all succeed or on halt):**
```
| Feature | State | Outcome |
|---------|-------|---------|
| <slug>  | Spec Ready | Shipped |
| <slug>  | Testing | FAILED — <step> |
```

**Writes:** all outputs of each `/vskit:ship <slug>` call.
