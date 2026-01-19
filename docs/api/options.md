---
layout: default
title: Options and Defaults
---

# Options and Defaults

## Purpose

Document `DEFAULT_DB_API_OPTIONS` and `resolveDbApiOptions()` behavior.

## Scope

Covers defaults, invariants, and error conditions. Does not define repository methods.

## Table of Contents
{:toc}

## DEFAULT_DB_API_OPTIONS

| Option | Default | Invariant |
| --- | --- | --- |
| cache.enabled | true | Cache is enabled by default |
| cache.ttlSeconds | 300 | Must be > 0 |
| cache.staleWhileRevalidate | true | Stale reads allowed |
| pageSize | 20 | Must be > 0 |
| publicOnly | true | Cannot be disabled |
| diagnostics.enabled | false | Diagnostics disabled by default |
| diagnostics.includeSamples | false | Samples excluded by default |

## resolveDbApiOptions()

```ts
resolveDbApiOptions(options?: Partial<DbApiOptions>): DbApiOptions
```

### Invariants

- `publicOnly` is forced to `true`.
- Invalid TTL or page size MUST throw `ERR_INVALID_CONFIG`.
- Invalid cache adapter MUST throw `ERR_CACHE_ADAPTER_INVALID`.

### Errors

- `ERR_PUBLIC_ONLY_ENFORCED`
- `ERR_INVALID_CONFIG`
- `ERR_CACHE_ADAPTER_INVALID`
