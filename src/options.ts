import type { BackgroundScheduler, CacheAdapter, DbApiOptions } from "./types";
import { DbApiError } from "./errors";

export const DEFAULT_DB_API_OPTIONS: DbApiOptions = {
  cache: {
    enabled: true,
    ttlSeconds: 300,
    staleWhileRevalidate: true,
    adapter: undefined
  },
  pageSize: 20,
  publicOnly: true,
  diagnostics: {
    enabled: false,
    includeSamples: false
  },
  logger: undefined,
  fetch: undefined,
  background: undefined
};

export function createDefaultBackgroundScheduler(): BackgroundScheduler {
  return {
    schedule(task) {
      if (typeof queueMicrotask === "function") {
        queueMicrotask(task);
        return;
      }
      setTimeout(task, 0);
    }
  };
}

export function resolveDbApiOptions(input?: Partial<DbApiOptions>): DbApiOptions {
  const merged: DbApiOptions = {
    cache: {
      enabled: input?.cache?.enabled ?? DEFAULT_DB_API_OPTIONS.cache.enabled,
      ttlSeconds: input?.cache?.ttlSeconds ?? DEFAULT_DB_API_OPTIONS.cache.ttlSeconds,
      staleWhileRevalidate:
        input?.cache?.staleWhileRevalidate ?? DEFAULT_DB_API_OPTIONS.cache.staleWhileRevalidate,
      adapter: input?.cache?.adapter ?? DEFAULT_DB_API_OPTIONS.cache.adapter
    },
    pageSize: input?.pageSize ?? DEFAULT_DB_API_OPTIONS.pageSize,
    publicOnly: DEFAULT_DB_API_OPTIONS.publicOnly,
    diagnostics: {
      enabled: input?.diagnostics?.enabled ?? DEFAULT_DB_API_OPTIONS.diagnostics.enabled,
      includeSamples: input?.diagnostics?.includeSamples ?? DEFAULT_DB_API_OPTIONS.diagnostics.includeSamples
    },
    logger: input?.logger ?? DEFAULT_DB_API_OPTIONS.logger,
    fetch: input?.fetch ?? DEFAULT_DB_API_OPTIONS.fetch,
    background: input?.background ?? DEFAULT_DB_API_OPTIONS.background
  };

  if (input?.publicOnly === false) {
    throw new DbApiError(
      "ERR_PUBLIC_ONLY_ENFORCED",
      "publicOnly cannot be disabled; SDK enforces published-only access by design."
    );
  }

  if (merged.pageSize <= 0) {
    throw new DbApiError("ERR_INVALID_CONFIG", "pageSize must be greater than 0.");
  }

  if (merged.cache.ttlSeconds <= 0) {
    throw new DbApiError("ERR_INVALID_CONFIG", "cache.ttlSeconds must be greater than 0.");
  }

  merged.background = merged.background ?? createDefaultBackgroundScheduler();

  const adapter = merged.cache.adapter;
  if (adapter) {
    const valid =
      typeof adapter.get === "function" &&
      typeof adapter.set === "function" &&
      typeof adapter.invalidate === "function" &&
      typeof adapter.sweep === "function";
    if (!valid) {
      throw new DbApiError(
        "ERR_CACHE_ADAPTER_INVALID",
        "cache.adapter must implement get, set, invalidate, and sweep."
      );
    }
  }

  return merged;
}

export function resolveCacheAdapter(adapter?: CacheAdapter): CacheAdapter | undefined {
  return adapter;
}
