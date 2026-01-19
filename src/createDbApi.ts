import { createClient } from "@supabase/supabase-js";
import { assert, DbApiError } from "./errors";
import type { DbApiConfig, DbApiOptions, RepositoryContext } from "./types";
import { createDefaultBackgroundScheduler, resolveDbApiOptions } from "./options";
import { InMemoryCacheAdapter } from "./cache/InMemoryCacheAdapter";
import { ContentRepository } from "./repositories/ContentRepository";
import { ProfileRepository } from "./repositories/ProfileRepository";
import { ProgressRepository } from "./repositories/ProgressRepository";
import {
  createDiagnosticsSession,
  recordEvent,
  recordTimeline
} from "./diagnostics/diagnostics";
import { VERSION } from "./version";

export interface DbApiClient {
  content: ContentRepository;
  profiles: ProfileRepository;
  progress: ProgressRepository;
  diagnostics: {
    session: ReturnType<typeof createDiagnosticsSession>;
  };
}

export function createDbApi(config: DbApiConfig, options?: Partial<DbApiOptions>): DbApiClient {
  assert(!!config?.supabaseUrl, "ERR_INVALID_CONFIG", "supabaseUrl is required.");
  assert(!!config?.anonKey, "ERR_INVALID_CONFIG", "anonKey is required.");
  assert(!!config?.appId, "ERR_INVALID_CONFIG", "appId is required.");

  const resolved = resolveDbApiOptions(options);

  const diagnostics = createDiagnosticsSession({
    enabled: resolved.diagnostics.enabled,
    version: VERSION,
    resolvedOptions: {
      cache: {
        enabled: resolved.cache.enabled,
        ttlSeconds: resolved.cache.ttlSeconds,
        staleWhileRevalidate: resolved.cache.staleWhileRevalidate
      },
      pageSize: resolved.pageSize,
      publicOnly: resolved.publicOnly,
      diagnostics: resolved.diagnostics
    }
  });

  const cacheAdapter = resolved.cache.adapter ?? new InMemoryCacheAdapter();
  const cache = { ...resolved.cache, adapter: cacheAdapter };
  const background = resolved.background ?? createDefaultBackgroundScheduler();

  let supabase;
  try {
    supabase = createClient(config.supabaseUrl, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          "x-app-id": config.appId
        },
        fetch: resolved.fetch
      }
    });
  } catch (error) {
    throw new DbApiError("ERR_SUPABASE_INIT", "Failed to initialize Supabase client.", String(error));
  }

  const context: RepositoryContext = {
    cache,
    diagnostics,
    logger: resolved.logger,
    pageSize: resolved.pageSize,
    publicOnly: resolved.publicOnly,
    appId: config.appId,
    supabase,
    background
  };

  recordTimeline(diagnostics, "client.init");
  recordEvent(diagnostics, "info", "rls.assumed", {
    note: "Row Level Security enforced server-side; client assumes hostile usage."
  });

  return {
    content: new ContentRepository(context),
    profiles: new ProfileRepository(context),
    progress: new ProgressRepository(context),
    diagnostics: { session: diagnostics }
  };
}

export { DEFAULT_DB_API_OPTIONS } from "./options";
export { resolveDbApiOptions } from "./options";
