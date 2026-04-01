# Akritos Brand Guide

## Who We Are

Akritos partners with small businesses to build technology they own, protect them from decisions they'll regret, and tell them the truth even when it's hard to hear.

We are not an MSP. We are a managed services partner. Your success is our success. We act as your virtual CTO — we get you set up, owning your own infrastructure, making your own decisions. We do not profit from your confusion or your dependency. We leave you stronger and more independent than we found you.

We are against vendor lock-in, hardware-as-a-service traps, nickel-and-diming, and anyone who profits from keeping you dependent. We compete on ethics.

---

## Name

**Akritos** — from Ancient Greek *akritos*, meaning confused, undecided, indiscriminate. That's what our clients are before they find us. Locked in, overwhelmed, dependent on vendors who profit from their confusion. We show up and the akritos ends.

The name isn't what we are. It's what we fix.

Pronunciation: **ah-KREE-tos**

Always written: **Akritos** — capital A, lowercase the rest. Never ALL CAPS. Never akritos.

---

## Mission Statement

*Akritos partners with small businesses to build technology they own, protect them from decisions they'll regret, and tell them the truth even when it's hard to hear.*

---

## Values

**You own your technology.** No lock-in. Ever. We set you up to own your infrastructure outright. If we disappeared tomorrow, you'd still have everything.

**We tell you the truth.** Even when it's uncomfortable. If you're about to make a bad decision — using Spotify in a retail establishment, choosing a vendor who will trap you — we will tell you. We won't soften it.

**Your success is ours.** We don't bill for problems we created. We don't upsell you things you don't need. If you're not winning, we're not winning.

**We protect you.** Compliance, legal exposure, operational risk — we see it before you do. We flag it. We help you fix it.

**We don't compromise.** There is one right answer. There are many ways to compromise. When you compromise, you give something up. We won't let you do that without knowing exactly what you're giving up.

---

## Voice & Tone

**Direct.** We give you the answer. Not "there are several approaches we could consider." Just the answer.

**No bullshit.** We don't pad sentences. We don't use jargon to sound smart. We say what we mean.

**Honest.** If we don't know, we say so. If you're wrong, we say so — respectfully, but clearly.

**Human.** We're not a corporation. We're a person who knows technology and gives a damn about your business.

**Confident without arrogance.** We know what we're talking about. We don't need to prove it.

### Voice Examples

| Don't say | Say instead |
|-----------|-------------|
| "We leverage best-in-class solutions to optimize your technology stack." | "We fix your technology and make sure you own it." |
| "We provide comprehensive managed services across multiple verticals." | "We handle your IT so you can run your business." |
| "There are several options to consider here." | "Here's what you should do." |
| "We partner with leading vendors to deliver value." | "We don't work with vendors who lock you in." |

---

## Logo

### The Mark

An A constructed from a plumb line — the oldest tool for finding the one true vertical. The dot at the apex is the single right answer. The crossbar is the level check. Geometric. Honest. Unambiguous.

### Usage

- Dark background: Mark in `#C8A96E` (Conviction gold), wordmark in `#E8E4DC` (Bone)
- Light background: Mark in `#1C1F2E` (Midnight), wordmark in `#1C1F2E` (Midnight)
- Minimum size: 120px wide for full lockup, 32px for mark only
- Clear space: equal to the height of the capital A on all sides
- Never stretch, rotate, recolor, or add effects to the mark

### Wordmark

**AKRITOS** — set in letter-spacing: 6px, font-weight: 500
**TECHNOLOGY PARTNERS** — set in letter-spacing: 3px, font-weight: 400, 13px, color: Conviction gold

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Midnight | `#1C1F2E` | Primary background, authority surfaces |
| Conviction | `#C8A96E` | Accent, CTA, mark color on dark |
| Bone | `#E8E4DC` | Primary text on dark backgrounds |
| Slate | `#4A5068` | Secondary surfaces, muted backgrounds |
| Parchment | `#F5F4F0` | Light mode background |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Alert | `#E24B4A` | Warnings, compliance issues, danger |
| Clear | `#1D9E75` | Confirmed, compliant, resolved |
| Caution | `#EF9F27` | Needs attention, review required |

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: '#1C1F2E',
        conviction: '#C8A96E',
        bone: '#E8E4DC',
        slate: '#4A5068',
        parchment: '#F5F4F0',
        alert: '#E24B4A',
        clear: '#1D9E75',
        caution: '#EF9F27',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      letterSpacing: {
        widest: '0.3em',
        wider: '0.2em',
      },
    },
  },
}
```

---

## Typography

### Typefaces

**Geist** — primary sans-serif. Clean, geometric, built for interfaces. Developed by Vercel, optimized for Next.js. Available via `next/font`.

**Geist Mono** — for code, technical strings, IP addresses, config values.

```js
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

### Type Scale

| Role | Size | Weight | Tracking |
|------|------|--------|----------|
| Display | 56px | 500 | 0.02em |
| H1 | 40px | 500 | 0.01em |
| H2 | 28px | 500 | 0 |
| H3 | 20px | 500 | 0 |
| Body | 16px | 400 | 0 |
| Small | 14px | 400 | 0 |
| Label | 11px | 500 | 0.15em uppercase |
| Code | 14px | 400 | 0 (mono) |

---

## Spacing & Layout

- Base unit: 4px
- Component padding: 16px, 24px, 32px
- Section padding: 64px, 96px, 128px
- Max content width: 1200px
- Narrow content width: 720px (prose, mission copy)
- Grid: 12 columns, 24px gutters

---

## Component Principles

**No rounded corners on authority surfaces.** Cards and containers that carry important decisions use `border-radius: 4px` maximum. We don't soften hard truths with pill shapes.

**Borders over shadows.** `0.5px solid` borders, not box shadows. Honest edges.

**Dark first.** Primary surfaces are dark. Light surfaces are for content-heavy areas like documentation and client portals.

**Gold sparingly.** Conviction gold is for the most important element on a given screen — a CTA, a key stat, a warning. Not decoration.

---

## What We Are Not

- Not an MSP (managed service provider)
- Not a body shop
- Not a vendor reseller who profits from lock-in
- Not a company that creates problems to solve them
- Not a company that writes proposals designed to confuse you

We are a managed services **partner**. The distinction matters.

---

## Competitive Positioning

We compete against the VAR/MSP model — companies that profit from your dependency on hardware-as-a-service, vendor lock-in, and recurring managed service fees tied to complexity they created.

Our differentiator: we leave every client more capable and more independent than we found them. We make money when you succeed, not when you're confused.

---

*Last updated: April 2026*
*Version: 1.0*
