---
title: "How Ruby Constant Resolution Works (And Why Compact Modules Can Fail)"
excerpt: "Ruby namespace syntax can look equivalent, but `module A::B::C` and nested `module A; module B; module C; end; end; end` do not behave the same when parent constants are missing. This is a practical walkthrough of how Ruby resolves constants and why load order matters."
category: "Ruby on Rails"
tags: ["Ruby", "RuboCop", "Autoloading", "Zeitwerk", "Debugging"]
pubDate: 2026-02-26
draft: false
---
## **One Ruby Example That Explains a Lot**

Consider these two snippets:

```ruby
module RuboCop::Cop::Custom::SomeRule
end
```

and:

```ruby
module RuboCop
  module Cop
    module Custom
      module SomeRule
      end
    end
  end
end
```

Many developers expect them to be equivalent. They are close, but not equivalent in one important way: **how parent constants are created**.

## **How Ruby Resolves `A::B::C`**

When Ruby sees `A::B::C`, it tries to resolve constants from left to right:

1. resolve `A`
2. inside `A`, resolve `B`
3. inside `A::B`, resolve `C`

If any parent constant is missing, Ruby raises `NameError` (`uninitialized constant ...`).

So this:

```ruby
module RuboCop::Cop::Custom::SomeRule
end
```

assumes `RuboCop::Cop::Custom` already exists before the parser enters `SomeRule`.

## **Why Nested `module` Style Behaves Differently**

In expanded style, each level is opened (or created) step by step:

```ruby
module RuboCop
  module Cop
    module Custom
      module SomeRule
      end
    end
  end
end
```

Ruby can create missing parent namespaces while entering each nested block. That is why expanded style often works even when compact style raises an error.

## **Where Load Order Enters the Picture**

The moment constants are resolved depends on when a file is loaded.

If this file loads early:

```ruby
module RuboCop::Cop::Custom::SomeRule
end
```

and no prior code has defined `RuboCop::Cop::Custom`, resolution fails immediately.

This is why the same code may work in one environment and fail in another:

- different autoload behavior
- different `require` sequence
- refactors that changed file paths

The rule is stable; only load timing changed.

## **Practical Mental Model**

Use this model when writing namespaced Ruby code:

- `A::B::C` is a **reference path** that expects parents to exist
- nested `module` blocks are a **construction path** that can create parents

Once you see that difference, errors like `uninitialized constant RuboCop::Cop::Custom` stop feeling random.

## **How to Write Code That Avoids Surprises**

For extension code (RuboCop, Rails engines, gems), these habits help:

- keep file paths aligned with constant names
- prefer one namespace style consistently in a subsystem
- avoid relying on accidental load order
- initialize parent namespaces explicitly when needed

This is less about style preference and more about making constant resolution deterministic.

## **Conclusion**

The core idea is simple: Ruby constant lookup is strict, and namespace syntax is not purely cosmetic.

Compact syntax is great when parent constants are already loaded. Expanded syntax is safer when code may load in unpredictable order.

If you want help reviewing your namespace and load-order setup, [contact me here](/#contact-section) and I can help you make it predictable and production-safe.
