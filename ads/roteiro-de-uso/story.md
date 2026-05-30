# vertical-slices-md-dev-kit

Roteiro de uso completo — do zero ao primeiro feature com ship gate aprovado.

**Fluxo:**
1. `npx @rafaelmelo007/vskit init`
2. `/vskit:critique prd` — gaps e hidden assumptions
3. `/vskit:enhance prd` — round-table até score ≥ 9
4. `/vskit:prd-to-features` — stubs por feature
5. `/vskit:critique spec` — decisões propagadas
6. `/vskit:spec-to-tasks` — ACs → tasks
7. `/vskit:implement` — código + commits rastreáveis
8. `/vskit:score` — 8 dimensões, ship gate
