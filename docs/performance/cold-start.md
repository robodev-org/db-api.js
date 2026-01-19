---
layout: default
title: Cold Start
---

# Cold Start

## Purpose

Document cold-start expectations and constraints.

## Scope

Covers initialization overhead and how to keep it low. Does not cover runtime query latency.

## Table of Contents
{:toc}

## Expectations

- `createDbApi()` SHOULD avoid heavy work.
- Diagnostics session creation MUST be O(1).
- No network calls during initialization.

## Tradeoffs

- More precomputation reduces runtime but increases cold start.
- Cache setup is minimal by default.
