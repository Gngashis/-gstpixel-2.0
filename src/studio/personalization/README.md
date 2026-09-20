# Website Studio personalization boundary

Phase 4 keeps AI optional and server-side. The browser submits only the selected
category, selected direction, optional business name, and explicit business
description. Provider output is treated as untrusted and must pass the strict
versioned schema and category module allowlist before React applies it.

## Pre-public-scale hardening items

- Replace the isolate-local prototype request guard with Cloudflare-enforced,
  per-client distributed rate limiting or an equivalent abuse-control layer.
  Do not store raw IP addresses in application storage to do this.
- Revisit provider cancellation if Workers AI exposes a supported abort signal.
  The current server timeout bounds the response seen by the visitor, while the
  underlying provider promise may finish independently.
- Perform one tiny authorized Workers AI smoke inference during deployment
  preparation after the `AI` binding is activated in the intended environment.
