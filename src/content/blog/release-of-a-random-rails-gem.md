---
title: "The most efficient RANDOM query in Rails!"
excerpt: "Discover the most efficient way to fetch random records in Rails — from ActiveRecord to SQL. Using built-in database features together with my gem, RandomRails."
category: "Ruby on Rails"
tags: ["Ruby on Rails", "Backend", "SQL", "Performance"]
pubDate: 2023-07-15
readTime: "5 min"
draft: false
---
## RandomRails: fast random records for ActiveRecord

Picking random rows sounds simple, but the usual approach (`ORDER BY RANDOM()` / `ORDER BY RAND()`) gets painfully slow as tables grow because the database has to assign a random value to every row and sort the full result set. 😅

**RandomRails** is a gem that provides a `Model.random` API and automatically selects an efficient strategy based on your database and table size (supports PostgreSQL, MySQL, and SQLite).

## How it stays fast

- **PostgreSQL**: uses `TABLESAMPLE BERNOULLI` for large tables (10k+ by default), and falls back to offset-based sampling for smaller ones
- **MySQL / SQLite**: efficient offset-based sampling, with graceful fallbacks when needed
- **Auto selection**: avoids full-table sorting whenever possible
- **Configurable**: thresholds, precision, and table-size caching via an initializer

## Benchmarks (10 runs each)

In real-world tests on a users table, `User.random` beat `ORDER BY RANDOM()` by **~2× to ~32×**, and the advantage grows with table size (e.g. ~3.84s → ~0.22s at 1k rows, and ~171.5s → ~5.34s at 1M rows).

## Install + usage

```ruby
# Gemfile
gem "random-rails"
```

```ruby
User.random
User.random(count: 5)
User.where(active: true).random(count: 3)
```

[https://github.com/the-rubies-way/random-rails](https://github.com/the-rubies-way/random-rails)
