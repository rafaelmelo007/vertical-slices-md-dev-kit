# vertical-slices-md-dev-kit

**AI framework to build solid software apps — PRDs, per-feature markdown specs (vertical slices), contract clauses, and ship gates.**

Adopt it in under an hour and your AI-generated code starts shipping behind quality gates that `git` + `make` + `pytest` don't enforce on their own. The methodology itself is documented in [`vertical-slices-ai-framework.md`](./vertical-slices-ai-framework.md) (v2.0) — the normative spec. This bundle wraps that spec with templates, reference scripts, and a worked example so a stranger can adopt it without reading 1027 lines first.

> **Bundle version:** 2.0 · **License:** MIT · **Status:** Active
>
> **v2.0 changes:** All commands renamed to verb-first form and prefixed `vskit:` to avoid skill collisions. Twelve commands renamed, three deleted. See [`CHANGELOG.md`](./CHANGELOG.md) for the full old→new migration table.
>
> **v1.8 highlight (still active):** Clauses — invariant rules graded by AI with confidence + reasoning, per feature. See [§4.7 in the spec](./vertical-slices-ai-framework.md#47-clauses--invariant-rules-with-confidence-graded-checks) or the demo at [`example/features/demo-counter/CLAUSES.md`](./example/features/demo-counter/CLAUSES.md).

---

## Getting started

### Install — 60-second adoption preview

```bash
# 1. Vendor the kit into your repo (pick one)
git submodule add https://github.com/rafaelmelo007/vertical-slices-md-dev-kit.git docs/bundle
# OR a shallow copy:
git clone --depth 1 https://github.com/rafaelmelo007/vertical-slices-md-dev-kit.git /tmp/vskit \
  && cp -r /tmp/vskit/. docs/bundle/

# 2. Install the Stop hook
mkdir -p .claude
cat docs/bundle/settings.json.snippet >> .claude/settings.json   # merge by hand if file exists

# 3. Make the hook script executable + point at it
chmod +x docs/bundle/scripts/worklog-stop-hook.sh

# 4. Bootstrap the doc tree
mkdir -p docs/{prds,features,worklog,incidents,process,technical}

# 5. Copy one template and start your first feature
cp docs/bundle/templates/SPEC.md docs/features/my-first-feature/SPEC.md

# 6. Edit your CLAUDE.md to point at the framework
cat docs/bundle/templates/CLAUDE.md-snippet.md   # paste into CLAUDE.md
```

Full walkthrough → [`ADOPTION.md`](./ADOPTION.md)

### Commands — what they do and what they write

> Full simulated end-to-end run → [`WALKTHROUGH.md`](./WALKTHROUGH.md) covers every command in the order a real adoption flows. The snippets below are excerpts; WALKTHROUGH has the complete context.

Every command is target-aware and writes specific artifacts. Spec versus invocation matters: `/vskit:critique spec <slug>` operates on one feature; `/vskit:project-status` reads everything and writes nothing. Commands fall into eight groups.

#### 1. Setup (one-shot per repo)

##### `/vskit:init-framework`

Scaffolds the doc tree, installs the Stop hook, writes the CLAUDE.md commands stub, optionally installs a pre-push hook.

```
$ /vskit:init-framework
[init-framework] scaffolding vertical-slices-md-dev-kit v2.0 in /home/dev/clickcount
[init-framework] creating doc tree...
  ✓ docs/PRD.md (stub)
  ✓ docs/{prds,features,worklog,prototypes,incidents,process,technical}/
[init-framework] installing Stop hook → .claude/settings.json
Install pre-push hook that runs /vskit:audit-traceability and /vskit:check deploy? [Y/n] y
Done. Next step: write your first PRD draft at docs/prds/draft/<date>-<slug>.md
```

**Writes:** full `docs/` tree, `CLAUDE.md`, `.claude/settings.json`, `.claude/scripts/worklog-stop-hook.sh`, `.git/hooks/pre-push`, worklog row.

#### 2. PRD phase (per product, once until promoted)

##### `/vskit:review prd <prd-path>`

Round-table: 11 specialists score the PRD 0–10 in parallel. Iterates until all ≥ 9.

```
$ /vskit:review prd docs/prds/draft/2026-05-23-clickcount.md
[review] Round 1 — launching 11 specialists in parallel
  product-owner       → 7  ("§3 customer evidence has 2 verbatim signals, needs ≥3")
  task-manager        → 9
  backend-lead        → 8  ("§7 missing rate-limit baseline")
  testing-lead        → 6  ("§2 metric 'fast' not measurable")
  ...
Round 1: min 6 (testing-lead). Revise and re-run.

[review] Round 2 — all scores ≥ 9 ✓
PRD ready to promote.
```

**Writes:** PRD `## Round-Table Scores` rows + `## Score History` row per round.

##### `/vskit:critique prd <prd-path>`

Specialists interrogate the promoted PRD for weak evidence and vague metrics. Adds inline `> Q:` questions.

```
$ /vskit:critique prd docs/prds/2026-05-23-clickcount.md
[critique] interrogating PRD as prompt-engineer
  Q1: §1 says "fast and reliable" — what's fast? what's reliable?
  Q2: §6 F-03 description is "tracking endpoint" — measured how?
  Q3: §13 row "should we cache?" has no owner.
3 inline questions added.
```

**Writes:** Inline `> Q:` annotations + `## §13 Open Questions` rows in the PRD.

##### `/vskit:prd-to-features <prd-path>`

Extracts §6 feature list and scaffolds `docs/features/<slug>/` for each.

```
$ /vskit:prd-to-features docs/prds/2026-05-23-clickcount.md
[prd-to-features] F-01: ingest         → docs/features/ingest/
[prd-to-features] F-02: query          → docs/features/query/
[prd-to-features] F-03: demo-counter   → docs/features/demo-counter/
3 feature folders created. Next: /vskit:critique spec <slug> for each.
```

**Writes:** `docs/features/<slug>/{SPEC,TASKS,SCORE,DECISIONS}.md` stubs per feature.

#### 3. Per-feature spec → implementation

##### `/vskit:critique spec <slug>`

Specialists interrogate the SPEC for weak ACs, missing NFRs, edge cases. **For every decision raised, appends a DECISIONS row AND propagates the change to the canonical file in the same run** (propagation contract).

```
$ /vskit:critique spec demo-counter
[critique] reading docs/features/demo-counter/SPEC.md
[critique] Applies: [] — interrogating to set it
  → SPEC frontmatter updated: Applies: [dbschema, interface-contracts]
  → DBSCHEMA.md created; INTERFACE-CONTRACTS.md created

[critique] launching specialists
  security-specialist: "Rate-limit storage — in-memory or Redis?"
    → D-01: in-memory token bucket, per-instance
    Updates: SPEC §3 AC-04, §4 Quota row, §10 note 1 ✓
  security-specialist: "Max campaign-name length?"
    → D-02: 64 chars after Unicode NFC
    Updates: SPEC §3 AC-03, §9 Q-02; INTERFACE-CONTRACTS POST /click body ✓
  ...

5 decisions logged. 3 deferred items recorded (DEF-01..DEF-03).
[critique] propagation contract checked — ✓ no orphan rows
Documentation score now: 9. Spec ready for /vskit:spec-to-tasks.
```

**Writes:** Updates to `SPEC.md` (§3, §4, §9), `DBSCHEMA.md`, `INTERFACE-CONTRACTS.md`; appends `D-NN` and `DEF-NN` rows to `DECISIONS.md`.

##### `/vskit:spec-to-tasks feature <slug>`

Breaks SPEC §3 ACs into TASKS.md rows. Tasks driven by a /critique decision get the `Decision: D-NN` column populated.

```
$ /vskit:spec-to-tasks feature demo-counter
[spec-to-tasks] reading SPEC.md §3 (8 ACs) + DECISIONS.md (5 decisions)

  T-01  Add `clicks` table + index migration M-01   db-architect  High  AC-01,05,08  —
  T-02  Implement POST /click handler               backend-lead  High  AC-01,02     —
  T-04  Campaign-length cap 64 chars + NFC           backend-lead  Med   AC-03        D-02
  T-05  Per-IP rate limiter                         backend-lead  High  AC-04        D-01
  T-06  Structured logging; scrub IPs               devops-lead   Med   AC-07        D-03
  ...

10 tasks created. 4 tagged with Decision source.
Feature now in lifecycle state: Spec Ready.
```

**Writes:** Rows appended to `TASKS.md`.

##### `/vskit:implement feature <slug>`

Implements all Pending tasks. **Commits carry `Closes-AC: <slug>#AC-NN` and (when applicable) `Decision: <slug>#D-NN` trailers.**

```
$ /vskit:implement feature demo-counter
[implement] checking implementation gate (§10.2)... ✓
[implement] dispatching tasks to owners

  T-02 → backend-lead ... writing server/click/handler.rs
         committing: "feat(click): POST handler with validation"
         trailer: Closes-AC: demo-counter#AC-01 demo-counter#AC-02
         ✓ T-02 → Done

  T-05 → backend-lead ... committing: "feat(click): per-IP rate limit 60/min"
         trailer: Closes-AC: demo-counter#AC-04  Decision: demo-counter#D-01
         ✓ T-05 → Done

  T-06 → devops-lead ... structured logs (in progress)
         ⚠ T-06 → In Progress (AC-07 not yet satisfied)

5 tasks Done · 2 In Progress · 1 In Review · 2 Pending
feature state now: In Development
```

**Writes:** Source files (varies by feature); TASKS.md row statuses; git commits with trailers.

##### `/vskit:test feature <slug>`

Runs tests scoped to the feature's `Touches:` pathspec. Reports pass/fail and any contract violations.

```
$ /vskit:test feature demo-counter
[test] running tests scoped to Touches: [server/click/**]
  TC-01 unit validation       . . . PASS (12 assertions)
  TC-02 unit rate-limit math  . . . PASS (8 assertions)
  TC-04 concurrency           . . . FAIL (T-08 in progress)
  AC-07 logging contract      . . . FAIL (T-06 in progress — peer_addr leaks)

3 PASS · 1 FAIL · 1 SKIP · 1 contract-fail
Drift found: server/click/handler.rs:42 logs req.peer_addr() — violates D-03.
```

**Writes:** Updates to `SCORE.md` §test-coverage notes.

##### `/vskit:score feature <slug>`

8 parallel scorers evaluate the feature. **Cached** if `git diff <last_scored_sha>..HEAD -- <feature scope>` is clean.

```
$ /vskit:score feature demo-counter
[score] cache miss (10 new commits in scope)
[score] launching 8 scorers in parallel

  Documentation        → prompt-engineer   ... 9
  Test Coverage        → testing-lead      ... 6  (TC-04 fail, TC-05 skip, AC-07 no test)
  Module Clarity       → backend-lead      ... 8
  Requirements Cov     → product-owner     ... 9
  Logging              → devops-lead       ... 5  (T-06 incomplete; AC-07 not met)
  Error Handling       → backend-lead      ... 8
  Security             → security-specialist ... 8
  NFR Compliance       → perf-specialist   ... 6  (latency not yet measured)

Composite: 7.4 / 10
Ship gate: SOFT BLOCK
  - composite 7.4 < 8.0
  - Logging 5 < 7 floor
  - Test Coverage 6 < 7 floor
  - NFR 6 < 7 floor
  (Security 8 ≥ 8 ✓)

Drift Findings:
  AC-07: server/click/handler.rs:42 — peer_addr in log line. Violates D-03.

last_scored_sha updated → b9e4d22
```

**Writes:** Full SCORE.md update (8 rows, composite, history row, drift findings, improvement actions); `last_scored_sha` field.

#### 4. Clauses (invariant rules, v1.8+)

##### `/vskit:clause add <slug> "<rule>" --severity=<...>`

Adds a new clause. Auto-runs `/vskit:clause check` for baseline verdict.

```
$ /vskit:clause add demo-counter "Client IP addresses must never appear in log lines" --severity=high
[clause add] creating CLAUSES.md (was missing) · Applies: clauses appended to SPEC
[clause add] appending CLA-01 (severity High)
[clause add] running baseline check
  spec  → PASS  (94%) — anchored in SPEC §3 AC-07, DECISIONS D-03
  code  → FAIL  (92%) — server/click/handler.rs:42 logs req.peer_addr()

CLA-01 created. Verdict: FAIL @ 92% (HARD BLOCK per §10.3 v1.8).
```

**Writes:** `CLAUSES.md` (file + row); SPEC `Applies:` field if missing; worklog row.

##### `/vskit:clause check <slug> [<clause-id>]`

Re-evaluates one or all active clauses against current SPEC and code.

```
$ /vskit:clause check demo-counter
[clause check] re-checking 3 active clauses against HEAD (b9e4d22)
  CLA-01 [High]    spec → PASS 94% · code → FAIL 92% (transition: FAIL → FAIL)
  CLA-02 [Medium]  spec → PASS 96% · code → PASS 88%
  CLA-03 [Medium]  spec → PASS 88% · code → PASS 85%

Summary: 1 FAIL · 2 PASS
Ship-gate effect: HARD BLOCK (CLA-01 High + FAIL + 92% ≥ 80%)
exit code: 1
```

**Writes:** Updates to CLAUSES.md rows (verdicts, confidence, files, reasoning).

##### `/vskit:clause list <slug> [--status=<pass|fail|stale|indeterminate>]`

Read-only report of clauses for a feature.

```
$ /vskit:clause list demo-counter
Active clauses for demo-counter (3):
  CLA-01  [High]    FAIL  @ 92%   code 2026-05-23  spec 2026-05-23
          "Client IP addresses must never appear in log lines"
  CLA-02  [Medium]  PASS  @ 88%   code 2026-05-23  spec 2026-05-23
          "All campaign strings must be NFC-normalized before any DB write"
  ...
```

**Writes:** Nothing — read-only.

Other clause commands (`/vskit:clause update`, `/vskit:clause remove`, `/vskit:clause audit`, `/vskit:clause check-all`) are listed in the reference table at the bottom of this section.

#### 5. Status & navigation (read-only)

##### `/vskit:project-status`

Reads all SPEC.md files; prints feature states, priorities, composite scores, and blockers.

```
$ /vskit:project-status
vertical-slices-md-dev-kit v2.0 — clickcount @ HEAD b9e4d22

FEATURE        STATE              PRIORITY  COMPOSITE  BLOCKERS
ingest         Backlog            High      —          —
query          Backlog            Medium    —          —
demo-counter   In Development     Medium    7.4/10     SOFT BLOCK on ship

Failing dims (demo-counter):  Logging(5)  Test-Coverage(6)  NFR(6)
Security:                     8 ✓ (hard floor cleared)
```

**Writes:** Nothing — read-only.

##### `/vskit:next-task`

Recommends the single highest-priority unblocked task across all features.

```
$ /vskit:next-task
Highest-priority unblocked task: T-08 (High)
  Unit + integration tests (TC-01..TC-04) — testing-lead — demo-counter
  Closes: Test Coverage floor (6 → ≥7 needed for ship)
```

**Writes:** Nothing — read-only.

#### 6. Audits & quality

##### `/vskit:audit-traceability`

Scans `git log` for `Closes-AC:` trailers on every non-merge commit. Exit non-zero if any commit lacks one.

```
$ /vskit:audit-traceability
[audit] scanning 6 non-merge commits since v1.8
  a3f7c12  chore: adopt vertical-slices-md-dev-kit v2.0   ✓ Closes-AC: bootstrap#AC-01
  e5f9a34  feat(click): POST handler with validation       ✓ Closes-AC: demo-counter#AC-01,02
  17b1c56  feat(click): cap campaign at 64 chars, NFC      ✓ Closes-AC: demo-counter#AC-03  Decision: D-02
  ...

6/6 commits trace to an AC. 0 warnings. exit code: 0
```

**Writes:** Nothing — read-only.

##### `/vskit:report-overhead`

Aggregates the last 7 days of worklog and reports token usage, wallclock, top commands, breach status against the weekly budget.

```
$ /vskit:report-overhead
Repo: clickcount
Window: 2026-05-19 → 2026-05-25 (last 7 days)
Tokens: ~64k / 100k budget   [OK]
Wallclock: 6h 22m
Top commands:
  /vskit:implement feature demo-counter   ~22k
  /vskit:critique spec demo-counter       ~14k
  /vskit:review prd                       ~12k
  /vskit:score feature demo-counter       ~8k
Status: OK (week 1 — no breach)

Estimates marked ~
```

**Writes:** Side effect — archives worklog files older than 90 days into `docs/worklog/_archive/YYYY-MM.md`.

#### 7. Ship

##### `/vskit:check deploy`

Read-only ship-gate evaluation across every feature. Exit 0 if all pass, 1 if any hard-block, 2 if soft-block-only.

```
$ /vskit:check deploy
[check deploy] read-only ship-gate evaluation

  ingest         — Backlog (not deployable)
  query          — Backlog (not deployable)
  demo-counter   — Composite 8.5  Security 8  Tasks 10/10 Done  Trailers ✓  Decisions ✓
                  Clauses: 3/3 PASS (CLA-01 H ✓ CLA-02 M ✓ CLA-03 M ✓)
                  ✓ HARD floor cleared
                  ✓ SOFT floor cleared

Deployable features: demo-counter
exit code: 0
```

**Writes:** Nothing — read-only.

##### `/vskit:ship feature <slug>` (orchestrator)

Chains `/vskit:test` → `/vskit:score` → `/vskit:check deploy` → `/vskit:deploy`. Halts on the first failure; partial progress is preserved.

```
$ /vskit:ship feature demo-counter
[ship] step 1/4: /vskit:test feature demo-counter ... all passing ✓
[ship] step 2/4: /vskit:score feature demo-counter (cached) → 8.5/10 ✓
[ship] step 3/4: /vskit:check deploy ... exit 0 — proceeding
[ship] step 4/4: /vskit:deploy ... Compiling clickcount v0.1.0 ... ✓ deployed

Score history row appended (Trigger: deploy).
Feature lifecycle now: Shipped.
```

**Writes:** SCORE.md `## Score History` row; build artifacts via repo-specific deploy command.

#### 8. Reference table — remaining commands

| Command | Purpose | Writes? |
|---|---|---|
| `/vskit:init-prototypes` | Conditional sub-init when a feature adds `prototype` to Applies. Creates htpasswd + nginx config snippet. | yes (htpasswd) |
| `/vskit:prototype feature <slug>` | UX specialist generates HTML prototype from SPEC §3 ACs. | yes (prototypes/) |
| `/vskit:clause update <slug> <id> "<rule>"` | Edit clause rule or severity. Supersedes the old row; auto-runs check. | yes |
| `/vskit:clause remove <slug> <id>` | Move clause to Removed/Superseded with reason and final verdict. | yes |
| `/vskit:clause audit` | Read-only scan of stale + failing clauses across all features. | no |
| `/vskit:clause check-all` | Run `/vskit:clause check` for every feature with `clauses` in Applies. | yes |
| `/vskit:show-backlog` | Aggregated open tasks across all features, filterable. | no |
| `/vskit:open-questions` | Aggregate unresolved §9 Open Questions from all SPECs. | no |
| `/vskit:audit spec [<slug>]` | Audit SPEC §4.3 completeness + Touches correctness + INC↔SPEC conflicts. | no |
| `/vskit:security-review` | security-specialist audits the full codebase. | yes (if findings → incidents/) |
| `/vskit:run-tests` | Repo-specific full test suite. | updates SCORE.md test-coverage notes |
| `/vskit:run-e2e` | End-to-end tests only. Screenshots on failure. | yes (screenshots/) |
| `/vskit:health-check` | Hit health endpoints for app + dependencies. | no |
| `/vskit:gen-prototype-index` | Regenerate `docs/prototypes/index.html` from feature folders. | yes |
| `/vskit:score-all` | Run `/vskit:score feature` across all features (honors cache). | yes (when not cached) |
| `/vskit:deploy` | Repo-specific deploy command (always runs `/vskit:check deploy` first). | yes (waiver row if soft-block) |
| `/vskit:ship-all` | For each feature in Spec Ready or Testing: `/vskit:ship`. | yes |
| `/vskit:run-pipeline prd <prd-path>` | End-to-end orchestrator: `/vskit:review prd` → `/vskit:critique prd` → `/vskit:prd-to-features` → per-feature pipeline. | yes |

#### When commands write a waiver

`/vskit:deploy` (and the `/vskit:ship` orchestrator that calls it) is the only place a **logged waiver** can be created. On a soft-block, the command prompts:

```
2 features below ship gate (composite < 8 on demo-counter; e2e gap on signup).
Deploy anyway? [y/N]: y
Waiver reason: marketing demo deadline; signup e2e blocked on staging env
```

If the operator types `y`, `/vskit:deploy` appends a row to **each failing feature's `SCORE.md ## Score History`** capturing date, deployer, failing dimensions, composite at deploy, and the free-text reason. Bypasses are auditable. Silent bypasses are not possible (the pre-push hook calls `/vskit:check deploy` and exits non-zero on hard-block).

---

## Who this is for

You're a **solo dev or staff engineer** running an AI-assisted greenfield repo (or a small one). You ship a lot of code that Claude / Codex / Cursor / Aider helped write. You can feel that the spec lives in your head and the AI's output drifts from it slowly. You want guardrails that *don't* require a 10-person process team to maintain.

This bundle gives you four things that `git` + `make` + `pytest` do not:

1. **Intent declared before code.** Every commit names which PRD/SPEC acceptance criterion it satisfies.
2. **Quality measured per change, not per release.** Up to 8 named dimensions scored 0–10. Refuses to ship below floor.
3. **Overhead measured per repo.** The bundle records its own cost and forces a drop decision when it stops paying for itself.
4. **Decisions traceable from rationale to commit.** DECISIONS.md → SPEC.md → TASKS.md → commit trailer → audit. Every merged line walks back to the question that motivated it.

The full case is in [`vertical-slices-ai-framework.md`](./vertical-slices-ai-framework.md) §0.1.

## Per-feature anatomy — and why it produces solid specs

Every adopted feature lives in `docs/features/<slug>/`. **The point of this format is not documentation discipline — it's a quality scaffold.** Each file enforces a specific property that makes the spec verifiable rather than aspirational. Skip ahead to a file's subsection to see what it captures, why the format is what it is, and a snippet from the [worked example](./example/features/demo-counter/).

### Quick reference

| File | Required when | What it captures |
|---|---|---|
| [`SPEC.md`](#specmd--the-contract-always) | always | Problem, scope, independently-verifiable ACs, NFRs, test spec, open questions |
| [`TASKS.md`](#tasksmd--broken-from-acs-always) | always | Implementation tasks linked to ACs and decisions |
| [`DECISIONS.md`](#decisionsmd--the-rationale-journal-always) | always | Every design decision: question, decision, rationale, what canonical file got updated |
| [`SCORE.md`](#scoremd--quantified-quality-across-8-dimensions-always) | always | 8 dimensions scored 0–10, composite, ship-gate status, drift, history |
| [`DBSCHEMA.md`](#dbschemamd--tables-and-migrations-when-applies-dbschema) | `Applies: dbschema` | Tables, indexes, migrations with Up + Down + back-compat assertion |
| [`INTERFACE-CONTRACTS.md`](#interface-contractsmd--http-ws-rpc-endpoints-when-applies-interface-contracts) | `Applies: interface-contracts` | Endpoint contracts: request shape, validation, responses, auth, rate limits, logging |
| [`CLAUSES.md`](#clausesmd--ai-graded-invariant-rules-when-applies-clauses) | `Applies: clauses` | Invariant rules graded PASS/FAIL/INDETERMINATE with confidence + reasoning |
| [`prototypes/`](#prototypes--ux-mockups-when-applies-prototype) | `Applies: prototype` | UX prototype HTML for stakeholder review before code |

Each has a copy-paste skeleton in [`templates/`](./templates/). The [worked example](./example/features/demo-counter/) ships every file populated.

---

### `SPEC.md` — the contract (always)

**What it captures.** Problem statement (§1), in/out scope (§2), independently-verifiable acceptance criteria (§3), NFRs (§4 — latency, error budget, auth, quotas, accessibility, security), test specification (§7), open questions (§9), implementation notes (§10).

**Why this produces solid specs.**

- **ACs must be independently verifiable.** Documentation score (§7.2 Dim 1) drops for vague ACs like "user can log in." Only sharp ACs like `AC-04: POST /click enforces 60 req/min/IP; the 61st returns 429` clear the floor. The format *forces* sharpness.
- **`Applies:` is an honest scope declaration.** A backend-only feature declares `[dbschema, interface-contracts]`; a CLI library declares `[]`. The scorer only audits what's declared — no penalizing a CLI lib for missing HTTP contracts.
- **`Touches:` is the cache key.** `/vskit:score` uses it to decide what to re-score. Keeps scoring fast without hiding stale code.
- **`Status` is removed by design.** Lifecycle is *computed* from observable state (TASKS row statuses + score values + score history). No one can fake "we're 80% done" — the files tell the truth.

**Example excerpt** (from [`example/features/demo-counter/SPEC.md`](./example/features/demo-counter/SPEC.md)):

```markdown
**Applies:** [dbschema, interface-contracts, clauses]
**Touches:** [`server/click/**`, `server/db/migrations/202*_clicks.sql`]

## §3 Acceptance Criteria
- [x] AC-01: `POST /click` with `campaign=spring_promo` increments the count
       for `spring_promo` by 1 and returns `204 No Content`.
- [x] AC-04: `POST /click` enforces a per-IP rate limit of 60 requests/minute.
       The 61st request returns `429 Too Many Requests`. *(see DECISIONS D-01)*
- [ ] AC-07: All AC behavior is logged structured-JSON with a `campaign` field,
       never the client IP. *(see DECISIONS D-03)*
```

---

### `TASKS.md` — broken from ACs (always)

**What it captures.** Implementation tasks derived from SPEC §3 ACs. Columns: ID, description, owner, priority, status, linked ACs, source decision ID.

**Why this produces solid specs.**

- **Every task has `Linked ACs`.** No work happens that doesn't trace to a requirement. The `/vskit:audit-traceability` command later refuses to merge commits that don't cite an AC.
- **`Decision: D-NN` column splits design-driven vs. baseline work.** A task that exists because of a /critique decision carries the decision ID. Tasks that just satisfy an AC have `—`. The split tells reviewers which work is opinion-shaped.
- **Status is the only hand-edited lifecycle signal.** Everything else is computed. The four valid states (`Pending → In Progress → In Review → Done`) are deliberate — fewer states means fewer lies.

**Example excerpt** (from [`example/features/demo-counter/TASKS.md`](./example/features/demo-counter/TASKS.md)):

```markdown
| ID | Description | Owner | Priority | Status | Linked ACs | Decision |
|----|-------------|-------|----------|--------|------------|----------|
| T-04 | Campaign-length cap at 64 chars + Unicode NFC | backend-lead | Medium | Done | AC-03 | D-02 |
| T-05 | Per-IP rate limiter (60/min token bucket)     | backend-lead | High   | Done | AC-04 | D-01 |
| T-08 | Unit + integration tests (TC-01..TC-04)       | testing-lead | High   | In Progress | AC-01..AC-06 | — |
```

---

### `DECISIONS.md` — the rationale journal (always)

**What it captures.** Every design decision: who raised it, the question, the decision, the rationale, which canonical file got updated (the propagation contract), any superseded prior decision. Unresolved items move to `## Deferred Items` (DEF-NN).

**Why this produces solid specs.**

- **The propagation contract forbids orphan rows.** Every decision must cite the canonical file it caused to change (`SPEC §3 AC-04`, `DBSCHEMA users.deleted_at`, etc.). An orphan row is a Documentation defect — caught by `/vskit:score` Dim 1.
- **Unresolved decisions become `DEF-NN`, not silent drops.** Per INV-3 (fail loud): a decision that didn't land in a canonical file but won't be acted on right now still gets a row, with `Why deferred` and `Revisit when` filled.
- **History is append-only.** Superseded decisions get a `Supersedes: D-NN` link to the replacement; they don't disappear. Six months later, "why does this code check IP again?" answers itself: `git log --grep='Decision: D-04'` → DECISIONS.md D-04 → rationale + alternatives considered + who raised it.

**Example excerpt** (from [`example/features/demo-counter/DECISIONS.md`](./example/features/demo-counter/DECISIONS.md)):

```markdown
| ID | Date | Raised by | Question | Decision | Rationale | Updates |
|----|------|-----------|----------|----------|-----------|---------|
| D-01 | 2026-05-19 | security-specialist | Rate-limit storage: in-memory or Redis? | In-memory token bucket, per-instance | Single-instance launch; Redis would add a dependency for a feature marketing may sunset in 6 months | SPEC.md §3 AC-04, §4 Quota row, §10 note 1 |
| D-05 | 2026-05-21 | product-owner | Auth required on POST /click? | No — public endpoint, rate-limit is the abuse control. | Auth would defeat the use case (recipients have no creds) | SPEC.md §4 Security row; INTERFACE-CONTRACTS.md POST /click auth |
```

---

### `SCORE.md` — quantified quality across 8 dimensions (always)

**What it captures.** 8 quality dimensions scored 0–10 (Documentation, Test Coverage, Module Clarity, Requirements Coverage, Logging, Error Handling, Security, NFR Compliance), composite, ship-gate status, drift findings, score history, improvement actions.

**Why this produces solid specs.**

- **Eight INDEPENDENT scorers — no averaging away weakness.** The composite (mean) is informational; the ship gate enforces *every dim ≥ 7* and *security ≥ 8* separately. A Security 5 cannot hide behind a Documentation 9.
- **Each dimension has a named owner.** security-specialist scores Security, devops-lead scores Logging, etc. The Stop hook records which subagent ran. When a score drops, you know who to ask.
- **Drift Findings list code-vs-spec mismatches by file:line.** Six months later, the score file *is* the audit. No "we'll figure out where the bug is" — the line number is right there.
- **Score History shows trajectory.** A composite that climbs `2.1 → 5.8 → 7.4 → 8.5` across one feature tells you which sessions moved the needle and which were friction.

**Example excerpt** (from [`example/features/demo-counter/SCORE.md`](./example/features/demo-counter/SCORE.md)):

```markdown
| Dimension | Score | Scorer | Notes |
|-----------|-------|--------|-------|
| Documentation | 9 | prompt-engineer | All sections present, all DECISIONS have Updates |
| Test Coverage | 6 | testing-lead | TC-04 in progress (T-08); AC-07 no test |
| Logging | 5 | devops-lead | T-06 In Progress — AC-07 not met |
| Security | 8 | security-specialist | Input validation OK; rate-limit per-instance only |

**Composite:** 7.4 / 10
**Ship gate:** SOFT BLOCK — Logging (5), Test Coverage (6), NFR (6) below 7 floor

## Drift Findings
- AC-07: `server/click/handler.rs:42` logs full request including `req.peer_addr()`.
  Violates D-03. Filed as part of T-06.
```

---

### `DBSCHEMA.md` — tables and migrations (when `Applies: dbschema`)

**What it captures.** Tables, columns, constraints, indexes, plus migrations (each with Up steps, Down/rollback steps, and a back-compat assertion).

**Why this produces solid specs.**

- **Migrations force Up + Down + back-compat.** Three fields are mandatory; missing any is a Dim 7 (Security) defect because migration risk lives there. A one-way migration must explicitly justify the absence of a rollback — silent omission is forbidden.
- **Back-compat assertion is a paragraph, not a checkbox.** It names which old code paths continue to work between the Up and the corresponding code release. If no back-compat window is needed (coordinated single-deploy), the spec demands you say so explicitly with rationale.

**Example excerpt** (from [`example/features/demo-counter/DBSCHEMA.md`](./example/features/demo-counter/DBSCHEMA.md)):

```markdown
### M-01 — 2026-05-20 — Create `clicks` table

**Up steps**
CREATE TABLE clicks (
  id          bigserial   PRIMARY KEY,
  campaign    text        NOT NULL CHECK (length(campaign) <= 64),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX clicks_campaign_idx ON clicks (campaign);

**Down steps (rollback)**
DROP INDEX IF EXISTS clicks_campaign_idx;
DROP TABLE IF EXISTS clicks;

**Back-compat assertion**
Additive new-table migration. No existing code reads or writes `clicks`
before this migration; no existing code becomes invalid after it.
No coordinated deploy window required.
```

---

### `INTERFACE-CONTRACTS.md` — HTTP / WS / RPC endpoints (when `Applies: interface-contracts`)

**What it captures.** Endpoint contracts: request shape (body, query, path params), validation rules, response codes and bodies, auth model, rate limits, logging contract.

**Why this produces solid specs.**

- **Auth model declared explicitly per endpoint.** Public endpoints say "Auth: None — public endpoint by design (DECISIONS D-05)" — never silently assumed. If a security incident asks "why was this open?", the SPEC has the answer with the decision ID.
- **Validation rules trace to ACs and DECISIONS.** AC-03 says "campaign ≤ 64 chars." Decision D-02 says "NFC-normalize first." Both appear in the endpoint's validation section. The contract is the canonical place — code reviewers can grep for the rule before the type system catches it.
- **Logging contract is part of the endpoint, not an afterthought.** Every endpoint specifies what's logged (`campaign`, `status`, `duration_ms`) and what's NEVER logged (client IP, user-agent). Pairs with Dim 5 (Logging) scoring.

---

### `CLAUSES.md` — AI-graded invariant rules (when `Applies: clauses`)

**What it captures.** Invariant rules graded by AI: severity (Low/Medium/High/Critical), last spec check + last code check verdicts (PASS/FAIL/INDETERMINATE), confidence 0–100%, top-5 enforcement files, reasoning paragraphs, removed/superseded log.

**Why this produces solid specs.**

- **Clauses fill the gap ACs and NFRs can't.** ACs test behavior on one request. NFRs measure aggregate properties. Clauses assert invariants that must hold *across the codebase*: "no PII in logs anywhere," "every write is audited," "no protected route without auth middleware." Things you can't express in one unit test.
- **Verdicts come with confidence percentages.** A 100% confidence verdict is rare and suspect — typical PASS lands 80–95%, typical FAIL 70–90%. Below 60% escalates to INDETERMINATE per INV-3 (don't present soft answers as hard ones).
- **Top-5 enforcement files is the audit trail.** When a clause flips from PASS to FAIL, the AI names exactly which files lost the property and why. Reviewers can go straight to the regression.
- **Stale clauses count as INDETERMINATE.** A clause whose last code-check is older than 14 days fails the ship gate at Medium severity or higher. Forces periodic re-checking without becoming nuisance for low-severity rules.

**Example excerpt** (from [`example/features/demo-counter/CLAUSES.md`](./example/features/demo-counter/CLAUSES.md)):

```markdown
### CLA-01 — Client IP addresses must never appear in log lines

| Field | Value |
|---|---|
| **Severity** | High |
| **Last code check** | 2026-05-23 — `FAIL` (92% confidence) |
| **Last spec check** | 2026-05-23 — `PASS` (94% confidence) |

**Top 5 enforcement files** (ordered by relevance):
1. `server/click/handler.rs` — request entry point; current FAIL source
2. `server/click/logger.rs` — structured-log wrapper; should be single chokepoint
3. `tests/click/log_no_pii.rs` — currently FAILING test
...
```

---

### `prototypes/` — UX mockups (when `Applies: prototype`)

**What it captures.** UX prototype HTML (`index.html` + assets/) for stakeholder review before code. Served behind basic-auth at `/prototypes/` per spec §6.

**Why this produces solid specs.**

- **A prototype is approval-gated before implementation.** A feature with `Prototype: required` cannot move from `Spec Ready` to `In Development` until `Prototype: approved` is set in SPEC frontmatter. The UX specialist signs off.
- **Basic-auth keeps non-prod mockups out of search engines.** Credentials live in the host's secrets store, never in the repo.

---

### How the files relate

```
PRD.md  (portfolio-wide, one per product)
  ↓ /vskit:prd-to-features
docs/features/<slug>/
  ├── SPEC.md          ← contract: what + acceptance criteria
  │     ↓ /vskit:critique spec  (specialists interrogate)
  │     ↑ updates from
  │   DECISIONS.md     ← rationale journal (the "why")
  │     ↓ propagates to
  │   DBSCHEMA.md      ← schema (if dbschema in Applies)
  │   INTERFACE-CONTRACTS.md  ← endpoints (if interface-contracts in Applies)
  │     ↓
  ├── TASKS.md         ← broken from §3 ACs, tracked to Done
  │     ↓ /vskit:implement feature
  │   code commits with Closes-AC: trailers
  │     ↓ /vskit:score feature
  ├── SCORE.md         ← 8 dims + composite + drift + history
  └── CLAUSES.md       ← invariants (if clauses in Applies); re-checked by /vskit:clause check
```

**Read order for a new feature:** SPEC → DECISIONS → CLAUSES (if any) → TASKS → SCORE. The first three are *what the feature is*; the last two are *how it gets built and graded*.

## What's in this bundle

```
vertical-slices-md-dev-kit/
├── README.md                          ← you are here
├── LICENSE                            ← MIT
├── CONTRIBUTING.md                    ← how to file issues and PRs
├── SECURITY.md                        ← vulnerability disclosure policy
├── CHANGELOG.md                       ← version history
├── ADOPTION.md                        ← under-an-hour adoption tutorial
├── WALKTHROUGH.md                     ← every command simulated end-to-end on one feature
├── vertical-slices-ai-framework.md    ← the spec (1027 lines, normative)
├── settings.json.snippet              ← .claude/settings.json Stop hook block
├── scripts/
│   └── worklog-stop-hook.sh           ← reference implementation of §5.2 Stop hook
├── templates/
│   ├── PRD.md                         ← §3.2 PRD template
│   ├── SPEC.md                        ← §4.3 SPEC template
│   ├── TASKS.md                       ← §4.4 tasks template
│   ├── DECISIONS.md                   ← §4.5 decisions template
│   ├── CLAUSES.md                     ← §4.7 clauses template (v1.8)
│   ├── SCORE.md                       ← §7.3 score template
│   └── CLAUDE.md-snippet.md           ← §9 CLAUDE.md §Commands snippet
├── example/
│   └── features/demo-counter/         ← one fully-populated feature folder (incl. CLAUSES.md)
└── case-studies/
    ├── README.md                      ← what counts as a case study
    ├── 01-self-adoption.md            ← the kit scores its own market-readiness
    └── 02-bab-bootstrap.md            ← (placeholder) first external adoption
```

## What "ready to adopt" means

You can pick this bundle up if:

- You write code with AI assistants and you have a `CLAUDE.md` (or equivalent) in the repo today.
- You ship to one repo, not a portfolio. Cross-repo governance is out of scope (spec §1).
- You're willing to hand-edit markdown. The bundle is not a SaaS — it's a methodology + a few shell scripts.

You should not adopt this bundle if:

- You need a hosted dashboard. The framework is file-based by design (INV-1: single source of truth).
- You're shipping a portfolio of microservices that need shared schemas. The spec is explicit about being per-repo.
- You're allergic to the discipline of writing acceptance criteria before writing code. The bundle does not work without that step.

## How vertical-slices-md-dev-kit is different from…

| Alternative | Difference |
|---|---|
| Plain `CLAUDE.md` instructions | `CLAUDE.md` tells the AI what to do; vertical-slices-md-dev-kit records what got done, with a ship gate |
| [GitHub Spec Kit](https://github.com/github/spec-kit) | Spec Kit scaffolds spec docs; vertical-slices-md-dev-kit adds **scoring**, **lifecycle computed from state**, and **commit-trailer traceability** |
| [BMAD method](https://github.com/bmadcode/BMAD-METHOD) | BMAD orchestrates AI agents for delivery; vertical-slices-md-dev-kit is the **quality layer** under whatever orchestration you already use |
| Cursor / Aider rule files | Editor-scoped style guides; vertical-slices-md-dev-kit is **per-feature lifecycle + scoring + audit** |

### Same task, side-by-side

Ship a feature ("rate-limited POST endpoint") with each approach. The difference is what the repo holds afterwards.

| Step | Plain CLAUDE.md | GitHub Spec Kit | vertical-slices-md-dev-kit |
|---|---|---|---|
| **1. Capture intent** | One paragraph in `CLAUDE.md` | `/specify` generates a SPEC document | PRD §6 line + SPEC §3 ACs (each independently verifiable) |
| **2. Decide auth / rate-limit shape** | In your head; maybe a code comment | Possibly captured in SPEC sections | **DECISIONS.md row** with rationale, citation, and propagation back to SPEC §3 + §4 |
| **3. Implement** | AI writes code; you review | AI writes code; you review | AI writes code; commit carries `Closes-AC: <slug>#AC-NN` + `Decision: D-NN` trailers |
| **4. Test** | Whatever your test runner says | Whatever your test runner says | Test runner + 8 scored dimensions across 8 parallel scorers |
| **5. Gate to ship** | Tests green = ship | Tests green = ship | Composite ≥ 8 AND security ≥ 8 AND every dim ≥ 7 AND `last_scored_sha` current AND no orphan decisions |
| **6. What the repo retains** | The diff + commit message | The SPEC + the diff | SPEC + DECISIONS journal + SCORE history + commit trailers that walk back to the AC and the decision that motivated it |
| **7. Six months later** | "Why does this code check IP again?" Read code, guess. | Read SPEC. Maybe matches. | `git log --grep='Decision: D-04'` → DECISIONS.md D-04 → rationale + alternatives considered + who raised it |

The headline: every approach can ship the same code. Only vertical-slices-md-dev-kit keeps the chain from *the question* to *the line of code* intact — and refuses to ship if any link in that chain breaks.

## Version

This is **v2.0**. See [`CHANGELOG.md`](./CHANGELOG.md) for what changed between versions. The spec carries `**Version:** 2.0` in its frontmatter — that is the authoritative version pointer.

## License

MIT. Bundle and reference scripts: copy, modify, ship, charge for the work you build on top. No attribution required, though a link back is appreciated.

## Spec authority

When the spec disagrees with this README, the README is wrong. Update the README. See `vertical-slices-ai-framework.md` §12.
