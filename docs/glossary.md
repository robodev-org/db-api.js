---
layout: default
title: Glossary
---

# Glossary

## Purpose

Define shared terminology for consistency across repositories and documentation.

## Scope

Defines core terms used in db-api documentation. It does not define Supabase or browser platform terms.

## Terms

- Defaults-first
  - Definition: A design policy where defaults are complete, safe, and enforced. Optional behavior must be explicit, and the default must be documented.
  - Invariant: Defaults must be enforced by `resolveDbApiOptions()` and documented in the API reference.

- Diagnostics Session
  - Definition: A structured capture of events, timelines, snapshots, and errors for a single logical operation.
  - Invariant: Each session MUST have a traceId and MUST be serializable to DiagnosticsReport JSON.

- Runner
  - Definition: A runtime component responsible for executing a logical operation (query, cache refresh, background task).
  - Invariant: Runners MUST emit diagnostics timeline markers for start and completion.

- Strategy
  - Definition: A policy module that chooses between behaviors (e.g., cache vs network, stale vs refresh).
  - Invariant: Strategy decisions MUST be recorded in diagnostics events.

- Read-only
  - Definition: The SDK does not expose any mutation APIs (insert/update/delete/upsert).
  - Invariant: No repository may provide methods that mutate content.

- Published-only
  - Definition: Access restricted to published content only.
  - Invariant: Content queries MUST apply `published = true` regardless of caller input.
