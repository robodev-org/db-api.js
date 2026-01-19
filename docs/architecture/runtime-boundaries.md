---
layout: default
title: Runtime Boundaries
---

# Runtime Boundaries

## Purpose

Define what runs in the browser and what must be enforced server-side.

## Scope

Covers client-side boundaries, RLS enforcement, and cache behavior. Does not cover deployment.

## Table of Contents
{:toc}

## Client boundary

- Only public (anon) keys are used.
- Client behavior is observable and modifiable.
- Any client-side filtering is advisory.

## Server boundary

- RLS policies enforce access control.
- Published-only constraints must be enforced in policies.
- The SDK assumes the server is authoritative.

## Cache boundary

- Cache is client-side only.
- Cache does not affect authorization.
- Stale reads are a performance strategy, not a security control.
