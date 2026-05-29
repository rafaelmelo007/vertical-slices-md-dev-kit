**Task:** Run the ship gate then execute the repo-specific deploy command.

**No arguments required.**

**Step 1 — Run `/vskit:check deploy`:**
- Exit code 1 (hard block): refuse deployment. Print:
  ```
  [DEPLOY REFUSED] Hard blocks present. Fix before deploying:
  <list of blocking features + blocking reasons>
  ```
  Exit non-zero. Do not proceed.
- Exit code 2 (soft block only): prompt:
  ```
  <N> features below ship gate. Soft-block features: <slugs>
  Failing dimensions: <list>
  Deploy anyway? [y/N]
  ```
  - On `N` or no input: exit non-zero without deploying.
  - On `y`: append a waiver row to each soft-block feature's `SCORE.md` `## Score History` (columns: Date | Composite | Trigger=`waiver` | Notes=`failing dims: <list>, deployer: <user>, reason: <prompt response>`). Then continue to step 2.
- Exit code 0: proceed directly to step 2.

**Step 2 — Execute deploy:**
The shell command for this repo is defined in CLAUDE.md `Repo-Specific Overrides → /vskit:deploy`. If not defined, print:
```
Configure /vskit:deploy in CLAUDE.md → Repo-Specific Overrides before running /vskit:deploy.
```
Exit non-zero.

Run the deploy command. Stream output. On failure, exit with the deploy command's exit code.

**After successful deploy:** print:
```
[DEPLOYED] <date> — <N> features shipped.
```

**Writes:** waiver rows in SCORE.md Score History (if soft-block accepted) + deploy execution side effects.
