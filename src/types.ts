export interface DbApiConfig {
  supabaseUrl: string;
  anonKey: string;
  appId: string;
}

export interface Logger {
  debug?: (message: string, meta?: Record<string, unknown>) => void;
  info?: (message: string, meta?: Record<string, unknown>) => void;
  warn?: (message: string, meta?: Record<string, unknown>) => void;
  error?: (message: string, meta?: Record<string, unknown>) => void;
}

export interface CacheEntry<T> {
  value: T;
  createdAt: number;
  expiresAt: number;
  staleUntil: number;
}

export interface CacheAdapter {
  get<T>(key: string): CacheEntry<T> | undefined;
  set<T>(key: string, entry: CacheEntry<T>): void;
  invalidate(key: string): void;
  sweep(now?: number): void;
  stats?(): { size: number };
}

export interface CacheOptions {
  enabled: boolean;
  ttlSeconds: number;
  staleWhileRevalidate: boolean;
  adapter?: CacheAdapter;
}

export interface DiagnosticsOptions {
  enabled: boolean;
  includeSamples: boolean;
}

export interface BackgroundScheduler {
  schedule(task: () => void): void;
}

export interface DbApiOptions {
  cache: CacheOptions;
  pageSize: number;
  publicOnly: boolean;
  diagnostics: DiagnosticsOptions;
  logger?: Logger;
  fetch?: typeof fetch;
  background?: BackgroundScheduler;
}

export type DiagnosticsLevel = "debug" | "info" | "warn" | "error";

export interface DiagnosticsReport {
  repo: string;
  version: string;
  traceId: string;
  env: { userAgent?: string; platform?: string };
  options: Record<string, unknown>;
  timeline: Array<{ t: number; name: string; meta?: Record<string, unknown> }>;
  events: Array<{ level: DiagnosticsLevel; name: string; meta?: Record<string, unknown> }>;
  snapshots?: Array<{ name: string; at: string; data: Record<string, unknown> }>;
  artifacts: { notes?: string[]; samples?: Record<string, unknown>[]; traces?: Record<string, unknown>[] };
  errors?: Array<{ code: string; message: string; cause?: string }>;
}

export interface DiagnosticsSession {
  enabled: boolean;
  startedAt: number;
  report: DiagnosticsReport;
}

export interface QueryPlan {
  table: string;
  select: string;
  filters: Array<{ field: string; op: string; value: unknown }>;
  order?: { column: string; ascending: boolean };
  range?: { from: number; to: number };
  limit?: number;
}

export interface RepositoryContext {
  cache: CacheOptions & { adapter: CacheAdapter };
  diagnostics: DiagnosticsSession;
  logger?: Logger;
  pageSize: number;
  publicOnly: boolean;
  appId: string;
  supabase: SupabaseClientLike;
  background: BackgroundScheduler;
}

export interface SupabaseQueryResult<T> {
  data: T | null;
  error: { message: string } | null;
}

export interface SupabaseQueryBuilder<T> {
  select(columns: string): SupabaseQueryBuilder<T>;
  eq(column: string, value: unknown): SupabaseQueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilder<T>;
  range(from: number, to: number): SupabaseQueryBuilder<T>;
  limit(count: number): SupabaseQueryBuilder<T>;
  single(): Promise<SupabaseQueryResult<T>>;
  maybeSingle(): Promise<SupabaseQueryResult<T>>;
  then<TResult1 = SupabaseQueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseQueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

export interface SupabaseClientLike {
  from(table: string): any;
}
