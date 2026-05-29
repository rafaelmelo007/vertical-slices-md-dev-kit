**Task:** Run the repo-specific test suite scoped to this feature's `Touches:` pathspec and update SCORE.md.

**Input:** `<slug>` — feature folder name under `docs/features/`.

**Step 1 — Resolve test scope:**
Read SPEC.md `Touches:` field. This is the git pathspec scoping which code this feature owns. If `Touches:` is empty, run the full test suite.

**Step 2 — Run tests:**
This command delegates to `/vskit:run-tests` for the actual shell invocation. The shell command for this repo is defined in CLAUDE.md under `Repo-Specific Overrides → /vskit:run-tests`.

If `/vskit:run-tests` is not configured in CLAUDE.md, print:
```
Configure /vskit:run-tests in CLAUDE.md → Repo-Specific Overrides before running /vskit:test.
```
Exit non-zero. Do not proceed.

**Step 3 — Report results:**
- Print full test output.
- Count: total tests, passed, failed, skipped.
- If any failures: list failing test IDs + error messages. Exit non-zero.
- If all pass: exit 0.

**Step 4 — Update SCORE.md:**
In SCORE.md `## Scores` table, update the `Test Coverage` row's `Notes` column:
```
<date>: <N passed> / <N total> tests — <N failed> failures — scope: <Touches: value or "full suite">
```

Do not change the Test Coverage score value — that is set by `/vskit:score`. This command only updates the notes.

**Writes:** SCORE.md `## Scores` Test Coverage row Notes column.
