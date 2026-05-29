**Task:** Set up prototype serving infrastructure for this repo. Creates htpasswd file and prints the reverse-proxy nginx config block.

**No arguments required.**

**Step 1 — Prompt for inputs:**
```
App name slug (e.g., myapp): _
Basic-auth username: _
```
Validate: slug must be lowercase alphanumeric + dashes only. Username must be non-empty.

**Step 2 — Create docs/prototypes/ skeleton:**
If `docs/prototypes/` does not exist, create it.
If `docs/prototypes/index.html` does not exist, create a minimal placeholder:
```html
<!DOCTYPE html>
<html><head><title>Prototypes</title></head>
<body><p>No prototypes generated yet. Run <code>/vskit:prototype &lt;slug&gt;</code> to generate one.</p></body>
</html>
```
(Run `/vskit:gen-prototype-index` afterward to populate the real index.)

**Step 3 — Generate htpasswd:**
Prompt: `Password for <username>: _` (masked input if supported).
Generate htpasswd entry using `htpasswd -c <proxy-secrets-dir>/htpasswd/<app>-prototypes <username>`.

The `<proxy-secrets-dir>` defaults to `/etc/nginx/htpasswd` — override by setting `PROTOTYPES_HTPASSWD_DIR` in CLAUDE.md env section.

Print: `htpasswd file created at: <path>`

**Step 4 — Print nginx config block:**
```
--- Paste into your proxy config ---

location /prototypes/ {
    alias <repo-root>/docs/prototypes/;
    auth_basic "Prototypes — <app-name>";
    auth_basic_user_file <proxy-secrets-dir>/htpasswd/<app>-prototypes;
    autoindex on;
    try_files $uri $uri/ /prototypes/index.html;
}

--- After pasting, reload nginx ---
```

**Security reminder:** print: `PROTOTYPES_USER and PROTOTYPES_PASS must be stored in your secrets store — never commit them.`

**Writes:** `docs/prototypes/index.html` skeleton (if missing) + htpasswd file at `<proxy-secrets-dir>/htpasswd/<app>-prototypes`.
