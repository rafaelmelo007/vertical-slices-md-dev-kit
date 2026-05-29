**Task:** Audit all `docs/features/*/SPEC.md` files for structural completeness, pathspec accuracy, and INC↔SPEC conflicts. Read-only — writes nothing.

**Three audit checks per feature:**

**Check A — §4.3 section completeness:**
Verify all 10 canonical sections are present and non-empty (may be `N/A — <reason>` but not omitted):
§1 Problem Statement, §2 Scope, §3 Acceptance Criteria, §4 Non-Functional Requirements, §5 Data Model, §6 Interface Contracts, §7 Test Specification, §8 Cross-References, §9 Open Questions, §10 Implementation Notes.
Also verify: `Applies:`, `Touches:`, `Priority:`, `Prototype:`, `Agents:`, `Source:` frontmatter fields present.

**Check B — `Touches:` correctness:**
- For each path in `Touches:`: run `git ls-files <path>`. Warn if resolves to zero files.
- Run: `git log --name-only --format="%H" <last_scored_sha>..HEAD | grep -E "^(src|server|client|app)/"` — check if any recently touched files match feature's `Closes-AC: <slug>#` trailers but fall outside the `Touches:` pathspec. Warn if stale scope detected (silent cache miss risk).

**Check C — INC↔SPEC conflicts:**
Read all `docs/incidents/INC-*.md`. For each INC with `status: resolved` that references this feature: check whether the INC body asserts behavior the SPEC does not describe. If a contradiction exists and the INC does not link to a SPEC PR that resolved it, flag as Dim 1 (Documentation) defect.

**Output per feature:**
```
[<slug>]
  A: PASS | WARN: missing sections: §N, §N
  B: PASS | WARN: Touches: '<path>' resolves to 0 files | WARN: recent commits outside Touches scope
  C: PASS | WARN: INC-NNN asserts <X> but SPEC §3 does not describe it
```

After all features, print:
```
Features with warnings: N
```

Exit non-zero if any warnings exist.

**Writes nothing.**
