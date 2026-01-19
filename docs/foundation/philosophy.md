---
layout: default
title: Philosophy
---

# Philosophy

## Purpose

Define the long-lived principles that govern this SDK.

## Scope

Covers non-negotiable behavior and design intent. Does not document API details.

## Table of Contents
{:toc}

## Read-only is a contract

- The SDK MUST NOT expose mutation APIs.
- Query methods MUST be limited to read operations.
- If a mutation is required, it MUST be performed outside this SDK.

## Published-only is enforced

- Content access MUST apply `published = true` by design.
- Callers cannot disable or override published-only behavior.

## Defaults-first

- Safe defaults MUST be fully specified and enforced.
- Optional behavior MUST document the default and the consequences of changing it.

## Diagnostics-first

- Every significant behavior MUST be observable via diagnostics.
- Diagnostics are part of the contract, not a debugging convenience.

## Hostile runtime assumption

- The SDK runs in a hostile client environment.
- Security MUST rely on server-side RLS and backend enforcement.
