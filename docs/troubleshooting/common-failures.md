---
layout: default
title: Common Failures
---

# Common Failures

## Purpose

Provide a stable mapping from symptoms to diagnostics evidence.

## Scope

Covers common failure symptoms and where to look in DiagnosticsReport. Does not replace API docs.

## Table of Contents
{:toc}

## Missing results

- Inspect `events` for `filter.publishedOnly.applied`.
- Inspect `errors` for `ERR_QUERY_FAILED`.
- Inspect `timeline` for where the query stopped.

## Cache confusion

- Inspect `events` for `cache.hit`, `cache.miss`, `cache.stale`, `cache.refresh.*`.
- Inspect `options.cache` to confirm defaults.

## Timeouts or aborts

- Inspect `errors` for `ERR_QUERY_FAILED`.
- Inspect `events` for `query.exception`.
- Inspect `timeline` for the last marker recorded.
