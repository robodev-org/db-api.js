---
layout: default
title: Repositories
---

# Repositories

## Purpose

Define the read-only repository interfaces and their invariants.

## Scope

Covers repository methods and contracts. Does not define diagnostics schema.

## Table of Contents
{:toc}

## ContentRepository

### Methods

- `list({ table, select?, filters?, page?, pageSize?, order? })`
- `getById({ table, id, select? })`

### Defaults

- `select` defaults to `"*"`.
- `page` defaults to `1`.
- `pageSize` defaults to `options.pageSize`.

### Invariants

- `published = true` is always enforced.
- No mutation methods are exposed.

### Errors

- `ERR_QUERY_FAILED` on query failure.

## ProfileRepository

### Methods

- `getSelf({ table, select? })`

### Invariants

- Access is self-only via server-side RLS.
- No mutation methods are exposed.

## ProgressRepository

### Methods

- `list({ table, select?, filters?, page?, pageSize?, order? })`

### Invariants

- Access is self-only via server-side RLS.
- No mutation methods are exposed.
