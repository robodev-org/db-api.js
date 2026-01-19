---
layout: default
title: Mock Tests
---

# Mock Tests

## Purpose

Define how mocks and fakes simulate Supabase and timing behavior.

## Scope

Covers mock Supabase client and error simulation. Does not cover real network calls.

## Table of Contents
{:toc}

## Mock requirements

- No network access.
- Simulate timing, timeout, abort, truncation, and partial outputs.
- Capture exact call sequence and parameters.

## Evidence

- Tests MUST assert that mock call traces align with query plans.
- Diagnostics MUST reflect mock-induced errors.
