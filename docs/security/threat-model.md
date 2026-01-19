---
layout: default
title: Threat Model
---

# Threat Model

## Purpose

Provide a concise threat model for reviewers and maintainers.

## Scope

Covers client-side threats, RLS reliance, and read-only enforcement. Does not define server policy details.

## Table of Contents
{:toc}

## Assets

- Public content data
- User profile and progress data
- Diagnostics data (non-sensitive but operational)

## Adversaries

- Malicious client code
- Network observers
- Misconfigured backend policies

## Assumptions

- The client is fully controlled by the user.
- The anon key is public and expected to be shared.
- RLS is the only access control boundary.

## Mitigations

- Read-only API surface only.
- Published-only filters for content.
- No client-side trust decisions.
