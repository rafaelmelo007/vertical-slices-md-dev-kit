**Task:** Extract the feature list from PRD `§6 Features & Epics` and create a stub folder for each feature.

**Input:** `<prd-path>` — path to the PRD markdown file.

**Steps:**
1. Parse every `F-NN` line in PRD §6. Each line must have: ID, slug, one-sentence intent.
2. Derive folder slug: kebab-case of the feature name (lowercase, spaces → dashes, no special chars).
3. For each feature, create `docs/features/<slug>/` with the following files:

**Files created unconditionally:**
- `SPEC.md` — stub using the canonical template (all sections present, ACs empty, Status field set to `*computed by /vskit:project-status — do not hand-edit*`, Priority from PRD context or `Medium` if unspecified, Applies from PRD feature line if declared else `[]`).
- `TASKS.md` — headers only (ID | Description | Owner | Priority | Status | Linked ACs | Decision).
- `SCORE.md` — all 8 dimensions initialized at 0, composite 0.0, no Score History rows.
- `DECISIONS.md` — header only, empty Decision Log table, empty Deferred Items table.

**Files created conditionally (only if declared in Applies):**
- `DBSCHEMA.md` — if `dbschema` in Applies
- `INTERFACE-CONTRACTS.md` — if `interface-contracts` in Applies
- `prototypes/` folder — if `prototype` in Applies

**If a folder already exists:** skip creation, print `[skip] docs/features/<slug>/ already exists` — do not overwrite.

**Output:** after all folders are created, print a summary list:
```
Created: docs/features/<slug>/  (files: SPEC, TASKS, SCORE, DECISIONS[, DBSCHEMA][, INTERFACE-CONTRACTS])
...
Skipped: docs/features/<slug>/  (already exists)
```

**Writes:** `docs/features/<slug>/` folders with stub files. Does not modify the PRD.
