---
title: "Production-only Rails crash: sentry-rails version mismatch after upgrade"
excerpt: "Production threw a cryptic error. Logs were quiet. I blamed custom error pages and routing first. The real bug was an old gem that no longer matched the framework."
category: "Ruby on Rails"
tags: ["Ruby on Rails", "Sentry", "Debugging", "Production", "Upgrades"]
pubDate: 2026-03-27
draft: false
---

## What showed up

In production, requests started failing with:

```ruby
Missing method show_exceptions? on a request object
```

Nothing like that appeared in development. Standard logs did not point at a clear line in your app. The failure showed up under real production traffic, not when you clicked around locally.

## Why production-only errors hide in plain sight

Rails runs the same code paths in theory, but a few things differ between environments:

- **Bundler groups.** Gems listed only under `group :production` (or loaded only in staging) never run on your laptop during casual development. If the bug lives inside one of those gems, you reproduce it only where that group is installed.
- **Configuration.** Sentry, error reporters, and custom `exceptions_app` wiring often activate fully in production. Middleware order and exception wrapping can look different from `development`.
- **Traffic shape.** Bots hit unknown URLs; users trigger edge cases. A routing or error-handling bug can sit invisible until the right request hits the server.

So "it works on my machine" is not proof the stack matches production. When you chase a bug that appears in **one** environment, treat that environment's **installed gems** as a first-class suspect, not an afterthought.

## The wrong story I told myself

The app used a small errors controller and explicit routes, roughly like this:

```ruby
# config/routes.rb
match "/404", to: "errors#not_found", via: :all
match "/500", to: "errors#server_errors", via: :all
# ... other error paths as needed
```

```ruby
# app/controllers/errors_controller.rb
class ErrorsController < ApplicationController
  def not_found
    render status: :not_found
  end

  def server_errors
    render status: :internal_server_error
  end

  def not_acceptable
    render status: :not_acceptable
  end
end
```

When something breaks near error pages, it is tempting to ask whether `ActionController::RoutingError` is rendered as a 500 instead of a 404, or whether the exception app is swallowing the real error. Error code sits at the edge of the stack; you change it rarely, so it feels like a natural place to look.

That story was plausible. It was also wrong for this incident.

## Where the bug lived

I set a breakpoint in the errors controller (in `server_errors`) and pulled the original exception from the Rack env:

```ruby
ex = request.env["action_dispatch.original_exception"] ||
      request.env["action_dispatch.exception"]

ex.class.name
ex.message
ex.backtrace.take(15)
```

`ex.message` matched the cryptic `show_exceptions?` error. The backtrace did not stop in `ErrorsController` or `routes.rb`; the first non-app frames went through `sentry-rails`.

That is the signal: when the backtrace names a gem, compare **that gem's version** to what your framework and Rack stack expect. The framework had moved forward; `sentry-rails` had not. Older releases assumed a request object API that no longer matched what Rails passed through, which surfaces as a missing method on the request in production.

Updating `sentry-rails` to a release compatible with the current Rails version removed the error.

## Compatibility check that confirms the root cause fast

When a backtrace enters integration gem code, check the gem release notes and changelog against the Rails version you run in production.

You can confirm loaded versions in one command:

```bash
bundle exec ruby -e "puts \"rails=#{Gem.loaded_specs['rails']&.version} sentry-rails=#{Gem.loaded_specs['sentry-rails']&.version}\""
```

Then inspect gem metadata quickly:

```bash
bundle info sentry-rails
```

This gives you a concrete pair of versions to validate before changing routing, controllers, or middleware.

## Check gems for the environment you are debugging

If you only reproduce the issue in production (or only in staging), do not assume your local `Gemfile.lock` tells the whole story until you have checked the **same** Bundler context.

**On the machine or container that runs the failing env**, confirm what is loaded:

```bash
bundle exec ruby -e "puts Gem.loaded_specs['sentry-rails']&.version"
```

Or inspect the lockfile line you deploy from:

```bash
grep -A1 'sentry-rails' Gemfile.lock
```

If production uses a different deploy branch, image, or lockfile than your laptop, compare those explicitly. A staging box that skipped `bundle update` after a Rails bump is exactly where an old `sentry-rails` can linger while development already picked up a newer transitive version.

**In a production Rails console** (when your policy allows it), you can confirm versions without guessing:

```ruby
Gem.loaded_specs["sentry-rails"]&.version
Gem.loaded_specs["rails"]&.version
```

Rule of thumb: when debugging a single environment, spend a few minutes proving which **gem versions** that environment runs. Integration gems (Sentry, APM tools, auth middleware, anything that patches Rack or Action Dispatch) are frequent sources of "works locally, breaks in prod" after upgrades.

## Pulling it together

Not every weird production-only error starts in your own controllers. After you upgrade Rails or Ruby, dependencies that hook deep into the request cycle can drift until they break in one environment.

When logs stay vague:

- Read the original exception from `request.env` inside your error handler or a breakpoint, not only the rendered body or outer log line.
- Read `ex.backtrace`, and note the first frames that belong to gems versus your app.
- For the failing environment, verify installed gem versions match what you think you shipped.
- Compare your deployed lockfile to local before changing error pages or routes.

Do that before you rewrite error pages or routes you already understand. Often the fix is a version bump, not a redesign of how you render `/404`.