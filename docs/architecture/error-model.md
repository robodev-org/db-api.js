---
layout: default
title: Error Model
---

# Error Model

## Purpose

Define error types, codes, and invariants.

## Scope

Covers structured errors and diagnostics error recording. Does not define transport-specific errors.

## Table of Contents
{:toc}

## Error types

- DbApiError
  - Code: stable string identifier
  - Message: human-readable
  - Cause: optional string

## Stable error codes

| Code | Meaning |
| --- | --- |
| ERR_INVALID_CONFIG | Configuration missing or invalid |
| ERR_PUBLIC_ONLY_ENFORCED | Attempted to disable published-only |
| ERR_CACHE_ADAPTER_INVALID | Cache adapter does not implement required interface |
| ERR_SUPABASE_INIT | Supabase client initialization failed |
| ERR_QUERY_FAILED | Query failed or threw |

## Invariants

- All errors MUST be recorded in diagnostics when enabled.
- Errors MUST include a stable error code.
- Errors MUST not leak sensitive data.
