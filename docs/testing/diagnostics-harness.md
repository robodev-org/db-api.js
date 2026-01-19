---
layout: default
title: Diagnostics Harness
---

# Diagnostics Harness

## Purpose

Describe the DiagnosticsProbe used to capture and persist diagnostic artifacts.

## Scope

Covers harness responsibilities and outputs. Does not document the DiagnosticsReport schema.

## Table of Contents
{:toc}

## Responsibilities

- Capture resolved options after defaults merge.
- Capture full event stream and timeline.
- Capture snapshots at key moments.
- Capture call trace sequence.
- Capture outputs and errors.
- Emit JSON on failure and write artifacts to `tests/artifacts/`.

## Artifact naming

- File name format: `<testname>-<traceId>.json`.
- TraceId MUST match the diagnostics session.
