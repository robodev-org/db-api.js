---
layout: default
title: Defaults Over Configuration
---

# Defaults Over Configuration

## Purpose

Define the defaults-first policy and how configuration is constrained.

## Scope

Covers option resolution and invariants. Does not document all options; see API docs.

## Table of Contents
{:toc}

## Defaults-first contract

- Every public option MUST have a default.
- Defaults MUST be enforced by `resolveDbApiOptions()`.
- Optional behavior MUST document the default and the effect of override.

## Non-negotiable defaults

| Option | Default | Invariant |
| --- | --- | --- |
| cache.enabled | true | Cache is on by default |
| cache.ttlSeconds | 300 | TTL is positive |
| cache.staleWhileRevalidate | true | Stale reads allowed |
| pageSize | 20 | Must be positive |
| publicOnly | true | Cannot be disabled |

## Tradeoffs

- Defaults reduce configuration drift but can reduce flexibility.
- Enforced defaults reduce user error but require clear documentation of invariants.
