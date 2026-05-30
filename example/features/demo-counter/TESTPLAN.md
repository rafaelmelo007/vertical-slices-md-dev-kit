# Test Plan — Click Counter

Links every acceptance criterion from SPEC.md §3 to at least one test.

**Test file locations:**
- Backend integration: `server/tests/counter/`
- Frontend unit: `client/src/**/__tests__/`

---

## Backend Tests

| ID | AC | Description | Type | Priority |
|----|----|-------------|------|----------|
| BE-01 | AC-01 | `POST /click` with `campaign=spring_promo` returns 204 and increments count by 1 | Integration | Must |
| BE-02 | AC-02 | `POST /click` with no campaign returns 400 with `{"error":"campaign required"}` | Integration | Must |
| BE-03 | AC-03 | Campaign string > 64 chars returns 400 | Integration | Must |
| BE-04 | AC-04 | 61st request from same IP within rolling minute returns 429 | Integration | Must |
| BE-05 | AC-05 | `GET /click/spring_promo` returns `{"campaign":"spring_promo","count":N}` with 200 | Integration | Must |
| BE-06 | AC-06 | `GET /click/unseen` returns `{"campaign":"unseen","count":0}` with 200 — no 404 | Integration | Must |
| BE-07 | AC-07 | Structured log includes `campaign` field and does not include client IP | Unit | Must |
| BE-08 | AC-08 | Migration M-01 has both Up and Down scripts; Down rolls back cleanly | Integration | Must |

---

## Frontend Tests

| ID | AC | Description | Target | Priority |
|----|----|-------------|--------|----------|
| FE-01 | AC-05 | `CounterDisplay` renders count returned by service | Component | Must |
| FE-02 | AC-05 | `CounterDisplay` renders zero state when count is 0 | Component | Must |
| FE-03 | AC-01 | `counterService.increment()` calls `POST /click` with correct campaign param | Service | Must |
| FE-04 | AC-02 | `counterService.increment()` surfaces 400 error to caller | Service | Must |

---

## Edge Cases

- Concurrent increments for the same campaign must not lose counts (race condition)
- Rate limit window resets correctly after 60 seconds
- Campaign name at exactly 64 characters is accepted; at 65 is rejected

---

## Out of Scope

- Load / stress testing (not a unit or integration concern)
- Cross-browser E2E (counter UI is internal tooling only)
