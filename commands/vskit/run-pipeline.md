**Task:** Run the full PRD-to-ship pipeline end to end.

**Input:** `<prd-path>` — path to the PRD markdown file.

**Chain (execute in order — halt on first non-zero exit):**
1. `/vskit:enhance prd <prd-path>` — iterate up to 5 rounds until all 11 specialists ≥ 9.
2. `/vskit:critique prd <prd-path>` — annotate PRD and update §13 Open Questions.
3. `/vskit:prd-to-features <prd-path>` — create `docs/features/<slug>/` stubs.
4. For each feature folder created in step 3 (in order):
   `/vskit:ship <slug>`

**Halt behavior:** stop at the first step that exits non-zero. Print:
```
[HALT] Pipeline failed at step N: /vskit:<command>
--- Output ---
<step output>
---
Fix the issue and re-run /vskit:run-pipeline <prd-path> to resume.
```
Exit with the failing step's exit code.

**Resumability:**
- Step 1: re-runs round-table from last recorded round if Score History rows exist; exits immediately if all scores already ≥ 9 from a prior run.
- Step 3: skips feature folders that already exist (prints `[skip]` for each).
- Step 4: each `/vskit:ship <slug>` is individually resumable (see ship.md).

**No state is reset on re-run.** The pipeline picks up from the current observable state on disk.

**Writes:** all outputs of chained commands (see enhance-prd.md, critique-prd.md, prd-to-features.md, ship.md).
