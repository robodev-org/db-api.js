---
layout: default
title: Unit Tests
---

# Unit Tests

## Purpose

Define what unit tests must verify and how they use diagnostics.

## Scope

Covers unit-level behaviors (options, cache, diagnostics utilities). Does not cover integration tests.

## Table of Contents
{:toc}

## Coverage requirements

- Defaults resolution and invariants
- Cache adapter behavior and sweep semantics
- Diagnostics utilities behavior and schema shape

## Evidence

- Each test MUST assert at least one diagnostics event or timeline marker.
- Failures MUST emit DiagnosticsReport JSON.
