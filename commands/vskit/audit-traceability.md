**Task:** Scan `git log <since>..HEAD` for `Closes-AC:` trailers on every non-merge commit. Exit non-zero if any commit lacks one. Read-only — writes nothing.

**Input:** optional `<since-ref>` argument.

**Determine `<since>` reference:**
1. If `<since-ref>` argument provided: use it directly.
2. Else if any git tags exist: `git describe --tags --abbrev=0` (most recent tag).
3. Else: `git merge-base HEAD origin/main`.

Print: `Scanning commits since: <resolved since-ref>`

**Traceability exemption:** if the repo's `CLAUDE.md` contains the line `Traceability: aspirational`, print:
```
[INFO] Traceability is aspirational for this repo. Closes-AC trailers are not enforced.
```
Exit 0. Do not scan.

**Scan:**
Run: `git log --no-merges --format="%H %s" <since>..HEAD`
For each commit SHA:
- Run: `git log -1 --format="%B" <sha>`
- Check for presence of line matching: `^Closes-AC: \S+#AC-\d+`
- If missing: flag as non-compliant.

**Output:**
```
Scanned: N commits (since <ref>)
Compliant: N
Non-compliant: N

Non-compliant commits:
  <sha7> <subject line>
  <sha7> <subject line>
```

If all commits are compliant, print: `All N commits have Closes-AC trailers.` Exit 0.
If any non-compliant: exit non-zero.

**Writes nothing.**
