---
title: "Why I Ditched RVM for mise on macOS (and What Finally Broke)"
excerpt: "RVM served me for years, but slow installs, weak macOS binary support, and an OpenSSL@1 dependency colliding with Homebrew pushed me over the edge. Here is what broke, what the issue tracker already told everyone, and why mise is the tool I use now."
category: "Web Development"
tags: ["Ruby", "RVM", "mise", "macOS", "Homebrew", "Developer Tools", "Web Development"]
pubDate: 2026-05-03
draft: false
---

## **The Short Version**

I stayed on RVM longer than I should have. Install friction, missing first-class macOS binaries, and a growing pile of GitHub issues were annoying, but tolerable, until Homebrew stopped shipping `openssl@1` and RVM still treated it as a hard requirement. At that point Ruby stopped installing cleanly, the workarounds multiplied, and I moved to **mise**. Installs are fast, binaries show up when you need them, and one tool covers Ruby plus a lot of other runtimes.

## **What Was Already Painful**

Before the OpenSSL mess, RVM already asked for patience.

Fresh Ruby installs pulled source builds more often than I wanted on a laptop I use for client work. macOS did not get the same smooth binary story I saw friends describe on other version managers. Every new machine meant carving out time for the same ritual: read the docs, chase a dependency, hope the flags match whatever Apple changed last quarter.

None of that was a dealbreaker on its own. Developers learn to budget time for environment setup. The problem is compounding cost. Each papercut is small until they stack into a morning you did not plan to donate to your package manager.

## **The Last Straw: OpenSSL@1 and Homebrew**

Homebrew dropped `openssl@1` from the default story users expect (old formula, security posture, maintenance burden; the details vary by tap and timeline, but the effect is the same). RVM's install path still leaned on that stack in ways that blocked a clean Ruby install on a fresh Mac.

So you end up in the worst loop: you need Ruby to work, RVM refuses to finish without OpenSSL it cannot satisfy through normal Homebrew flows, and the "fix" is a forum thread that forks into three incompatible recipes.

That is not a sustainable foundation for a tool you touch every day.

## **What GitHub Already Showed**

I opened the RVM repo like anyone else would, looking for an official path forward. What you see is a backlog that matches the feeling on the ground.

At the time I looked, **open issues on `rvm/rvm` numbered in the mid hundreds** (roughly five hundred forty and climbing). Some threads are years old. People share local patches, pinned formulae, and one-off shell snippets that work until the next macOS upgrade.

That pattern does not mean the maintainers failed; open source can drown in surface area. It does mean that, as a user, you are signing up to be your own support tier.

## **Why mise Won Me Over**

**mise** (you may know it from its lineage as **rtx**) treats version management like a product problem: predictable installs, good use of prebuilt artifacts where available, and a single interface for Ruby, Node, Python, and plenty else.

On my machines the difference shows up immediately.

- **Speed**: I spend minutes, not lunch breaks, getting a Ruby version in place.
- **Reliability**: Fewer "why does this machine differ from that machine" surprises when OpenSSL and friends move on Homebrew.
- **Scope**: One config layer for the runtimes I already run in real projects, not a separate island per language.

That said, I am not here to pretend every team should migrate tomorrow. If RVM is frozen in CI on an image you control, migration cost is real. For a developer-owned laptop on current macOS, the ease gap has widened.

## **A Practical Takeaway**

If you are stuck on RVM today, you are not wrong for having started there; it was the default story for a long time. If installs are breaking on current Homebrew, you are also not imagining it; the ecosystem moved, and the issue list reflects the strain.

I switched to mise, deleted a category of yak shaving from my calendar, and stopped treating "install Ruby" as a hobby project. If your goal is to write Ruby and ship work, pick a version manager that gets out of the way. For me, on macOS in 2026, that tool is mise.
