# Session Bootstrap

You are starting a new session on this project — OR recovering from a mid-session context reset/compaction. Run through this checklist before doing ANY work. Do not skip steps. Do not summarize — actually read the files.

**When to re-run `/boot`:**
- At the start of every fresh session (always)
- After any context compaction or summary (the disciplines and recent lessons must be re-read from disk; summaries don't preserve them with enough fidelity)
- If you feel uncertain about the current state of the codebase or rules
- If the user asks "are you still following the rules?" — re-read and verify

There is no cost to re-running this. The cost of acting on stale disciplines is real.

## Step 1: Read the rules

- Read `CLAUDE.md` fully. These are your operating constraints. Do not deviate.
- Read `docs/FRAMEWORK.md` fully — especially the **Disciplines**, **Pre-commit checklist**, and **Pre-response checklist** sections. Hold them in working context for the entire session. Re-check them before every commit and every reply.
- Read your memory files. Note anything flagged as stale.

## Step 2: Understand current state

- Read `docs/ROADMAP.md` if present — specifically the "Current Status" table and Phase markers.
- Read `docs/DECISIONS.md` — recent entries especially, so you don't re-litigate settled questions.
- Read `docs/LESSONS.md` — every entry. These are mistakes we've already paid for; don't repeat them.
- Run `git log --oneline -10` to see recent work.
- Run `git status --short` to check for uncommitted changes.
- If memory files contradict ROADMAP.md, trust ROADMAP.md and update memory immediately.

## Step 3: Health check

- Run `npx tsc --noEmit` — if types fail, note errors.
- Run `npx vitest run` — if tests fail, note failures.
- Report any issues to the user before proceeding.

## Step 4: Check for stale docs

- Compare `docs/ROADMAP.md` status table against what memory files claim. If stale, update memory.
- Check if any `docs/features/*.md` specs you might touch today have outdated "Current State" sections. Update them as you work, not all at once.

## Step 5: Report

Tell the user, in this exact order:

1. **State of the build** — type-check + tests pass/fail; any uncommitted changes
2. **Recent shipped work** — last 3-5 commits in plain English
3. **Disciplines loaded** — confirm FRAMEWORK.md disciplines are in working context (one line, not a recital)
4. **Next priority from ROADMAP** — what the docs suggest is next
5. **Ask** — what does the user want to work on?

Do NOT start coding until this checklist is complete and the user has given direction.

## During the session — checks that must fire

These are the checks the framework expects to run automatically. If you skip them, the user will catch the drift, and that becomes a LESSONS.md entry.

**Before every reply (the pre-response checklist from FRAMEWORK.md):**
- Ambiguity check — does the user's request have more than one reasonable reading? If yes, ask.
- Anti-gaslight — am I about to agree because it's easy, not because it's right?
- AI-voice check — delete celebratory openers, restating-the-prompt, "I'll now…" prefixes
- Push-back check — if the user just disagreed, am I addressing the actual concern?

**Before every commit (the pre-commit checklist from FRAMEWORK.md):**
- Tests written for money/security/data/public-API/math?
- `tsc --noEmit` passes
- `vitest run` passes
- `npm run build` passes (if Next.js routing/layout/server components changed)
- Comments audited — none restating the obvious
- Commit message ≤50 chars subject, body ≤3 lines if present
- Single concern in the commit
- LESSONS.md entry added if this fixes something worth remembering

## When the framework itself is wrong

If a discipline keeps getting violated, the discipline is wrong — not the model. Open `docs/FRAMEWORK.md` and rewrite the rule harder: more imperative, sharper trigger, better anti-pattern. Log the change in DECISIONS.md.

The framework is not sacred. It's tools to keep us honest. When tools stop working, sharpen them.
