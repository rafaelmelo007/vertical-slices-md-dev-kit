# Rules — <Feature Name>

**Feature:** <slug>
**Source:** /vskit:rule add | /vskit:rule check
**Last updated:** YYYY-MM-DD

> Rules are invariant rules the feature must hold across the codebase (§4.7).
> Unlike ACs (testable per turn) and NFRs (measured per release), rules are
> AI-graded with confidence. Read §4.7 before adding a clause; rules are
> reserved for properties that cannot be cleanly expressed as a single test.

## Active Rules

### RUL-01 — <one declarative sentence stating the rule>

| Field | Value |
|---|---|
| **Severity** | Medium  *(Low \| Medium \| High \| Critical)* |
| **Added** | YYYY-MM-DD |
| **Scorer** | security-specialist  *(override only when the rule is not security-shaped)* |
| **Last spec check** | YYYY-MM-DD — `PASS` (XX% confidence) |
| **Last code check** | YYYY-MM-DD — `PASS` (XX% confidence) |

**Top 5 enforcement files** *(ordered by relevance)*

1. `path/to/file.ext` — *why this file matters to the clause*
2. `path/to/another.ext` — *...*
3. `path/to/third.ext` — *...*
4. `path/to/fourth.ext` — *...*
5. `path/to/fifth.ext` — *...*

**Reasoning — last code check**

<one paragraph: what the scorer found in the code, where the enforcement points
are, what (if anything) gives them less than full confidence. Be specific —
name lines and conditions, not "looks good".>

**Reasoning — last spec check**

<one paragraph: where the clause's requirement is anchored in SPEC/DBSCHEMA/
INTERFACE-CONTRACTS/DECISIONS. If the spec doesn't mention it, that itself is
a finding — rules with no spec anchor should be raised to /vskit:critique spec.>

---

### RUL-02 — <next clause>

*(same structure)*

---

## Removed / Superseded Rules

| ID | Date | Reason | Final verdict (spec / code) | Supersedes |
|----|------|--------|----------------------------|-------------|
| RUL-00 | YYYY-MM-DD | Merged into RUL-01 (broader scope) | PASS 89% / PASS 84% | — |

> **Why this table exists:** rules cannot be silently deleted (§4.7). Removal
> preserves the final verdict and the reason. If a clause was updated rather
> than removed, the old row lives here with `Supersedes: RUL-NN` pointing at
> its replacement.

## How to maintain this file

| Action | Command |
|---|---|
| Add a new rule | `/vskit:rule add <slug> "<rule>" --severity=<low\|medium\|high\|critical>` |
| Re-check one rule | `/vskit:rule check <slug> RUL-NN` |
| Re-check all rules | `/vskit:rule check <slug>` |
| Edit rule text or severity | `/vskit:rule update <slug> RUL-NN "<new rule>"` |
| Remove a rule | `/vskit:rule remove <slug> RUL-NN` |
| List active rules | `/vskit:rule list <slug>` |

Rules with `Last code check` older than 14 days are **stale** and count as
INDETERMINATE for ship-gate purposes (soft block) per §4.7.
