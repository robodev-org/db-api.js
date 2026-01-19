---
layout: default
title: Cache Adapter
---

# Cache Adapter

## Purpose

Define the cache adapter interface and caching invariants.

## Scope

Covers cache interface methods and required behavior. Does not define storage implementation.

## Table of Contents
{:toc}

## Interface

```ts
interface CacheAdapter {
  get<T>(key: string): CacheEntry<T> | undefined;
  set<T>(key: string, entry: CacheEntry<T>): void;
  invalidate(key: string): void;
  sweep(now?: number): void;
  stats?(): { size: number };
}
```

## Defaults

- The default adapter is in-memory.
- TTL is derived from `cache.ttlSeconds`.

## Invariants

- `sweep()` MUST remove entries whose `staleUntil` <= now.
- Cache is advisory and MUST NOT impact authorization.

## Errors

- Invalid adapters MUST trigger `ERR_CACHE_ADAPTER_INVALID` during option resolution.
