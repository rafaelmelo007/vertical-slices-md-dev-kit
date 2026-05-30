# Manifest — Click Counter

Complete inventory of every file owned by this feature slice.

---

## Backend

### Endpoints
| Method | Path | File |
|--------|------|------|
| POST | `/api/counter/increment` | `server/features/counter/endpoints/increment.ts` |
| GET | `/api/counter` | `server/features/counter/endpoints/get.ts` |

### Feature files
| Type | File |
|------|------|
| Domain / Entity | `server/features/counter/domain/Counter.ts` |
| Service | `server/features/counter/services/CounterService.ts` |
| Repository | `server/features/counter/repositories/CounterRepository.ts` |
| DTO | `server/features/counter/dtos/CounterDto.ts` |
| Registration / DI setup | `server/features/counter/counterModule.ts` |

### Tests
| Type | File |
|------|------|
| Integration | `server/tests/counter/` |

---

## Database

| Object | Name | Migration file |
|--------|------|----------------|
| Table | `counters` | `migrations/001_create_counters.sql` |
| Index | `ix_counters_user_id` | `migrations/001_create_counters.sql` |

---

## Frontend

### Pages & components
| Type | File |
|------|------|
| Page | `client/src/pages/CounterPage.tsx` |
| Component | `client/src/components/CounterDisplay.tsx` |
| Component | `client/src/components/IncrementButton.tsx` |
| Service | `client/src/services/counterService.ts` |
| Route registration | `client/src/router.tsx` |

### Tests
| Type | File |
|------|------|
| Unit | `client/src/components/__tests__/CounterDisplay.test.tsx` |
| Unit | `client/src/services/__tests__/counterService.test.ts` |

---

## Configuration & Infrastructure
| Type | Detail |
|------|--------|
| Environment variables | None introduced |
| External services | None |
