**Task:** Grill-me interrogation of the PRD. Specialists probe for weak evidence, vague metrics, missing sections, and unresolved assumptions.

**Input:** `<prd-path>` — path to the PRD markdown file.

**Interrogation targets per specialist:**

| Specialist | Interrogates for |
|------------|-----------------|
| product-owner | §3 evidence not verbatim (paraphrased or invented) · §2 metrics not measurable |
| task-manager | §6 feature lines with no clear scope boundary · §14 missing dependencies |
| backend-lead | §7 NFRs that name no auth model or rate-limit mechanism |
| frontend-lead | §7 UX baseline absent or underspecified |
| db-architect | §6 features touching shared data with no flag in §14 |
| testing-lead | §2 metrics that cannot be tested · §3.2 assumption tests absent |
| devops-lead | §14 dependencies missing version pins · §10 SLOs not defined |
| security-specialist | §7 security posture missing or vague · PII in §10 dashboards |
| perf-specialist | §7 latency/quota stated qualitatively (e.g., "fast", "scalable") |
| prompt-engineer | §3.1 verbatim signals fewer than 3 · §13 open questions without resolution paths |
| ux-specialist | §6 user-facing features with no UX surface flagged |

**For each finding:** add an inline annotation directly in the PRD at the relevant passage:
```
> Q: <specialist-slug>: <question or challenge>
```

**After all annotations:** collect every unanswered question and add/update rows in PRD `§13 Open Questions`:
| # | Question | Owner | Status | Resolution |

Questions already in §13 keep their existing entries; new ones get the next available `#` number.

**Completion check:** after writing §13, verify no annotation was added without a corresponding §13 row. Silent drops are forbidden (INV-3).

**Writes:** annotated PRD with `> Q:` inline comments + §13 Open Questions rows updated.
