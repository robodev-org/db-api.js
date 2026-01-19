---
layout: default
title: Diagnostics Model
---

# Diagnostics Model

## Purpose

Define the DiagnosticsReport schema and how to interpret it.

## Scope

Covers schema, invariants, and examples. Does not cover testing harness setup.

## Table of Contents
{:toc}

## DiagnosticsReport schema

```json
{
  "repo": "string",
  "version": "string",
  "traceId": "string",
  "env": { "userAgent?": "string", "platform?": "string" },
  "options": { "...": "..." },
  "timeline": [ { "t": 0, "name": "string", "meta?": {} } ],
  "events": [ { "level": "debug|info|warn|error", "name": "string", "meta?": {} } ],
  "snapshots?": [ { "name": "string", "at": "ISO-8601", "data": {} } ],
  "artifacts": { "notes?": [], "samples?": [], "traces?": [] },
  "errors?": [ { "code": "string", "message": "string", "cause?": "string" } ]
}
```

## Invariants

- `traceId` MUST be a 32-character lowercase hex string.
- `timeline` entries MUST be monotonic by `t`.
- `events` MUST record cache policy decisions and filter enforcement.
- `errors` MUST be populated on any failure.

## Example: successful query

```json
{
  "repo": "db-api",
  "version": "0.1.0",
  "traceId": "4f0e2e9f8d6f3b3a9f6c2a1b5d8e7c9a",
  "env": { "userAgent": "ExampleAgent", "platform": "ExampleOS" },
  "options": { "cache": { "enabled": true, "ttlSeconds": 300, "staleWhileRevalidate": true }, "pageSize": 20, "publicOnly": true },
  "timeline": [
    { "t": 0, "name": "query.build" },
    { "t": 2, "name": "query.execute" },
    { "t": 8, "name": "query.complete" }
  ],
  "events": [
    { "level": "debug", "name": "cache.miss", "meta": { "state": "empty" } },
    { "level": "info", "name": "filter.publishedOnly.applied" },
    { "level": "info", "name": "query.result", "meta": { "source": "network", "stale": false } }
  ],
  "artifacts": {}
}
```

## Example: timeout

```json
{
  "repo": "db-api",
  "version": "0.1.0",
  "traceId": "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
  "env": {},
  "options": { "cache": { "enabled": true, "ttlSeconds": 300, "staleWhileRevalidate": true }, "pageSize": 20, "publicOnly": true },
  "timeline": [
    { "t": 0, "name": "query.build" },
    { "t": 1, "name": "query.execute" }
  ],
  "events": [
    { "level": "error", "name": "query.exception", "meta": { "message": "Timeout" } }
  ],
  "errors": [
    { "code": "ERR_QUERY_FAILED", "message": "Timeout" }
  ],
  "artifacts": {}
}
```

## Example: truncated output

```json
{
  "repo": "db-api",
  "version": "0.1.0",
  "traceId": "0a1b2c3d4e5f67890123456789abcdef",
  "env": {},
  "options": { "cache": { "enabled": true, "ttlSeconds": 300, "staleWhileRevalidate": true }, "pageSize": 20, "publicOnly": true },
  "timeline": [
    { "t": 0, "name": "query.build" },
    { "t": 1, "name": "query.execute" },
    { "t": 4, "name": "query.complete" }
  ],
  "events": [
    { "level": "error", "name": "query.failed", "meta": { "message": "TRUNCATED" } }
  ],
  "errors": [
    { "code": "ERR_QUERY_FAILED", "message": "TRUNCATED" }
  ],
  "artifacts": {}
}
```
