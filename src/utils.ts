import type { CacheEntry, QueryPlan } from "./types";

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const props = entries.map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`);
  return `{${props.join(",")}}`;
}

export function buildCacheKey(scope: string, method: string, params: Record<string, unknown>): string {
  return `${scope}:${method}:${stableStringify(params)}`;
}

export function createCacheEntry<T>(value: T, ttlSeconds: number, now: number): CacheEntry<T> {
  const ttlMs = ttlSeconds * 1000;
  return {
    value,
    createdAt: now,
    expiresAt: now + ttlMs,
    staleUntil: now + ttlMs * 2
  };
}

export function cloneQueryPlan(plan: QueryPlan): QueryPlan {
  return {
    table: plan.table,
    select: plan.select,
    filters: plan.filters.map((filter) => ({ ...filter })),
    order: plan.order ? { ...plan.order } : undefined,
    range: plan.range ? { ...plan.range } : undefined,
    limit: plan.limit
  };
}
