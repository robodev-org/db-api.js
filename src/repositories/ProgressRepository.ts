import type { QueryPlan, RepositoryContext, SupabaseQueryResult } from "../types";
import { fetchWithCache } from "./repositoryUtils";
import { recordTimeline } from "../diagnostics/diagnostics";
import { cloneQueryPlan } from "../utils";

export interface ProgressListOptions {
  table: string;
  select?: string;
  filters?: Array<{ field: string; op: "eq"; value: unknown }>;
  page?: number;
  pageSize?: number;
  order?: { column: string; ascending?: boolean };
}

export class ProgressRepository {
  constructor(private readonly context: RepositoryContext) {}

  async list<T>(options: ProgressListOptions): Promise<T[]> {
    const select = options.select ?? "*";
    const pageSize = options.pageSize ?? this.context.pageSize;
    const page = options.page ?? 1;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const filters = options.filters ?? [];

    const plan: QueryPlan = {
      table: options.table,
      select,
      filters,
      order: options.order ? { column: options.order.column, ascending: options.order.ascending ?? true } : undefined,
      range: { from, to }
    };

    recordTimeline(this.context.diagnostics, "query.build", { plan: cloneQueryPlan(plan) });

    const fetcher = async (): Promise<SupabaseQueryResult<T[]>> => {
      let query = this.context.supabase.from(options.table).select(select).range(from, to);
      for (const filter of filters) {
        query = query.eq(filter.field, filter.value);
      }
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
      }
      const result = await query;
      return result as SupabaseQueryResult<T[]>;
    };

    const response = await fetchWithCache<T[]>(
      this.context,
      `progress:${options.table}`,
      { select, filters, page, pageSize, order: options.order },
      plan,
      fetcher
    );

    return response.data;
  }
}
