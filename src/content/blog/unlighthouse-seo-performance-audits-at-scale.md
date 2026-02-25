---
title: "Unlighthouse: Lighthouse Audits at Scale for SEO, Core Web Vitals, and Conversions"
excerpt: "One slow template, one oversized script, one forgotten redirect—and suddenly your Core Web Vitals slip across hundreds of URLs. Unlighthouse is the fastest way I’ve found to run Lighthouse across an entire site, prioritize fixes by business impact, and turn performance work into an SEO growth lever instead of a never-ending backlog."
category: "SEO & Performance"
tags: ["SEO", "Web Performance", "Core Web Vitals", "Lighthouse", "JavaScript", "Tooling"]
pubDate: 2026-02-22
draft: false
---
## **The Real Performance Problem (It’s Not One Page)**

Most teams treat Lighthouse as a *page-level* tool:

- Run it on the homepage.
- Maybe the pricing page.
- Celebrate a green score.

Then the rankings don’t move, conversions stay flat, and Search Console still reports “INP needs improvement” or “LCP issue: longer than 2.5s”.

Because modern SEO performance problems almost never live on one URL. They live in:

- **Templates** (the same render cost multiplied across hundreds of pages)
- **Shared JS/CSS bundles** (one “small” change affecting everything)
- **CMS-driven pages** (unbounded content, unbounded layout shift)
- **Third-party scripts** (the silent tax on every visit)

If you only audit a handful of pages, you’ll miss the real story: **how your site behaves at scale**.

## **What Unlighthouse Is (In One Sentence)**

[Unlighthouse](https://github.com/harlan-zw/unlighthouse) scans your website using Google Lighthouse and gives you a modern UI + reports so you can **audit many URLs quickly with minimal setup**.

In marketing terms: it turns performance from “a quarterly initiative” into “a weekly feedback loop”.

## **Why It Matters for SEO (Beyond “Scores”)**

As an SEO specialist, I care about Lighthouse because it’s a practical proxy for user experience signals that *do* affect outcomes:

- **Core Web Vitals**: better LCP/INP/CLS reduces drop-offs and increases engagement.
- **SERP competitiveness**: if you’re competing with equally relevant pages, UX often becomes the tie-breaker.
- **Crawl efficiency**: bloated pages and slow responses can reduce how effectively bots discover and refresh content (especially on large sites).
- **Conversion rate**: performance is not a vanity metric—faster pages convert more reliably, especially on mobile.

Unlighthouse is valuable because it helps you answer the questions that leadership actually cares about:

- “Which *types* of pages are slow?”
- “Is this a site-wide regression or a localized issue?”
- “What fixes will move the most revenue (or sign-ups) first?”

## **The 80/20 Promise: Find Patterns, Not Just Bugs**

Performance work becomes scalable when you can spot patterns:

- A single layout component causing CLS across a whole section.
- One marketing script inflating total blocking time site-wide.
- A hero image strategy that’s fine on desktop but brutal on mobile.

Unlighthouse helps you see those patterns faster than manually running Lighthouse in DevTools page-by-page.

## **Quick Start (The Fastest Way to Run It)**

From the Unlighthouse README, the simplest setup is a one-liner:

```bash
npx unlighthouse --site <your-site>
# or PNPM
pnpm dlx unlighthouse --site <your-site>
```

**Requirements:** Node \(>= 20.x\).

If you’re doing this inside a repo, also add the output folder to `.gitignore` (again, straight from the README):

```gitignore
.unlighthouse
```

## **A Practical SEO Workflow That Actually Sticks**

Here’s the process I recommend when you want performance to drive SEO outcomes, not just produce reports.

### **1) Audit by Page Type**

Before you even run the scan, define your “money” page types:

- **Landing pages** (paid + SEO)
- **Pricing / plan pages**
- **Product / category pages**
- **Blog posts**
- **Docs** (if they feed sign-ups)

You’re not just hunting for a slow URL—you’re looking for **a slow template**.

### **2) Prioritize Using Impact, Not Ego**

When you find issues, map them to business impact:

- A 500ms LCP win on a high-traffic landing page can beat a perfect score on a low-traffic blog post.
- Fixing a shared component across 3,000 URLs can beat a perfect fix on one “important” page.

Your goal is a weekly wins pipeline:

- **1–2 high-impact fixes per sprint**
- Measured against: CWV distribution, conversion funnel, and top landing pages

### **3) Turn Findings Into “SEO-Safe” Tickets**

Performance tickets fail when they’re vague. A good ticket includes:

- **Affected page type(s)** (e.g., “/blog/*”, “/products/*”)
- **Metric + target** (e.g., “LCP from 3.4s → < 2.5s on mobile”)
- **Likely root cause** (e.g., “hero image not preloaded; oversized; late CSS”)
- **Acceptance criteria** (e.g., “no CLS regression; keep marketing tags intact”)

That’s how you keep performance work from getting deprioritized.

## **Common Mistakes (And How to Avoid Them)**

### **Mistake #1: Treating Lighthouse Score as the KPI**

Lighthouse scores are useful, but the KPI should be **outcomes**:

- Organic traffic quality
- Engagement and conversion rate
- CWV pass rate improvements in real user data

Use scores to guide engineering work—not to “prove SEO did a thing”.

### **Mistake #2: Auditing Only Desktop**

SEO traffic is often mobile-heavy. Audit mobile behavior and prioritize mobile fixes first when resources are limited.

### **Mistake #3: Blaming Developers for Third-Party Scripts**

The worst performance offenders often come from marketing tags. The fix isn’t blame—it’s governance:

- audit what scripts load on which page types
- limit tags to the pages that truly need them
- prefer async/defer where possible
- remove duplicates and old experiments

Unlighthouse gives you evidence to have that conversation with clarity.

## **Debugging Tip: Turn On Debug Mode**

If you run into issues, the Unlighthouse README recommends re-running with debug enabled:

```bash
# NPM
npx unlighthouse --site unlighthouse.dev --debug
# or PNPM
pnpm dlx unlighthouse --site unlighthouse.dev --debug
```

## **Conclusion**

If you’re serious about SEO in 2026, performance can’t be a one-off audit. It has to be a repeatable system.

Unlighthouse is the tool I’d pick when the challenge isn’t “run Lighthouse once,” but **understand performance across an entire site, spot the patterns, and prioritize fixes that move revenue**.

If you want a single next step: run one scan, group findings by page type, and ship one fix that improves the experience across hundreds of URLs. That’s how performance becomes marketing.

If you need a master SEO check for your site, [contact me here](/#contact-section) and I can help you prioritize the highest-impact fixes first.
