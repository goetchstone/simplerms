# CLAUDE.md

## Core Philosophy

KISS. Simplicity and elegance above all else.

Do it right. No shortcuts, no hacks, no "we'll fix it later." Every commit is production-ready and deployable.

## Code Quality

- Every file starts with its path as a comment on line 1
- Comments explain *why*, never *what* — no restating the obvious
- No AI tells — no boilerplate filler, no "this function does X" noise
- Small functions, single responsibility, clear naming
- No dead code, no commented-out code, no TODOs left behind
- Consistent formatting — follow existing patterns exactly

## Engineering Standards

- Never break the build — run tests before committing
- Handle errors explicitly — no silent failures, no swallowed exceptions
- Validate at system boundaries, trust internals
- No premature abstraction — earn complexity through repetition
- Minimal dependencies — every dependency is a liability
- Security by default — no hardcoded secrets, no injection vectors, sanitize inputs
- Idempotent operations where possible
- Logging that tells you what happened, not that something happened
- Name things precisely — if you can't name it clearly, you don't understand it

## Process

- Small, focused commits with clear messages
- Read before you write — understand existing code before changing it
- Delete more code than you add when possible
- If a fix is ugly, the design is wrong — fix the design
- Measure before optimizing — no speculative performance work
