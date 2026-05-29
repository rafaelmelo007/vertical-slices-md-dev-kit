**Task:** Run the full test suite (unit + integration + e2e) and update SCORE.md for touched features.

**No arguments required.**

**Step 1 — Look up shell command:**
Read this repo's `CLAUDE.md` `Repo-Specific Overrides` section for the `/vskit:run-tests` entry.

If not defined, print:
```
/vskit:run-tests is not configured for this repo.

Add the following to CLAUDE.md → Repo-Specific Overrides:

| /vskit:run-tests | <your test command here> |

Examples:
  cd server && npm test && cd ../client && npm test
  dotnet test
  pytest
```
Exit non-zero. Do not run anything.

**Step 2 — Run the configured command:**
Execute the shell command. Stream output.

**Step 3 — Report results:**
- Print: total tests, passed, failed, skipped.
- On failure: list failing test names/IDs. Exit non-zero.
- On success: exit 0.

**Step 4 — Update SCORE.md for touched features:**
Determine which `docs/features/*/` folders had code changes since their `last_scored_sha`. For each such feature, update SCORE.md `## Scores` Test Coverage row Notes:
```
<date>: full suite — <N passed> / <N total> — <N failed> failures
```

**Writes:** SCORE.md Test Coverage Notes for features with code changes since last score.
