# Security Policy

## Threat model summary

- This SDK runs in hostile client environments. Assume all client inputs and network traffic are observable and modifiable.
- All authorization is enforced server-side via RLS. Client-side filters are not a security boundary.
- The SDK must remain read-only; it must not expose mutation APIs.

## Supported versions

Only the latest minor release is supported with security patches.

## Reporting a vulnerability

Please open a private security report or email the maintainers with:

- A description of the issue
- Steps to reproduce
- Impact assessment

We will acknowledge within 72 hours and provide a mitigation plan.
