import type { QueryPlan, RepositoryContext, SupabaseQueryResult } from "../types";
import { fetchWithCache } from "./repositoryUtils";
import { recordTimeline } from "../diagnostics/diagnostics";
import { cloneQueryPlan } from "../utils";

export interface ProfileGetOptions {
  table: string;
  select?: string;
}

export class ProfileRepository {
  constructor(private readonly context: RepositoryContext) {}

  async getSelf<T>(options: ProfileGetOptions): Promise<T | null> {
    const select = options.select ?? "*";
    const plan: QueryPlan = {
      table: options.table,
      select,
      filters: [],
      limit: 1
    };

    recordTimeline(this.context.diagnostics, "query.build", { plan: cloneQueryPlan(plan) });

    const fetcher = async (): Promise<SupabaseQueryResult<T>> => {
      const query = this.context.supabase.from(options.table).select(select).limit(1);
      const result = await query.maybeSingle();
      return result as SupabaseQueryResult<T>;
    };

    const response = await fetchWithCache<T>(
      this.context,
      `profile:${options.table}`,
      { select },
      plan,
      fetcher
    );

    return response.data ?? null;
  }
}
