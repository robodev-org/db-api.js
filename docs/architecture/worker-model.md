---
layout: default
title: Worker Model
---

# Worker Model

## Purpose

Describe background scheduling and worker-first expectations.

## Scope

Covers background refresh scheduling and optional worker usage. Does not require a worker implementation.

## Table of Contents
{:toc}

## Scheduling model

- Background tasks MAY be scheduled via the BackgroundScheduler interface.
- The default scheduler uses microtasks or setTimeout.
- Background refresh MUST NOT block foreground reads.

## Worker-first guidance

- If an app provides a Worker-backed scheduler, it SHOULD be used for cache refresh.
- Worker usage MUST preserve diagnostics continuity and traceId propagation.

## Invariants

- Foreground queries must be deterministic regardless of scheduler implementation.
- Diagnostics MUST record refresh start and end events.
