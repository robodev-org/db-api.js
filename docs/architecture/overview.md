---
layout: default
title: Architecture Overview
---

# Architecture Overview

## Purpose

Describe the major components and their responsibilities.

## Scope

Covers modules, repositories, caching, and diagnostics. Does not include API signatures.

## Table of Contents
{:toc}

## Components

- createDbApi
  - Builds the client, resolves options, wires dependencies.
- Repositories
  - ContentRepository: read-only, published-only content access.
  - ProfileRepository: read-only self access (RLS enforced).
  - ProgressRepository: read-only self access (RLS enforced).
- CacheAdapter
  - Interface for cache storage and TTL/SWR behavior.
- Diagnostics utilities
  - Collect timeline, events, snapshots, and errors.

## Data flow (read)

1) Options resolved and diagnostics session created.
2) Repository builds query plan.
3) Cache strategy decides: hit, stale, or network.
4) Supabase query executes.
5) Diagnostics report captures behavior and outcomes.

## Invariants

- No mutation paths.
- Published-only filters always enforced for content.
- Errors are structured and recorded in diagnostics.
