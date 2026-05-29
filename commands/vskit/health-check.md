**Task:** Hit health endpoints for the app and all service dependencies. Print a status table.

**No arguments required.**

**Step 1 — Look up shell command:**
Read this repo's `CLAUDE.md` `Repo-Specific Overrides` section for the `/vskit:health-check` entry.

If not defined, print:
```
/vskit:health-check is not configured for this repo.

Add the following to CLAUDE.md → Repo-Specific Overrides:

| /vskit:health-check | <your health check command here> |

Examples:
  curl -sf http://localhost:3000/health
  curl -sf https://api.example.com/health && curl -sf https://db.example.com/ping
```
Exit non-zero. Do not run anything.

**Step 2 — Run the configured command:**
Execute the shell command. Capture output and exit code.

**Step 3 — Print status table:**
```
| Endpoint | Status | Response time | Notes |
|----------|--------|---------------|-------|
| http://localhost:3000/health | UP | 42ms | HTTP 200 |
| http://localhost:5432 | DOWN | — | Connection refused |
```

**Step 4 — Exit behavior:**
- All endpoints healthy: exit 0.
- Any endpoint unhealthy: print `UNHEALTHY: <count> endpoint(s) down.` Exit non-zero.

**Writes nothing.**
