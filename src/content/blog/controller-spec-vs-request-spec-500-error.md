---
title: "How a Controller Spec Missed a 500 Error That a Request Spec Caught"
excerpt: "A subtle but painful bug: a route gets removed (or commented out), a URL helper in the sitemap view breaks, the app starts returning 500 in production — and the test suite stays green. Here is how that happens and how to prevent it."
category: "Ruby on Rails"
tags: ["Ruby on Rails", "Testing", "Error Handling", "500 Errors"]
pubDate: 2026-03-24
draft: false
---
## Introduction

Production is returning 500 on the sitemap. The test suite is green. The bug has been there for days. This is the story of why controller specs give false confidence, and how one request spec would have caught it immediately.

## The Setup

The sitemap is built in `app/views/sitemap/index.builder`. It generates an XML document with `<loc>` entries for every public URL on the site:

```ruby
xml.url do
  xml.loc support_url
  xml.lastmod Time.zone.now.strftime("%Y-%m-%dT%H:%M:%S%:z")
  xml.changefreq "monthly"
  xml.priority "0.3"
end
```

At some point `support_url` stopped being a valid route. In `config/routes.rb` the route was commented out:

```ruby
# get '/support', to: 'home#support'
```

Rails URL helpers are generated from `routes.rb` at boot time. With the route gone, `support_url` is no longer defined. Calling it raises a `NoMethodError`, the view fails to render, and the sitemap endpoint returns 500.

## Why the Controller Spec Stayed Green

The existing spec lived in `spec/controllers/` and looked like this:

```ruby
RSpec.describe SitemapController do
  describe "GET #index" do
    context "with :xml format" do
      it "returns http success" do
        get :index, format: :xml

        expect(response).to have_http_status(:success)
        expect(response.headers["Content-Type"]).to eq("application/xml; charset=utf-8")
      end

      it "does not render the application layout" do
        expect(get(:index, format: :xml)).not_to render_template(layout: "application")
      end
    end
  end
end
```

Both examples passed. The reason: **Rails controller specs do not go through the full routing stack.**

When you call `get :index` in a controller spec, RSpec dispatches the action directly to the controller, bypassing the router and Rack middleware entirely. The controller action itself is thin — it sets response headers and delegates rendering to the builder template. The view does render, and `support_url` does raise a `NoMethodError` — but the spec still passes.

Here is why: the HTTP status code and `Content-Type` header are written to the response object *before* rendering begins. By the time the builder blows up, those values are already committed. The spec only asserted on those two things. The rendering exception was raised, but nothing in the spec was checking for it, so RSpec reported green.

Controller specs test the controller layer in isolation. They are not designed to exercise the full request-response cycle, and they give you no guarantee that views render cleanly.

## How a Request Spec Catches It

A request spec sends a real HTTP request through the full Rails stack — router, middleware, controller, view:

```ruby
RSpec.describe "Sitemap" do
  describe "GET /sitemap" do
    it "returns http success with XML content type and renders without errors" do
      get sitemap_path(locale: I18n.default_locale, format: :xml)

      expect(response).to have_http_status(:success)
      expect(response.headers["Content-Type"]).to eq("application/xml; charset=utf-8")
    end

    it "does not include the removed support URL" do
      get sitemap_path(locale: I18n.default_locale, format: :xml)

      expect(response.body).not_to include("/support")
    end

    it "does not render the application layout" do
      get sitemap_path(locale: I18n.default_locale, format: :xml)

      expect(response).not_to render_template(layout: "application")
    end
  end
end
```

With this spec, `support_url` is called during an actual request cycle. The `NoMethodError` propagates naturally through the full Rack stack and the test fails immediately with a clear error — the same error that was causing the 500 in production:

```
NoMethodError:
  undefined method `support_url' for an instance of SitemapController

# ./app/views/sitemap/index.builder:12:in `block in _app_views_sitemap_index_builder'
```

No ambiguity. No green test hiding a broken endpoint. The failure message points directly at the view line that calls the missing helper.

The `"does not include the removed support URL"` example adds an extra safety net: even if the helper somehow resolves to an empty string instead of raising, the spec will catch the presence of the path in the output and fail.

## The General Lesson

| | Controller spec | Request spec |
|---|---|---|
| Goes through the router | No | Yes |
| Exercises view rendering fully | Partially | Yes |
| Catches broken URL helpers in views | Not reliably | Yes |
| Status codes reflect middleware behavior | No | Yes |
| Rails recommendation | Deprecated | Preferred |

Rails itself has been moving away from controller specs for years. The [Rails testing guide](https://guides.rubyonrails.org/testing.html) recommends request specs (or integration tests) over controller specs precisely because they exercise the full stack.

If your codebase still has controller specs, they are not wrong — but they can give you false confidence. Any spec that exercises a view should be a request spec.

## Summary

1. A route was commented out, breaking a URL helper used inside the sitemap builder.
2. The controller spec did not catch this because it bypassed the router and did not fully propagate the view rendering error.
3. Replacing it with a request spec immediately exposed the 500, because the full stack — including URL generation — runs on every test.
4. A targeted body assertion (`not_to include("/support")`) now documents the intent and guards against the same mistake in the future.

Use request specs for anything that touches views. Controller specs are a relic of an older Rails testing philosophy and should not be trusted to catch rendering errors.
