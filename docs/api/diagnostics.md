---
layout: default
title: Diagnostics Utilities
---

# Diagnostics Utilities

## Purpose

Document the diagnostics utility functions and their contracts.

## Scope

Covers creation, recording, and finalization of diagnostics. Does not cover testing harness.

## Table of Contents
{:toc}

## createDiagnosticsSession()

```ts
createDiagnosticsSession({
  enabled: boolean,
  version: string,
  resolvedOptions: Record<string, unknown>
}): DiagnosticsSession
```

### Invariants

- `traceId` MUST be present.
- `timeline` and `events` MUST be arrays.

## recordTimeline()

```ts
recordTimeline(session, name, meta?)
```

- MUST add a relative time entry when diagnostics are enabled.

## recordEvent()

```ts
recordEvent(session, level, name, meta?)
```

- MUST append to events when diagnostics are enabled.

## recordSnapshot()

```ts
recordSnapshot(session, name, data)
```

- MUST store snapshots with ISO timestamps when diagnostics are enabled.

## recordError()

```ts
recordError(session, { code, message, cause? })
```

- MUST append to errors when diagnostics are enabled.

## finalizeDiagnosticsReport()

```ts
finalizeDiagnosticsReport(session): DiagnosticsReport
```

- MUST return a complete DiagnosticsReport.
- MUST throw if traceId is missing.
