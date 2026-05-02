# Security Policy

## Reporting a vulnerability

Email: **security@akritos.com**

Please do not open public GitHub issues for security-relevant findings. Email is preferred. Encrypted email is welcome but not required.

## What to include

- Description of the issue and its impact
- Steps to reproduce (URLs, payloads, request/response if applicable)
- Affected version or commit SHA
- Your name or handle, if you'd like to be credited

## Response SLA

- **Acknowledgment:** within 72 hours
- **Status update or fix:** within 14 days for confirmed vulnerabilities
- **Disclosure coordination:** we'll work with you on timing if you plan to publish

## Scope

**In scope:**
- Production akritos.com domain and any subdomain
- Authentication, authorization, and session handling
- Data exposure (PII, tokens, customer data)
- Injection vulnerabilities (SQL, command, template, prototype pollution)
- Server-side request forgery
- Race conditions in payment or invoice flows
- Anything that lets an attacker read or modify data they shouldn't

**Out of scope:**
- Localhost development environments
- Theoretical attacks not exploitable in production
- Findings against archived branches
- DoS via volumetric flooding (use the standard provider abuse channels)
- Self-XSS or social engineering

## Recognition

We thank reporters publicly in security advisories unless asked otherwise. We do not currently run a paid bug bounty.

## What we expect

- Don't access, modify, or destroy data that isn't yours
- Don't pivot from one finding to map the rest of the system
- Don't disrupt service for other users
- Give us reasonable time to fix before public disclosure (90 days standard)

We'll act in good faith if you do.
