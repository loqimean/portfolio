---
title: "Why Your Flipper Actor IDs Don't Work (And How to Fix It)"
excerpt: "A deep dive into how Flipper's feature flag gates work in Ruby on Rails, and why setting actor IDs in the web UI is trickier than it looks."
category: "Ruby on Rails"
pubDate: 2026-04-24
tags: ["ruby-on-rails", "flipper", "feature-flags", "ruby"]
draft: false
---

If you've ever enabled a feature flag in Flipper's web UI by typing in a user ID and wondered why absolutely nothing changed — you're not alone. It's one of those quiet gotchas that wastes an afternoon. This article breaks down how Flipper actually works under the hood, why actor-based flags trip people up, and how to get them working correctly.

## What Is Flipper?

[Flipper](https://www.flippercloud.io/) is the de facto feature flag library for Ruby on Rails. It lets you roll out features incrementally — to everyone, to specific users, to groups, or to a random percentage of traffic — without touching a deployment.

The typical setup looks like this:

```ruby
# Gemfile
gem "flipper"
gem "flipper-active_record"
gem "flipper-ui"
```

```ruby
# config/routes.rb
mount Flipper::UI.app(Flipper) => "/flipper"
```

Once installed, you wrap your code in a check:

```ruby
if Flipper.enabled?(:new_dashboard, current_user)
  render "dashboards/new"
else
  render "dashboards/legacy"
end
```

Simple enough. The complexity hides in *how* Flipper decides whether a feature is enabled for a given user.

## The Five Gates

Flipper evaluates flags through a series of **gates**, checked strictly in this order:

| Priority | Gate | Description |
|---|---|---|
| 1 | **Boolean** | Feature is on for everyone |
| 2 | **Group** | User belongs to a registered group |
| 3 | **Actor** | User matches a specific ID |
| 4 | **% of Actors** | User falls within a percentage slice |
| 5 | **% of Time** | Feature is randomly on X% of the time |

If any gate passes, the feature is considered enabled and Flipper stops checking. The first match wins.

Understanding this order matters. A feature enabled for 10% of actors will still be on for *everyone* if the Boolean gate is also enabled. And a feature enabled for a specific actor won't matter if Boolean is already off — wait, actually it will still pass at gate 3. But Boolean `false` overrides everything — when you explicitly disable a feature, it short-circuits the entire chain.

## Groups: Why They Just Work

When you register a group in Flipper, you give it a name and a block of logic:

```ruby
# config/initializers/flipper.rb
Flipper.register(:admins) do |actor|
  actor.respond_to?(:admin?) && actor.admin?
end

Flipper.register(:beta_testers) do |actor|
  actor.respond_to?(:beta?) && actor.beta?
end
```

When Flipper checks the group gate, it passes your actual `current_user` object into that block. It calls your Ruby code directly. There's no serialization, no string matching — just a plain method call on a live object. As long as `current_user.admin?` returns `true`, the gate opens.

This is why enabling "admins" in the web UI works immediately and reliably. The evaluation happens in your application's runtime, against your actual model.

## Actor IDs: The Gotcha

Actor-based flags are different. When Flipper stores an actor in the database, it doesn't store the object — it stores a **string identifier**. Later, when checking if a feature is enabled, it compares that stored string against the `flipper_id` of the current user.

By default, `flipper_id` is constructed like this:

```ruby
"#{model.class.name};#{model.id}"
```

So for a `User` record with `id: 42`, the flipper ID is:

```
User;42
```

Here's where the web UI trips people up. When you open the Flipper dashboard and type `42` into the actor field, Flipper dutifully stores the string `"42"`. Later, when your app checks `current_user`, Flipper compares `"42"` against `"User;42"`. They don't match. The gate stays closed. The feature stays off. You stare at your screen confused.

### The Fix

In the Flipper web UI, enter the full actor ID:

```
User;42
```

Not `42`. Not `user_42`. The exact string that `flipper_id` returns.

You can always verify this in the Rails console:

```ruby
user = User.find(42)
user.flipper_id
# => "User;42"
```

Copy that string. Paste it into the UI. Done.

## Customizing flipper_id

If `User;42` feels awkward, you can override `flipper_id` directly on your model:

```ruby
class User < ApplicationRecord
  def flipper_id
    "user-#{id}"
  end
end
```

Now the UI expects `user-42`, and it's a bit more readable. Just make sure you're consistent — if you change `flipper_id` after already storing actor IDs in the database, those old entries become orphaned and you'll need to clean them up.

## A Mental Model for the Whole Thing

Think of Flipper's actor gate like a guest list at an event. The doorman has a piece of paper with names on it. When you arrive, he checks your name against the list. If your name is "User;42" but the list has "42", you're not getting in — even if you're obviously the right person.

Groups, by contrast, are more like dress codes. The doorman looks at you directly and makes a judgment call ("Are they wearing a suit?"). No list, no string comparison — just live evaluation.

## Practical Tips

**Use the console to verify IDs before entering them in the UI:**
```ruby
Flipper.feature(:new_dashboard).actors_value
# => #<Set: {"User;42", "User;99"}>
```

**Enable a feature for a specific user programmatically:**
```ruby
user = User.find(42)
Flipper.enable_actor(:new_dashboard, user)
```

**Check if a feature is enabled for a user:**
```ruby
Flipper.enabled?(:new_dashboard, user)
# => true
```

**Disable for a specific actor:**
```ruby
Flipper.disable_actor(:new_dashboard, user)
```

**List all features and their state:**
```ruby
Flipper.features.each do |feature|
  puts "#{feature.name}: #{feature.state}"
end
```

## Summary

Flipper's group gate works against live Ruby objects, which is why it's intuitive and reliable. The actor gate works against stored strings, which is why it requires care. When using the web UI, always enter the full `flipper_id` — for a standard Rails model that's `ClassName;id`, e.g. `User;42`.

Once you internalize this distinction, Flipper becomes a genuinely powerful tool for progressive delivery. The gotcha only bites once.
