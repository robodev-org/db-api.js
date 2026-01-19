import type {
  DiagnosticsSession,
  QueryPlan,
  RepositoryContext,
  SupabaseQueryResult
} from "../types";
import { DbApiError } from "../errors";
import { buildCacheKey, createCacheEntry } from "../utils";
import { recordError, recordEvent, recordTimeline } from "../diagnostics/diagnostics";

interface CacheResult<T> {
  data: T;
  source: "cache" | "network";
  isStale: boolean;
}

function isFresh(now: number, expiresAt: number): boolean {
  return now <= expiresAt;
}

function isStaleValid(now: number, staleUntil: number): boolean {
  return now <= staleUntil;
}

export async function fetchWithCache<T>(
  context: RepositoryContext,
  cacheScope: string,
  cacheParams: Record<string, unknown>,
  plan: QueryPlan,
  fetcher: () => Promise<SupabaseQueryResult<T>>
): Promise<CacheResult<T>> {
  const { cache, diagnostics, logger, background } = context;
  const now = Date.now();
  const cacheKey = buildCacheKey(cacheScope, "query", cacheParams);

  if (cache.enabled) {
    const entry = cache.adapter.get<T>(cacheKey);
    if (entry) {
      if (isFresh(now, entry.expiresAt)) {
        recordEvent(diagnostics, "debug", "cache.hit", { cacheKey, state: "fresh" });
        return { data: entry.value, source: "cache", isStale: false };
      }
      if (cache.staleWhileRevalidate && isStaleValid(now, entry.staleUntil)) {
        recordEvent(diagnostics, "info", "cache.stale", { cacheKey, state: "stale" });
        background.schedule(async () => {
          try {
            recordEvent(diagnostics, "info", "cache.refresh.start", { cacheKey });
            const result = await fetcher();
            if (result.error) {
              recordEvent(diagnostics, "warn", "cache.refresh.error", {
                cacheKey,
                message: result.error.message
              });
              return;
            }
            cache.adapter.set(cacheKey, createCacheEntry(result.data as T, cache.ttlSeconds, Date.now()));
            recordEvent(diagnostics, "info", "cache.refresh.end", { cacheKey });
          } catch (error) {
            logger?.warn?.("cache.refresh.failed", { cacheKey, error });
            recordEvent(diagnostics, "warn", "cache.refresh.failed", { cacheKey });
          }
        });
        return { data: entry.value, source: "cache", isStale: true };
      }
      recordEvent(diagnostics, "debug", "cache.miss", { cacheKey, state: "expired" });
    } else {
      recordEvent(diagnostics, "debug", "cache.miss", { cacheKey, state: "empty" });
    }
  }

  recordTimeline(diagnostics, "query.execute", { plan });
  let result: SupabaseQueryResult<T>;
  try {
    result = await fetcher();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    recordEvent(diagnostics, "error", "query.exception", { message });
    recordError(diagnostics, { code: "ERR_QUERY_FAILED", message, cause: String(error) });
    throw new DbApiError("ERR_QUERY_FAILED", message, String(error));
  }
  recordTimeline(diagnostics, "query.complete", { plan });

  if (result.error) {
    recordEvent(diagnostics, "error", "query.failed", { message: result.error.message });
    recordError(diagnostics, { code: "ERR_QUERY_FAILED", message: result.error.message });
    throw new DbApiError("ERR_QUERY_FAILED", result.error.message);
  }

  if (cache.enabled) {
    cache.adapter.set(cacheKey, createCacheEntry(result.data as T, cache.ttlSeconds, now));
    recordEvent(diagnostics, "debug", "cache.set", { cacheKey });
  }

  return { data: result.data as T, source: "network", isStale: false };
}

export function applyPublishedOnlyFilter(
  diagnostics: DiagnosticsSession,
  filters: Array<{ field: string; op: string; value: unknown }>
): Array<{ field: string; op: string; value: unknown }> {
  const next = filters.slice();
  next.push({ field: "published", op: "eq", value: true });
  recordEvent(diagnostics, "info", "filter.publishedOnly.applied", { field: "published", value: true });
  return next;
}
