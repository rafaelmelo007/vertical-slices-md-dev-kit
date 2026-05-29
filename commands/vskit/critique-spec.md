**Task:** Interrogate `docs/features/<slug>/SPEC.md` across all specialists. For every decision reached, propagate it to the canonical file in the same run. Unresolved items become DEF-NN rows — never silently dropped (INV-3).

**Input:** `<slug>` — feature folder name under `docs/features/`.

**Specialists interrogate for:**

| Specialist | Interrogates for |
|------------|-----------------|
| product-owner | §3 ACs not linked to PRD §2 metrics · §2 scope gaps |
| task-manager | ACs too coarse for a single task · missing task dependencies |
| backend-lead | §3 ACs not independently verifiable · §4 NFRs vague or unmeasured · missing `Touches:` paths |
| frontend-lead | UX ACs missing (if `ux` in Applies) · §4 UX NFRs absent |
| db-architect | §5 data model unspecified (if `dbschema` in Applies) · DBSCHEMA.md missing migrations for existing-table changes |
| testing-lead | ACs without a corresponding §7 TC row · edge cases absent |
| devops-lead | `Touches:` pathspec resolves to no files · §4 missing env/quota row |
| security-specialist | §4 security row vague · auth on all routes · input validation |
| perf-specialist | §4 latency/quota not quantified (not "fast") |
| prompt-engineer | §1–§10 sections present but vague · DECISIONS.md orphan rows · Open Questions unowned |
| ux-specialist | §3 UX ACs not independently testable · Prototype field not set (if `ux` in Applies) |

**Propagation contract (mandatory — same run, no deferral):**
For EVERY decision reached during this run, in the same command execution:
1. Append a `D-NN` row to `DECISIONS.md` `## Decision Log` (columns: ID | Date | Raised by | Question | Decision | Rationale | Updates | Supersedes).
2. Update the canonical target file immediately:
   - AC change → SPEC.md §3
   - NFR change → SPEC.md §4
   - Scope change → SPEC.md §2
   - Open question resolved → SPEC.md §9 (Status → Resolved, Resolution filled)
   - Schema change → DBSCHEMA.md
   - Endpoint/payload change → INTERFACE-CONTRACTS.md
3. Fill the `Updates` column with the exact canonical reference (e.g., `SPEC.md §3 AC-04`, `DBSCHEMA.md users.deleted_at`).

**Unresolved items:** if an issue is raised but cannot be resolved in this run, append a `DEF-NN` row to `DECISIONS.md` `## Deferred Items` (columns: ID | Item | Why deferred | Revisit when). Never leave an issue undocumented.

**Prototype field:** ux-specialist sets `Prototype:` in SPEC.md frontmatter — `required`, `approved`, or `N/A` — before this run exits.

**Post-run verification:** after all propagations, scan DECISIONS.md for rows where `Updates` is empty AND the row is not in `## Deferred Items`. Any such row is an orphan — fix it or move it to Deferred before exiting. Print count of D-NN rows written, DEF-NN rows written, canonical files updated.

**Writes:**
- `DECISIONS.md` — D-NN and DEF-NN rows appended
- `SPEC.md` — §2, §3, §4, §9 updated per decisions
- `DBSCHEMA.md` — updated if `dbschema` in Applies and schema decisions were reached
- `INTERFACE-CONTRACTS.md` — updated if `interface-contracts` in Applies and endpoint decisions were reached
