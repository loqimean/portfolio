---
title: "How a Controller Spec Missed a 500 Error That a Request Spec Caught"
excerpt: "A subtle but painful bug: a route gets removed (or commented out), a URL helper in the sitemap view breaks, the app starts returning 500 in production — and the test suite stays green. Here is how that happens and how to prevent it."
category: "Ruby on Rails"
tags: ["Ruby on Rails", "Testing", "Error Handling", "500 Errors"]
pubDate: 2026-03-24
draft: false
---
# How a Controller Spec Missed a 500 Error That a Request Spec Caught

A subtle but painful bug: a route gets removed (or commented out), a URL helper in the sitemap view breaks, the app starts returning 500 in production — and the test suite stays green. Here is how that happens and how to prevent it.

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
  before do
    create(:page)
    create(:post)
    create(:provider)
    create(:event)
  end

  describe "GET #index" do
    context "with :xml format" do
      it "returns http success" do
        get :index, format: :xml

        expect(response).to have_http_status(:success)
        expect(response.headers["Content-Type"]).to eq("application/xml; charset=utf-8")
      end

      it "does not render any template" do
        expect(get(:index, format: :xml)).not_to render_template(layout: "application")
      end
    end
  end
end
```

Both examples passed. The reason: **Rails controller specs do not go through the full routing stack.**

When you call `get :index` in a controller spec, RSpec dispatches the action directly, bypassing the router entirely. The controller action itself is thin — it just sets headers and lets the builder render. The view rendering **does** happen, but here is the key: in the test environment the builder tries to call `support_url` and it fails — yet the spec still passes.

Why? Because `support_url` is resolved at the moment the view renders. If the test environment has the route commented out, calling `support_url` raises `NoMethodError`. But controller specs run in a context that may stub or swallow view errors differently from a real HTTP request, depending on how the builder template is invoked. More practically: the old spec only asserted on the HTTP status and the content-type header, both of which are set *before* the view renders. The actual rendering exception was not propagating back to the spec assertion.

The bottom line is that controller specs test the controller layer in isolation. They are not designed to exercise the full request-response cycle, including URL generation inside views.

## How a Request Spec Catches It

A request spec sends a real HTTP request through the full Rails stack — router, middleware, controller, view:

```ruby
RSpec.describe "Sitemap" do
  before do
    create(:page)
    create(:post)
    create(:provider)
    create(:event)
  end

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

With this spec, `support_url` is called during an actual request cycle. The `NoMethodError` propagates naturally and the test fails with a clear error — the same error that was causing the 500 in production.

The `"does not include the removed support URL"` example adds an extra safety net: even if the helper somehow resolves to an empty string instead of raising, the spec will catch the presence of the path in the output and fail.

## The General Lesson

| | Controller spec | Request spec |
|---|---|---|
| Goes through the router | No | Yes |
| Exercises view rendering fully | Partially | Yes |
| Catches broken URL helpers in views | Not reliably | Yes |
| Tests real HTTP status codes | No (mocked) | Yes |
| Rails recommendation | Deprecated | Preferred |

Rails itself has been moving away from controller specs for years. The [Rails testing guide](https://guides.rubyonrails.org/testing.html) recommends request specs (or integration tests) over controller specs precisely because they exercise the full stack.

If your codebase still has controller specs, they are not wrong — but they can give you false confidence. Any spec that exercises a view should be a request spec.

## Summary

1. A route was commented out, breaking a URL helper used inside the sitemap builder.
2. The controller spec did not catch this because it bypassed the router and did not fully propagate the view rendering error.
3. Replacing it with a request spec immediately exposed the 500, because the full stack — including URL generation — runs on every test.
4. A targeted body assertion (`not_to include("/support")`) now documents the intent and guards against the same mistake in the future.

Use request specs for anything that touches views. Controller specs are a relic of an older Rails testing philosophy and should not be trusted to catch rendering errors.
