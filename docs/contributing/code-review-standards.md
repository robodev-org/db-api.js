---
layout: default
title: Code Review Standards
---

# Code Review Standards

## Purpose

Define code review requirements to preserve long-term stability.

## Scope

Covers review criteria for code and docs. Does not define ownership policy.

## Table of Contents
{:toc}

## Required checks

- Defaults-first: defaults are enforced and documented.
- Diagnostics-first: events, timeline, and snapshots updated.
- Security: no mutation paths; published-only preserved.
- Performance: dependency impact considered.

## Review outcomes

- A PR MUST be rejected if it weakens diagnostics coverage.
- A PR MUST be rejected if it adds mutation APIs.
