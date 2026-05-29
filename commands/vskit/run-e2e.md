**Task:** Run end-to-end tests only and save screenshots on failure.

**No arguments required.**

**Step 1 — Look up shell command:**
Read this repo's `CLAUDE.md` `Repo-Specific Overrides` section for the `/vskit:run-e2e` entry.

If not defined, print:
```
/vskit:run-e2e is not configured for this repo.

Add the following to CLAUDE.md → Repo-Specific Overrides:

| /vskit:run-e2e | <your e2e command here> |

Examples:
  BASE_URL=http://localhost:3000 npx playwright test
  npx cypress run
  dotnet test --filter "Category=E2E"
```
Exit non-zero. Do not run anything.

**Step 2 — Run the configured command:**
Execute the shell command. Stream output.

**Step 3 — On failure — save screenshots:**
If the test run exits non-zero:
- Collect any screenshots produced by the test framework.
- Copy them to `docs/testing/e2e-<YYYY-MM-DD>/`.
- Print: `Screenshots saved: docs/testing/e2e-<date>/`
- List failing test names.
- Exit non-zero.

**Step 4 — On success:**
Print: `All E2E tests passed.`
Exit 0.

**Writes:** `docs/testing/e2e-<date>/` screenshots on failure only.
