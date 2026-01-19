# Contributing

Thanks for helping improve @robodev/db-api.

## Development setup

- Install dependencies: `npm install`
- Run tests: `npm test`
- Build: `npm run build`

## Test philosophy (diagnostics-first)

Tests are designed to act as a diagnostic filter. Every meaningful behavior must be observable in diagnostics (events, timeline, snapshots, call traces). If a behavior occurs without trace evidence, the test should fail. When a test fails, the DiagnosticsReport is printed and written to `tests/artifacts/` when possible.

## PR checklist

- [ ] Defaults updated and documented (options + README table)
- [ ] Diagnostics coverage added for new behavior (events/timeline/snapshots)
- [ ] Tests added or updated (including negative cases)
- [ ] Bundle impact considered (no new heavy deps)
- [ ] No mutation APIs introduced

## Reporting issues

Please include reproduction steps and any diagnostics reports you can generate.
