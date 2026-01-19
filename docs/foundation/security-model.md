---
layout: default
title: Security Model
---

# Security Model

## Purpose

Describe the security assumptions and constraints of the SDK.

## Scope

Covers client-side assumptions, RLS reliance, and read-only contract. Does not describe server policy implementation.

## Table of Contents
{:toc}

## Assumptions

- The client environment is hostile.
- API keys and requests are observable and modifiable by attackers.
- RLS on the server is the primary security enforcement.

## Constraints

- The SDK MUST remain read-only.
- Content access MUST be published-only.
- No client-side checks are considered a security boundary.

## RLS reliance

- All access control MUST be enforced by Supabase RLS policies.
- If RLS is misconfigured, the SDK MUST not attempt to compensate.
