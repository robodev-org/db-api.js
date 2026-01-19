---
layout: default
title: Bundle Size Policy
---

# Bundle Size Policy

## Purpose

Define how bundle size is controlled and reviewed.

## Scope

Covers dependency rules and release checks. Does not define build tools.

## Table of Contents
{:toc}

## Policy

- New dependencies MUST be justified in PRs.
- The dependency count MUST remain minimal.
- Any dependency update MUST include bundle impact notes.

## Invariants

- No UI or framework dependencies.
- No SQL generation dependencies.
