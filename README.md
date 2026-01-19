# @robodev/db-api

Browser-side Supabase SDK that enforces read-only, published-only access by design. This client assumes hostile usage and relies on server-side RLS.

## Quickstart

```ts
import { createDbApi } from "@robodev/db-api";

const api = createDbApi(
  {
    supabaseUrl: "https://your-project.supabase.co",
    anonKey: "public-anon-key",
    appId: "my-app"
  },
  {
    diagnostics: { enabled: true, includeSamples: false }
  }
);

const posts = await api.content.list({ table: "posts", select: "id,title" });
```

## Defaults

| Option | Default |
| --- | --- |
| cache.enabled | true |
| cache.ttlSeconds | 300 |
| cache.staleWhileRevalidate | true |
| pageSize | 20 |
| publicOnly | true |

## Public API

- `createDbApi(config, options?)`
- `DEFAULT_DB_API_OPTIONS`
- `resolveDbApiOptions()`

Repositories

- `content.list({ table, select?, filters?, page?, pageSize?, order? })`
- `content.getById({ table, id, select? })`
- `profiles.getSelf({ table, select? })`
- `progress.list({ table, select?, filters?, page?, pageSize?, order? })`

## Diagnostics

Diagnostics can be enabled via options. Use `finalizeDiagnosticsReport()` to capture a report for tests or debugging.

```ts
import { finalizeDiagnosticsReport } from "@robodev/db-api";

const report = finalizeDiagnosticsReport(api.diagnostics.session);
console.log(report.timeline, report.events);
```

## Troubleshooting

- **Missing published-only filter**: Ensure you are using `content` repository methods. The SDK injects `published = true` into every content query.
- **No cache hits**: Check `cache.enabled` and verify that list parameters are identical between calls.
- **Unexpected empty results**: Confirm RLS policies on your Supabase tables are enabled and allow read access for the anon role.
- **Timeouts or aborts**: Inspect `report.errors`, `events` (`query.exception`), and `timeline` to see where the failure occurred.
- **Truncation/partial data**: Inspect `report.errors` and `events` (`query.failed`) to confirm server-side truncation or failures.
- **Cache confusion**: Inspect `events` for `cache.hit`, `cache.miss`, `cache.stale`, and `cache.refresh.*` to trace cache behavior.

## Security

This SDK is read-only by design. It never exposes mutation methods and assumes Row Level Security is enforced server-side.

## License

MIT
