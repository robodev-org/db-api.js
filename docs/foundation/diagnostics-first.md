---
layout: default
title: Diagnostics-First
---

# Diagnostics-First

## Purpose

Explain why diagnostics are part of the SDK contract.

## Scope

Defines expectations for diagnostics completeness and usage. Does not define the schema; see Diagnostics Model.

## Table of Contents
{:toc}

## Contract

- Each operation MUST produce a Diagnostics Session when diagnostics are enabled.
- Events, timelines, and snapshots MUST capture all meaningful decisions and outcomes.
- Missing diagnostics for observed behavior is a defect.

## Required observations

- Cache behavior: hit, miss, stale, refresh
- Filter enforcement: published-only applied
- Query lifecycle: build, execute, complete
- Errors: include code, message, and optional cause

## Tradeoffs

- Diagnostic detail increases overhead. The SDK MUST allow disabling diagnostics.
- When disabled, diagnostics MUST impose near-zero overhead.
