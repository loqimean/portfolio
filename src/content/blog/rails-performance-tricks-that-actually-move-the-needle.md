---
title: "Rails Performance Tricks That Actually Move the Needle"
excerpt: "Most Rails apps are not slow because of Ruby itself. They are slow because of repeatable bottlenecks: N+1 queries, over-fetching, missing indexes, and expensive work in the request cycle. Here is the practical playbook I use to make Rails apps feel fast without premature optimization."
category: "Ruby on Rails"
tags: ["Ruby on Rails", "Performance", "ActiveRecord", "PostgreSQL", "Caching", "Scaling"]
pubDate: 2026-02-25
draft: false
---
## **The Real Rails Performance Problem**

When teams say "Rails is slow," what they usually mean is:

- too many database queries per request
- too much data loaded into memory
- work happening at request time that should be cached or async

In other words, the framework is rarely the bottleneck. **The defaults are convenient, but convenience at scale has a cost.**

The good news: a handful of disciplined patterns can produce dramatic wins.

## **1) Kill N+1 Queries Early**

N+1 is still the most common performance leak in Rails codebases.

If you render a list of posts and call `post.author.name` inside a loop, Rails can run one query for posts and then one query per author. That explodes quickly.

Use eager loading intentionally:

```ruby
# Bad: can trigger N+1
posts = Post.published.limit(50)
posts.each { |post| post.author.name }

# Good: preloads associations in bulk
posts = Post.published.includes(:author).limit(50)
posts.each { |post| post.author.name }
```

**Rule of thumb:** if you loop and touch an association, assume you need `includes`, `preload`, or `eager_load`.

## **2) Stop Over-Fetching Columns**

`SELECT *` on wide tables wastes memory and CPU, especially on high-traffic endpoints.

If you only need a subset of fields, fetch only those:

```ruby
# Pulls full ActiveRecord objects
users = User.active.limit(1000)

# Pulls only the needed values
emails = User.active.limit(1000).pluck(:email)
```

Use:

- `pluck` for plain values
- `select` for partial model attributes
- `pick` for one value from one row

Small savings per request become large savings at scale.

## **3) Replace Counting Loops with Counter Caches**

Counting child records repeatedly is expensive:

```ruby
posts.each { |post| post.comments.count }
```

If this appears in feeds, dashboards, or cards, consider `counter_cache`.

```ruby
# migration
add_column :posts, :comments_count, :integer, default: 0, null: false

# model
class Comment < ApplicationRecord
  belongs_to :post, counter_cache: true
end
```

Now reads are O(1): `post.comments_count`.

## **4) Use `exists?` Instead of Loading Records**

A lot of code checks presence by loading objects:

```ruby
# Avoid
if user.orders.where(status: :pending).any?
  # ...
end
```

Prefer existence checks that short-circuit:

```ruby
if user.orders.where(status: :pending).exists?
  # ...
end
```

It is a small change, but it avoids unnecessary object instantiation and can reduce DB load under traffic.

## **5) Add the Right Indexes (Not Just More Indexes)**

Rails performance is database performance.

Start with slow query logs, then add targeted indexes for:

- frequent `WHERE` filters
- join keys
- sort patterns (`ORDER BY`)
- composite conditions used together

For example, if you often query:

```ruby
Order.where(account_id: account.id, status: "paid").order(created_at: :desc)
```

an index like `[:account_id, :status, :created_at]` can significantly reduce response time.

Indexes are one of the highest ROI optimizations in any Rails app.

## **6) Process Large Datasets in Batches**

Loading 500k rows into memory is a common background job anti-pattern.

Use batched iteration:

```ruby
User.where(marketing_opt_in: true).find_each(batch_size: 1000) do |user|
  NewsletterSyncJob.perform_later(user.id)
end
```

`find_each` keeps memory stable and reduces GC pressure, which improves job throughput.

## **7) Cache What Is Expensive and Reused**

If a view fragment is expensive and changes rarely, cache it.

```erb
<% cache ["pricing-card", plan, I18n.locale] do %>
  <%= render "pricing/card", plan: plan %>
<% end %>
```

For Rails apps with repeat traffic, fragment caching often gives bigger wins than micro-optimizing Ruby code.

The key is invalidation strategy:

- include versioned keys
- tie keys to `updated_at` when possible
- avoid keys that never expire

## **8) Move Non-Critical Work Off the Request Path**

Request/response should do the minimum needed to serve the user.

Move email, analytics enrichment, heavy API syncing, and report generation to background jobs.

Pattern:

- controller saves core data fast
- enqueue async job
- return response quickly

Lower latency and fewer timeouts, especially under spikes.

## **A Practical Optimization Workflow**

If you want performance work that sticks, use this weekly loop:

### **1) Measure First**

Use tools like:

- rack-mini-profiler (local + staging)
- Bullet (N+1 detection)
- APM (Skylight, New Relic, Datadog, AppSignal)
- PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` for heavy queries

### **2) Prioritize by Endpoint Impact**

Focus on:

- high-traffic endpoints
- conversion-critical paths
- background jobs consuming the most runtime

### **3) Ship Small, Verifiable Wins**

Avoid giant "performance refactor" PRs.

Ship focused changes with before/after metrics:

- p95 response time
- query count per request
- DB time vs app time
- memory usage for long jobs

## **Common Mistakes to Avoid**

### **Mistake #1: Optimizing Cold Paths**

A 40% win on an endpoint nobody hits is still near-zero business impact.

### **Mistake #2: Ignoring the Database Plan**

If you are not inspecting query plans, you are guessing.

### **Mistake #3: Caching Without Invalidation Rules**

Bad caching can create stale data bugs that are worse than slow pages.

### **Mistake #4: Doing Everything in One Pass**

Performance improves fastest when you run small experiments and keep the wins.

## **Conclusion**

Rails can scale very well when you optimize the real bottlenecks:

- query count
- query shape
- memory footprint
- request-path responsibilities

If you want one practical next step, profile one high-traffic endpoint this week and fix only the top bottleneck. Repeat that process for a month and your app will feel noticeably faster without a risky rewrite.
