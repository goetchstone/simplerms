# Session Bootstrap

You are starting a new session on the SimpleRMS / Akritos project. Run through this checklist before doing ANY work. Do not skip steps. Do not summarize — actually read the files.

## Step 1: Read the rules
- Read `CLAUDE.md` fully. These are your operating constraints. Do not deviate.
- Read your memory files. Note anything flagged as stale.

## Step 2: Understand current state
- Read `docs/ROADMAP.md` — specifically the "Current Status" table and Phase markers (✅ vs ⬜).
- Run `git log --oneline -10` to see recent work.
- Run `git status --short` to check for uncommitted changes.
- If memory files contradict ROADMAP.md, trust ROADMAP.md and update the memory file immediately.

## Step 3: Health check
- Run `npx tsc --noEmit` — if types fail, note the errors.
- Run `npx vitest run` — if tests fail, note the failures.
- Report any issues to the user before proceeding.

## Step 4: Check for stale docs
- Compare `docs/ROADMAP.md` status table against what the memory files claim. If stale, update memory.
- Check if any `docs/features/*.md` specs you might touch today have outdated "Current State" sections. If so, update them as you work (not all at once).

## Step 5: Report
Tell the user:
1. What's currently working (brief, from ROADMAP status table)
2. What's in progress or uncommitted (from git status)
3. Any health issues (type errors, test failures)
4. What the next priority appears to be (from ROADMAP phases)
5. Ask what they want to work on

Do NOT start coding until you've completed this checklist and the user has given direction.
