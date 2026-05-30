# Test Plan — <Feature Name>

Links every acceptance criterion from SPEC.md §3 to at least one test. A test with no AC origin is a coverage gap; an AC with no test is a ship-gate blocker.

**Test file locations:**
- Backend unit / integration: *(path)*
- Frontend unit: *(path)*
- E2E: *(path)*

---

## Backend Tests

| ID | AC | Description | Type | Priority |
|----|----|-------------|------|----------|
| BE-01 | AC-01 | Happy path — *(describe)* | Integration | Must |
| BE-02 | AC-01 | Not found — returns 404 | Integration | Must |
| BE-03 | AC-02 | Validation failure — returns 400 with error body | Integration | Must |
| BE-04 | AC-xx | Auth required — missing token returns 401 | Integration | Must |
| BE-05 | AC-xx | Role restricted — wrong role returns 403 | Integration | Must |

---

## Frontend Tests

| ID | AC | Description | Target | Priority |
|----|----|-------------|--------|----------|
| FE-01 | AC-03 | Service maps success response to view model | Service | Must |
| FE-02 | AC-03 | Service surfaces error to caller | Service | Must |
| FE-03 | AC-04 | Component renders empty state | Component | Must |
| FE-04 | AC-04 | Component renders error state | Component | Should |
| FE-05 | AC-04 | Component renders loading state | Component | Should |

---

## E2E Tests

| ID | Tag | AC | Description | Critical path? |
|----|-----|----|-------------|----------------|
| E2E-01 | `@smoke` | AC-01 | *(Core user flow end-to-end)* | Yes |
| E2E-02 | | AC-03 | *(Secondary flow)* | No |

---

## Edge Cases

- *(List edge cases that must be explicitly covered by tests)*

---

## Out of Scope

- *(What is not tested here and why)*
