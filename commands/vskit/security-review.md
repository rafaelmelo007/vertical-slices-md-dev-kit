**Task:** security-specialist audits the full codebase for security vulnerabilities. Creates incident files for findings.

**Owner:** security-specialist

**Audit checklist:**

| Category | What to check |
|----------|--------------|
| Authentication | Every route/endpoint that should be protected has auth middleware; no protected routes accessible without valid credentials |
| Input validation | All user-controlled inputs validated/sanitized before use in DB queries, shell commands, file paths, or template rendering |
| Secrets in code | No API keys, passwords, tokens, or private keys hardcoded in source files or committed config files |
| SQL injection | All DB queries use parameterized statements or ORM abstractions; no string interpolation into queries |
| XSS | All user-supplied content HTML-escaped before rendering; CSP headers present on HTML responses |
| CORS | CORS policy is explicit and restrictive; no wildcard origin on authenticated endpoints |
| Rate limiting | Rate limiting present on auth endpoints, public APIs, and resource-expensive operations |
| Dependency provenance | Dependencies pinned to specific versions; no known high/critical CVEs in `npm audit` / `pip-audit` / equivalent |
| PII in logs | No personal data (email, name, phone, IP, session tokens) written to log output |
| File path traversal | No user-controlled path segments reach file system operations without normalization and boundary checks |

**For each finding:**
1. Assign severity: Critical | High | Medium | Low
2. Note: file path + line number, attack vector, evidence snippet (no secrets — mask values)
3. Create `docs/incidents/INC-NNN.md` (next available number). Use the INC-TEMPLATE.md in `docs/process/`.

**Output — print summary table:**
```
| Severity | Category | File | Line | Summary |
|----------|----------|------|------|---------|
| High | SQL injection | server/db.js | 42 | Raw query with user input |
```

After the table:
```
Findings: Critical: N | High: N | Medium: N | Low: N
Incidents created: docs/incidents/INC-NNN.md, ...
```

If no findings: print `No security findings.` Exit 0.
If findings: exit non-zero.

**Writes:** `docs/incidents/INC-NNN.md` for each finding.
