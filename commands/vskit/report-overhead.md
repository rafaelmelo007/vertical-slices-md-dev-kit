**Task:** Aggregate last 7 days of `docs/worklog/*.md`, report token and wallclock usage, and archive old daily files.

**No arguments required.**

**Step 1 — Determine budget:**
Read repo `CLAUDE.md` for line matching `Weekly token budget: <N>`. Default: 100,000.

**Step 2 — Aggregate last 7 days:**
Read `docs/worklog/YYYY-MM-DD.md` for the last 7 calendar days (today inclusive). Sum:
- Total estimated tokens (all `~N` values in Tokens column — strip `~`, sum numerically)
- Total wallclock duration (Duration column values — parse `N min` format)
- Per-command totals (group by Command/Prompt column, sum tokens)

**Step 3 — Print report:**
```
Repo: <name from CLAUDE.md or cwd basename>
Window: YYYY-MM-DD → YYYY-MM-DD (last 7 days)
Tokens: ~<total>k / <budget>k budget   [OK | BREACH]
Wallclock: <H>h <M>m
Top 5 commands by token cost:
  1. /vskit:<cmd> — ~Nk tokens
  2. ...
Status: OK | BREACH (week N of 2 — next breach triggers exit procedure)

Estimates marked ~
```

**Breach threshold:** if total > budget, status = `BREACH`. Track consecutive breaches: read previous week's status from the oldest archived file or prior report. Two consecutive breaches → append mandatory warning:
```
[MANDATORY] Two consecutive weekly breaches. Reduce framework scope or drop framework per §5.3 exit procedure.
```

**Single-command warning:** if any one worklog entry has tokens > 50% of weekly budget, print `**[OVERHEAD WARN]**` for that entry.

**Step 4 — Archive old daily files (side effect):**
For every `docs/worklog/YYYY-MM-DD.md` older than 90 days:
- Append its contents to `docs/worklog/_archive/YYYY-MM.md` under a `## YYYY-MM-DD` separator.
- Delete the daily file.
- Print: `Archived: <filename> → _archive/YYYY-MM.md`

**Writes:** archived daily files moved to `docs/worklog/_archive/YYYY-MM.md`.
