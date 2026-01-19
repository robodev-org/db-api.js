---
layout: default
title: Testing Philosophy
---

# Testing Philosophy

## Purpose

Define the diagnostics-first testing contract for this repository.

## Scope

Covers expectations and required evidence. Does not list specific test cases.

## Table of Contents
{:toc}

## Diagnostics-first contract

- Every major behavior MUST produce diagnostics evidence.
- Tests MUST fail if behavior occurs without trace evidence.
- Failures MUST print DiagnosticsReport JSON and write artifacts when possible.

## Required evidence

- Events: cache state, filter application, error conditions
- Timeline: build, execute, complete
- Snapshots: state before and after key operations
- Call trace: exact sequence of Supabase query builder calls
