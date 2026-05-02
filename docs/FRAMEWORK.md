# Framework

The set of practices that make AI-assisted development not be prompt jockeying. Reusable across any project. When starting a new repo, copy these files and adapt the project-specific bits.

## Operating principle

Success is mutual. The framework treats human, AI, and repo as interdependent — none of them succeeds without the other two improving. New things get tried freely; data decides what stays.

## The three-party learning loop

This framework only works if all three parties improve over time:

- **The repo learns.** Decisions, lessons, architecture, and operating rules live in versioned files. They survive sessions, model upgrades, and team changes. The repo is the durable memory.
- **Claude learns.** Each session boots from the repo, so prior decisions and lessons inform every new task. No re-litigating settled questions. No repeating the same class of bug.
- **The human learns.** Reading LESSONS.md and DECISIONS.md surfaces patterns that are otherwise invisible — what kinds of mistakes recur, where intuition was wrong, what the system caught that would have shipped.

If any one of the three stops learning, the loop breaks: the repo goes stale, Claude wastes context re-discovering things, the human keeps requesting the same broken patterns.

## Files this framework requires

| File | Purpose | Customize per project? |
|------|---------|------------------------|
| `CLAUDE.md` | Operating rules + project context. Read at session start. | Yes — context section is per-project; rules stay |
| `docs/ARCHITECTURE.md` | Stack, structure, patterns. | Yes — fully per-project |
| `docs/DECISIONS.md` | Append-only architectural decisions with rationale. | Yes — starts empty |
| `docs/LESSONS.md` | Append-only small lessons from sessions. | No — copy as-is, append per-project entries |
| `docs/FRAMEWORK.md` | This file. | No — copy as-is |
| `.claude/commands/boot.md` | Session bootstrap checklist. | Light edits — names, paths |
| `.github/workflows/ci.yml` | Lint, type-check, test, build, deploy. | Yes — adapt to stack |
| `.github/workflows/codeql.yml` | SAST: dataflow analysis. | No |
| `.github/workflows/semgrep.yml` | SAST: pattern-based rules. | No |
| `.github/dependabot.yml` | Dependency CVE scanning. | No |

## Disciplines

**KISS is the default.** Add complexity only when a real signal demands it. Every additional service, scanner, dependency, or layer is a liability the next session has to understand. Boring code beats clever code.

**Tests are required where they earn their keep.** Anything that touches money, security, data integrity, public API surfaces, or non-obvious math gets a test in the same commit as the feature. The bar is "this will fail when the code is wrong" — not "this exercises the code." Tests that always pass, or that mock every dependency until only the test framework runs, are theater. Skip tests on trivial code that's obviously correct (a one-line getter); err on the side of writing the test when in doubt.

**Scans must gate, not narrate.** A scan that produces a report nobody reads is theater. Required-status-checks turn scans into gates. Triage findings once; from then on, the gate either passes or merge is blocked. Same applies to coverage — a regression check on coverage prevents drift without forcing a sprint of low-value tests.

**Measure, then decide.** Once analytics, email engagement, or any other data source is wired up, decisions about what to build next come from the data — not from intuition. Reviewed at the cadence that matches the data velocity (weekly for traffic, monthly for revenue, quarterly for strategy). Successful experiments and failed ones get equal time.

**Read before write.** Open the file before changing it. Open the router before calling its procedure. The cost of one extra read is always less than the cost of guessing wrong.

**Append, don't rewrite.** Decisions and lessons are append-only. Old entries stay even when superseded — the history is the value.

**Document the why, never the what.** Code shows the what. Comments explain why a non-obvious choice was made. If the choice is obvious, no comment.

**Commit small, commit often.** One concern per commit. Subject ≤50 chars, imperative. Body only when needed, ≤3 short lines.

**Plan before code on anything non-trivial.** Use plan mode. Get the plan approved. Then execute. Plans force the design conversation that prevents reversals.

**Push back is signal.** When the user disagrees, find the narrower change that addresses the actual concern. Don't defend the original or revert wholesale.

**Failures get logged.** Every reversed decision, found bug, or stale doc gets an entry in LESSONS.md. The next session reads it. Mistakes don't repeat.

**Strip the AI voice.** No "this function does X." No "we tried A then B then chose C" essays. No celebratory tone. Comments and commits are for a future engineer who wants the answer, not the journey.

## How `/boot` enforces this

Every session starts by running `/boot`. The skill reads CLAUDE.md, ARCHITECTURE, ROADMAP (status table), DECISIONS, LESSONS, and runs `tsc + tests`. It reports current state and any failures before any code is written. If a doc contradicts reality, the doc gets updated immediately — not at the end of the session.

## How this prevents prompt jockeying

A prompt jockey produces polished output without domain grounding. They look productive. The output gets accepted because it sounds right.

This framework forces grounding at every step:
- CLAUDE.md = project-specific constraints (Zod schemas, field names, brand rules)
- DECISIONS.md = "why we chose this" — prevents re-litigating settled questions
- LESSONS.md = "we hit this before" — prevents repeating the same mistake
- /boot = "what does the code actually look like right now" — prevents acting on stale assumptions
- CI = "did we accidentally break something" — catches the polished-but-wrong output before it ships

Without these, the same kinds of bugs keep happening (wrong currency, wrong validation limits, stale doc claims). With them, each bug class only happens once.
