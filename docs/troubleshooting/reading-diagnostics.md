---
layout: default
title: Reading Diagnostics
---

# Reading Diagnostics

## Purpose

Explain how to interpret DiagnosticsReport for debugging.

## Scope

Covers timeline, events, snapshots, and errors. Does not cover schema definition; see Diagnostics Model.

## Table of Contents
{:toc}

## Timeline

- `timeline` entries are relative times in milliseconds since session start.
- Use `query.build`, `query.execute`, and `query.complete` to locate delays.

## Events

- Events capture policy decisions and outcomes.
- Key events: `cache.hit`, `cache.miss`, `cache.stale`, `filter.publishedOnly.applied`, `query.failed`.

## Snapshots

- Snapshots are structured state captures at key points.
- Compare `probe.before` and `probe.after` to find state changes.

## Errors

- `errors` is authoritative for failure reason.
- Errors MUST include a stable error code.
