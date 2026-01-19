---
layout: default
title: RLS and Boundaries
---

# RLS and Boundaries

## Purpose

Define how RLS intersects with client behavior.

## Scope

Covers server boundary and published-only requirements. Does not define specific RLS policies.

## Table of Contents
{:toc}

## Boundary statement

- RLS is the only access control boundary.
- Client-side checks are advisory and MUST NOT be relied on.

## Published-only requirement

- Content queries MUST include `published = true`.
- RLS policies SHOULD also enforce published-only access.

## Self-only data

- Profile and progress data MUST be restricted by RLS.
- The SDK assumes the server enforces self-only access.
