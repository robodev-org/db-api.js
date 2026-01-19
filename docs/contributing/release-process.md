---
layout: default
title: Release Process
---

# Release Process

## Purpose

Define a minimal, predictable release process.

## Scope

Covers versioning and changelog updates. Does not define CI configuration.

## Table of Contents
{:toc}

## Steps

1) Update CHANGELOG with date and notes.
2) Bump version in `package.json` and `src/version.ts`.
3) Run tests and build.
4) Tag release in VCS.

## Invariants

- CHANGELOG MUST follow Keep a Changelog format.
- Releases MUST not introduce mutation APIs.
