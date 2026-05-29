**Task:** Generate an HTML prototype from `docs/features/<slug>/SPEC.md` §3 Acceptance Criteria.

**Input:** `<slug>` — feature folder name under `docs/features/`.

**Pre-checks (fail loud if any fail):**
- `prototype` must be in SPEC `Applies:`. If not, print: `[skip] prototype not in Applies for <slug>` and exit 0.
- `Prototype:` field must be `required` or `approved`. If `N/A`, exit 0. If missing, set it to `required` first.

**Owner:** ux-specialist

**Prototype requirements:**
- Output file: `docs/features/<slug>/prototypes/index.html`
- Must cover every AC marked with UX impact (any AC describing user-visible behavior, UI state, or interaction).
- Use Tailwind CSS CDN for styling: `<script src="https://cdn.tailwindcss.com"></script>`
- Each screen must map to 1–3 ACs. Include a comment at the top of each screen section:
  ```html
  <!-- Screen: <name> — covers AC-NN, AC-NN -->
  ```
- Include a nav bar or screen-switcher so all screens are accessible from one file.
- Screens must represent realistic content (not Lorem Ipsum where AC specifies concrete data shapes).
- Mobile-responsive layout (Tailwind `sm:` breakpoints).

**After generation:**
1. Update SPEC.md frontmatter: set `Prototype: generated`.
2. Print: `Prototype written to docs/features/<slug>/prototypes/index.html — covers ACs: [list]`
3. Print: `Set Prototype: generated in SPEC.md frontmatter.`

**If `docs/features/<slug>/prototypes/` does not exist:** create it before writing the file.

**Writes:** `docs/features/<slug>/prototypes/index.html` + SPEC.md frontmatter `Prototype:` field update.
