---
title: "Monobank Webhook Sign Verification with Ruby"
excerpt: "Learn how to verify the Monobank Acquiring API webhook sign using a Ruby script. This script demonstrates a simple yet effective method to validate the webhook sign using the shared secret key."
category: "Ruby"
tags: ["Ruby", "Backend", "Security"]
pubDate: 2023-07-10
draft: false
---
## Introduction

Webhooks are a convenient way to receive real-time updates, but you should treat every incoming webhook request as untrusted until you verify who sent it. Monobank Acquiring webhooks include a signature (the `webhook sign`) in the request headers so you can validate the request body before processing it.

This post walks through a small Ruby example from the repository [loqimean/monobank_webhook_sign_verification](https://github.com/loqimean/monobank_webhook_sign_verification/) that recreates the signature locally and compares it with the header value.

### What the `webhook sign` is

When Monobank sends an Acquiring webhook (for example, about a transaction), it attaches a signature header computed from:

- the **raw request body**
- your **shared secret key** (issued by Monobank)
- the same **hashing/encoding scheme** used by Monobank (SHA1 + Base64 in the referenced script)

If the signature you compute matches the one in the headers, you can treat the payload as authentic.

### What you need

- **Ruby** with standard libraries `openssl` and `base64`
- **Your Monobank secret key**
- Access to the **raw** webhook request body and headers (before any transformations)

### Verification flow (high level)

1. **Read headers and raw body** from the incoming request.
2. **Extract the signature** value from the header provided by Monobank.
3. **Compute the expected signature** from the raw body using your shared secret key (matching Monobank’s algorithm).
4. **Compare signatures** and only proceed when they match; otherwise reject/log the request.

### Practical notes

- Make sure you sign/verify the **exact raw body bytes** as received. Even small changes (whitespace, encoding, JSON re-serialization) can cause mismatches.
- Treat signature mismatches as a security signal: return an error and log enough context to debug safely (without leaking secrets).

## Conclusion

Signature verification is the foundation of a secure webhook integration: it lets you confirm the request came from Monobank and that the payload wasn’t tampered with in transit.

The example in [loqimean/monobank_webhook_sign_verification](https://github.com/loqimean/monobank_webhook_sign_verification/) shows a minimal Ruby approach you can adapt to your app:

- **Verify first, process second**: reject requests with missing/invalid signatures.
- **Keep the secret key safe**: store it securely and rotate it when needed.
- **Log outcomes**: track successful and failed verifications to spot abuse or integration issues.
- **Follow upstream changes**: periodically check Monobank’s official docs for any signing scheme updates.
