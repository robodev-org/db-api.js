---
layout: default
title: Performance Budgets
---

# Performance Budgets

## Purpose

Define performance budgets as enforceable constraints.

## Scope

Covers bundle size, cold start, and diagnostics overhead. Does not describe profiling tools.

## Table of Contents
{:toc}

## Budgets

| Budget | Target | Notes |
| --- | --- | --- |
| Bundle size (gzip) | <= 20 KB | Enforced by dependency review |
| Cold start overhead | < 50 ms | Typical browser execution |
| Diagnostics overhead (enabled) | < 2 ms | Per operation target |

## Invariants

- Diagnostics MUST be optional.
- Cache MUST remain O(1) per key.
