**Task:** Orchestrate the full feature pipeline for `<slug>` from spec critique to deploy.

**Input:** `<slug>` — feature folder name under `docs/features/`.

**Chain (execute in order — halt on first non-zero exit):**
1. `/vskit:critique spec <slug>`
2. `/vskit:spec-to-tasks <slug>`
3. `/vskit:implement <slug>`
4. `/vskit:test <slug>`
5. `/vskit:score <slug>`
6. `/vskit:prototype <slug>` — **only if `prototype` in SPEC `Applies:`**
7. `/vskit:check deploy`
8. `/vskit:deploy`

**Halt behavior:** if any step exits non-zero, stop immediately. Print:
```
[HALT] Step N failed: /vskit:<command> <slug>
--- Output ---
<step output>
---
Re-run /vskit:ship <slug> to resume from current state.
```
Exit with the failing step's exit code.

**Resumability:** each step's completion is observable on disk (TASKS.md statuses, SCORE.md `last_scored_sha`, DECISIONS.md rows). Re-running after a halt safely skips already-complete steps:
- Steps 1–2: skipped if TASKS.md already has populated rows and DECISIONS.md has no orphan rows.
- Step 3: skipped if all TASKS rows are `Done`.
- Step 5: skipped if `git diff <last_scored_sha>..HEAD -- docs/features/<slug>/` is empty (cache hit).
- Step 6: skipped if `Prototype: generated` or `prototype` not in Applies.
- Step 7–8: always re-evaluated.

State already on disk is preserved across runs — no data loss on halt.

**Writes:** all outputs of the chained commands (see each individual command file).
