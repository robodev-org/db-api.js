---
layout: default
title: createDbApi
---

# createDbApi

## Purpose

Define the primary entry point for constructing the SDK client.

## Scope

Covers parameters, defaults, invariants, and error conditions. Does not document repository methods.

## Table of Contents
{:toc}

## Signature

```ts
createDbApi(config: DbApiConfig, options?: Partial<DbApiOptions>): DbApiClient
```

## Parameters

- `config.supabaseUrl` (required)
- `config.anonKey` (required)
- `config.appId` (required)
- `options` (optional; defaults applied by `resolveDbApiOptions()`)

## Defaults

All defaults match `DEFAULT_DB_API_OPTIONS`.

## Invariants

- `publicOnly` is always `true`.
- The client is read-only and does not expose mutations.
- Diagnostics session is created if diagnostics are enabled.

## Errors

- `ERR_INVALID_CONFIG`: missing `supabaseUrl`, `anonKey`, or `appId`.
- `ERR_SUPABASE_INIT`: Supabase client initialization failed.

## Notes

- A custom `fetch` MAY be provided for deterministic tests.
- A background scheduler MAY be provided for worker-first environments.
