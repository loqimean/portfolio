---
title: 'Solving the "Red Spec" Mystery: Debugging Elasticsearch in Rails'
excerpt: "Ever had a test fail despite the data looking perfect? When dealing with Elasticsearch and RSpec, the standard debugging flow often isn't enough. In this post, I walk through how I mirrored my test environment in a manual browser session to uncover a subtle bug involving `ActionController::Parameters` and indifferent access."
category: "Ruby on Rails"
tags: ["Ruby", "Testing", "Debugging", "Elasticsearch"]
pubDate: 2024-06-24
readTime: "13 min"
draft: false
---

## **The Problem**

The story began with a failing spec that, by all accounts, should have been green. The input data and expected output matched perfectly, yet the test remained red. When you're working with Elasticsearch, you have massive datasets and multiple entry points to check, making standard "print debugging" a slow and painful process.

## **The Investigation**

Since the feature worked perfectly in my development environment, I needed to see exactly what the test environment was "seeing" during the RSpec run. To do this, I temporarily bridged the gap between my manual browser environment and my test configuration.

## **The Solution: A 4-Step Debugging Hack**

To investigate the test state manually, follow these steps:

1. **Disable Transactions:** In `spec/rails_helper.rb`, temporarily prevent RSpec from rolling back changes so the data persists for you to see.
```ruby
RSpec.configure do |config|
  config.use_transactional_fixtures = false
end

```


2. **Point to the Test DB:** Update `config/database.yml` to use your test database for the development server.
```yaml
development:
  <<: *default
  database: app_test

```


3. **Sync Elasticsearch Indexes:** Ensure your search engine is looking at the test indexes. In my case, I updated `config/initializers/chewy.rb`:
```ruby
Chewy.settings = { prefix: ["test", ENV['TEST_ENV_NUMBER']].compact.join('_') }

```


4. **Manual Verification:** Restart your server and navigate to the failing page.

## **The "Aha!" Moment**

By testing the "test environment" manually, I caught the culprit. I was filtering records for the city "Rivne" and expected one category, but saw two.

The issue was a Hash using **Symbols** in the test data, while the production code relied on `ActionController::Parameters`. In Rails, controllers provide **Indifferent Access** (allowing you to fetch `:key` or `"key"` interchangeably). However, my test hash was strict.

**The Fix:**
I simply ensured the test data utilized indifferent access to match the real-world behavior of the controller:

```ruby
{ some: "key" }.with_indifferent_access

```

## **Conclusion**

Sometimes the best way to debug a complex automated test is to make it "manual" for a moment. It saved me hours of guessing. I hope this workflow helps you squash your next persistent bug!
