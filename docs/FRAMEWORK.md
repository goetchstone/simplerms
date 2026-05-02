# Framework

The set of practices that make AI-assisted development not be prompt jockeying. **Reusable across any project.** This file is the canonical reference; adapt project-specific bits to taste, leave the disciplines intact.

## Honest disclaimer about enforcement

Documents alone do not prevent rule drift. Strong model defaults can override clearly-written rules. The framework increases compliance significantly when the rules are:

1. **Imperative** — "do X" / "never do Y" — not "we should consider"
2. **Triggered** — "before X, do Y" — so the rule fires at the moment it applies
3. **Shown with anti-patterns** — wrong example next to right example
4. **Surfaced in `/boot`** — loaded fresh at every session start
5. **Backed by tooling** — CI, type-checks, tests, scans
6. **Caught by the human** — final enforcement layer is the user calling out drift

If a rule is being violated repeatedly, it's the rule's fault. Rewrite it harder.

## Operating principle

Success is mutual. Human, AI, and repo are interdependent — none of them succeeds without the other two improving. New things get tried freely; data decides what stays.

## The four pillars (equal weight)

Quality, security, maintainability, and usability all carry the same weight:

- **Quality** — type-checked, tested where it earns its keep, code reviewed against KISS
- **Security** — scanned (Dependabot, CodeQL, Semgrep, gitleaks, npm audit), gated as required checks, secrets never committed, tokens randomized, inputs validated at boundaries
- **Maintainability** — append-only DECISIONS and LESSONS, terse comments and commits, small focused changes, no premature abstraction
- **Usability** — accessible UI patterns, fast pages (Lighthouse ≥ 95), real content (no Lorem Ipsum), honest copy

Trading one for another is the failure mode. Hold all four.

## The three-party learning loop

- **The repo learns.** Decisions, lessons, architecture, and operating rules live in versioned files. They survive sessions and model upgrades.
- **Claude learns.** Each session boots from the repo, so prior decisions and lessons inform every new task.
- **The human learns.** Reading LESSONS.md surfaces patterns — what mistakes recur, where intuition was wrong.

If any one of the three stops learning, the loop breaks.

## Files this framework requires

| File | Purpose | Customize per project? |
|------|---------|------------------------|
| `CLAUDE.md` | Operating rules + project context. Read at session start. | Context per project; rules stay |
| `docs/ARCHITECTURE.md` | Stack, structure, patterns. | Yes |
| `docs/DECISIONS.md` | Append-only architectural decisions. | Starts empty per project |
| `docs/LESSONS.md` | Append-only small lessons from sessions. | Copy as-is, append per project |
| `docs/FRAMEWORK.md` | This file. | Copy as-is |
| `.claude/commands/boot.md` | Session bootstrap checklist. | Light edits — names, paths |
| `.github/workflows/ci.yml` | Lint, type-check, test, build, deploy. | Adapt to stack |
| `.github/workflows/codeql.yml` | SAST: dataflow analysis. | No |
| `.github/workflows/semgrep.yml` | SAST: pattern-based rules. | No |
| `.github/dependabot.yml` | Dependency CVE scanning. | No |

## Disciplines (each one is imperative + triggered + has an anti-pattern)

### Read before write
**Trigger:** about to edit a file, call a function, or use a schema.
**Action:** open the file. Read the relevant section. Then act.
**Anti-pattern:** "I'll just call `caller.crm.listClients({ limit: 200 })` since the type is `number`." (Crashed at runtime — Zod max is 100.)

### Ask when ambiguous
**Trigger:** the user's intent has more than one reasonable interpretation (scope, depth, ordering, trade-offs).
**Action:** ask one specific question. Don't proceed.
**Anti-pattern:** "They probably meant X" — then build X, then have to revert.

### Plan before code on anything that touches more than one file
**Trigger:** the change spans 2+ files, or adds/removes a route, or changes a schema.
**Action:** enter plan mode (`ExitPlanMode` after writing plan). Get approval. Then execute.
**Anti-pattern:** start editing files based on a verbal request, ship the wrong shape, then rewrite.

### Tests are required where they earn their keep
**Trigger:** writing or changing code that touches money, security, data integrity, public API, or non-obvious math.
**Action:** add a test in the same commit that fails when the code is wrong.
**Anti-pattern:** ship a tax calculation change with no test; regression slips into production.
**Skip:** trivial getters, unchanged stable code, UI that's purely presentational.

### Scans must gate, not narrate
**Trigger:** adding a security scanner.
**Action:** turn it into a required-status-check on the main branch via branch protection. Triage existing findings first; fix or document dismissals; then enforce.
**Anti-pattern:** install gitleaks, look at the report, never enforce — keys still get committed.

### Strip the AI voice
**Trigger:** writing comments, commits, docs, or copy.
**Action:** delete every word that doesn't add information for the next reader. No "this function does X." No "we tried A, then B, then chose C." No celebratory tone.
**Anti-pattern (don't write this):**
```
fix: portal middleware UUID/CUID mismatch causing all unauthenticated portal access to redirect

Root cause: proxy.ts validated tokens as UUID format (`8-4-4-4-12` hex) but
`portalToken` uses `@default(cuid())` which produces alphanumeric strings.
Also checked query params but portal uses path segments. Fixed by adding
`/portal` to PUBLIC_PATHS and removing the broken middleware block entirely.
```
**Right pattern:**
```
fix: allow public portal access (CUID, not UUID)

Middleware regex blocked all CUID tokens; tokens are CUIDs, not UUIDs.
```

### Commit small, commit often
**Trigger:** finished one logical change.
**Action:** commit it. Subject ≤50 chars, imperative. Body only when needed, ≤3 short lines.
**Anti-pattern:** one commit titled "various fixes and improvements" containing 14 unrelated changes.

### Document the why, never the what
**Trigger:** writing a comment.
**Action:** if the line would just restate what the code obviously does, delete it. If it explains why a non-obvious choice was made, keep it.
**Anti-pattern:** `// loop over users` above `for (const user of users)`.

### Append, don't rewrite
**Trigger:** updating DECISIONS.md or LESSONS.md.
**Action:** add a new entry. Old entries stay even when superseded.
**Anti-pattern:** edit a 6-month-old DECISIONS entry to reflect the current view — history is now lost.

### Push back is signal, not noise
**Trigger:** the user disagrees with a plan or output.
**Action:** find the narrower change that addresses the actual concern. Don't defend the original. Don't revert wholesale.
**Anti-pattern:** user says "I want to keep the careers page" → delete it entirely OR rebuild the original verbatim. Right move: keep page, strip the parts that prompted the pushback.

### Failures get logged
**Trigger:** reversed a decision, found a bug, fixed a stale doc.
**Action:** add a 2-line entry to `docs/LESSONS.md` with date, what happened, the lesson, where it applies.
**Anti-pattern:** silently fix the bug, never log it; same bug recurs in 3 weeks.

### KISS is the default
**Trigger:** about to add a service, dependency, abstraction layer, configuration option, or build step.
**Action:** ask "what's the simplest thing that could possibly work?" Build that. Add complexity only when a real signal demands it.
**Anti-pattern:** add Husky, lint-staged, and commitlint on a 1-person project because "good engineering teams have these."

## Pre-commit checklist (run mentally before every commit)

- [ ] **Tests:** if this commit touches money/security/data/public-API/math — is there a test that fails when the code is wrong?
- [ ] **Type-check:** `npx tsc --noEmit` passes locally
- [ ] **Tests pass:** `npx vitest run` passes locally
- [ ] **Build:** if this changes Next.js routing, layouts, or server components — `npm run build` succeeds locally
- [ ] **Comment audit:** are any comments restating what the code does? Delete them.
- [ ] **Commit message:** subject ≤50 chars imperative; body only the why, ≤3 lines
- [ ] **Single concern:** one logical change in this commit; if I describe it as "X and Y," split it
- [ ] **Failure logged:** if this commit fixes something — is there a LESSONS.md entry?

## Pre-response checklist (run mentally before every reply to the user)

- [ ] **Ambiguity check:** does the user's request have more than one reasonable reading? If yes, ask one specific question.
- [ ] **Anti-gaslight:** if I'm about to say "great idea" — is it actually a great idea, or am I being agreeable? If actually bad, say so.
- [ ] **AI-voice check:** delete celebratory openers, "I'll now…" prefixes, restating-the-prompt summaries.
- [ ] **Push back check:** the user pushed back on something — am I addressing the actual concern, not defending the original?

## How `/boot` enforces this

`/boot` reads CLAUDE.md, FRAMEWORK.md disciplines, ARCHITECTURE, ROADMAP status, DECISIONS, LESSONS, then runs `tsc + vitest`. It reports current state and any failures before any code is written. If a doc contradicts reality, the doc gets updated immediately.

The pre-commit and pre-response checklists above are explicitly loaded by `/boot` and held in working context for the session.

## Context reset recovery (mid-session)

Context resets happen mid-session. When they do, summaries replace full file contents — and that's when disciplines drift. The framework expects this and has a protocol:

**Whenever you suspect a reset happened (or the user mentions one happened):**
1. Re-run `/boot` from scratch — re-read CLAUDE.md, FRAMEWORK.md, recent LESSONS.md from disk. Do not work from your summary.
2. Verify recent commits with `git log --oneline -10` — your understanding of "current state" may be stale
3. Re-read any feature spec for what you're working on
4. Confirm to the user that you've re-bootstrapped before continuing

**Symptoms that suggest a reset just happened:**
- You can't recall a discipline that you wrote into FRAMEWORK.md earlier in the session
- You're uncertain whether a file was changed
- The user asks why you're doing something differently than before
- The user explicitly says context was reset/compacted

The framework files exist precisely because conversation context isn't durable. The repo IS your durable memory. Use it.

## Starting a new project with this framework

When spinning up a new repo:

1. **Copy these files verbatim:** `docs/FRAMEWORK.md`, `docs/LESSONS.md` (header only — entries are project-specific), `.claude/commands/boot.md`, `.github/workflows/codeql.yml`, `.github/workflows/semgrep.yml`, `.github/dependabot.yml`, `.gitleaks.toml`
2. **Copy and adapt:** `CLAUDE.md` (replace project context section), `docs/ARCHITECTURE.md` (write per-project), `.github/workflows/ci.yml` (adapt to stack — npm/pnpm/yarn, test runner, deploy target)
3. **Start empty:** `docs/DECISIONS.md` with just the header
4. **Wire enforcement immediately:** turn on branch protection requiring CI checks; enable GitHub native secret scanning in Settings → Code security & analysis
5. **Run `/boot` before any code work** — including the first session

Day 1 of any new project starts with the framework already protecting it. No exceptions, no "we'll add it once we ship something."

## How this framework evolves

The framework itself is not frozen. As we learn from sessions, disciplines get added, removed, or rewritten:

- **A new discipline emerges:** if 3+ entries in `docs/LESSONS.md` point at the same root cause, that root cause becomes a discipline here
- **A discipline isn't earning its keep:** if a rule has been on the books for 3+ months and there are zero LESSONS or CI catches enforcing it, remove it (rules that don't fire are noise)
- **A discipline keeps getting violated:** rewrite it harder — more imperative, sharper trigger, better anti-pattern. The rule's the problem, not the model
- **A new pillar of work matters:** add to the four pillars. Today they're quality/security/maintainability/usability — they may grow

When you change this file, log the change in DECISIONS.md (architectural-level) or LESSONS.md (sessions-level), so the change has a paper trail.

## How this prevents prompt jockeying

A prompt jockey produces polished output without domain grounding. They look productive. The output gets accepted because it sounds right.

This framework forces grounding at every step:
- CLAUDE.md = project-specific constraints (Zod schemas, field names, brand rules)
- DECISIONS.md = "why we chose this" — prevents re-litigating settled questions
- LESSONS.md = "we hit this before" — prevents repeating the same mistake
- /boot = "what does the code actually look like right now" — prevents acting on stale assumptions
- Pre-commit / pre-response checklists = "did I follow the rules I wrote?"
- CI = "did we accidentally break something" — catches polished-but-wrong before it ships
- The human = final enforcement layer; pushback is signal

Without these, the same kinds of bugs keep happening. With them, each bug class only happens once.
