import type { SupabaseQueryResult } from "../src/types";

export type MockResponse<T> = SupabaseQueryResult<T> & {
  delayMs?: number;
  abort?: boolean;
  timeout?: boolean;
  truncated?: boolean;
};

type QueryRecord = {
  table: string;
  select: string;
  filters: Array<{ field: string; op: string; value: unknown }>;
  order?: { column: string; ascending: boolean };
  range?: { from: number; to: number };
  limit?: number;
};

type CallTraceItem = {
  t: number;
  method: string;
  args: unknown[];
};

class MockQueryBuilder<T> {
  private record: QueryRecord;
  constructor(private readonly parent: MockSupabaseClient, table: string, initialSelect: string) {
    this.record = {
      table,
      select: initialSelect,
      filters: []
    };
  }

  select(columns: string): this {
    this.parent.trace("select", [columns]);
    this.record.select = columns;
    return this;
  }

  eq(column: string, value: unknown): this {
    this.parent.trace("eq", [column, value]);
    this.record.filters.push({ field: column, op: "eq", value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.parent.trace("order", [column, options]);
    this.record.order = { column, ascending: options?.ascending ?? true };
    return this;
  }

  range(from: number, to: number): this {
    this.parent.trace("range", [from, to]);
    this.record.range = { from, to };
    return this;
  }

  limit(count: number): this {
    this.parent.trace("limit", [count]);
    this.record.limit = count;
    return this;
  }

  async single(): Promise<SupabaseQueryResult<T>> {
    this.parent.capture(this.record);
    const result = await this.parent.consumeResponseAsync();
    return result as SupabaseQueryResult<T>;
  }

  async maybeSingle(): Promise<SupabaseQueryResult<T>> {
    this.parent.capture(this.record);
    const result = await this.parent.consumeResponseAsync();
    return result as SupabaseQueryResult<T>;
  }

  then<TResult1 = SupabaseQueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseQueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.parent.consumeResponseAsync().then(onfulfilled as any, onrejected as any);
  }
}

export class MockSupabaseClient {
  private responseQueue: MockResponse<unknown>[] = [];
  private lastQuery?: QueryRecord;
  private traceItems: CallTraceItem[] = [];

  from<T>(table: string): MockQueryBuilder<T> {
    this.trace("from", [table]);
    return new MockQueryBuilder<T>(this, table, "*");
  }

  enqueueResponse<T>(response: MockResponse<T>): void {
    this.responseQueue.push(response as MockResponse<unknown>);
  }

  async consumeResponseAsync(): Promise<SupabaseQueryResult<unknown>> {
    const response = this.responseQueue.shift() ?? { data: null, error: null };
    if (response.delayMs && response.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, response.delayMs));
    }
    if (response.abort) {
      const error = new Error("Aborted");
      (error as Error & { name: string }).name = "AbortError";
      throw error;
    }
    if (response.timeout) {
      const error = new Error("Timeout");
      (error as Error & { code?: string }).code = "ETIMEDOUT";
      throw error;
    }
    if (response.truncated && !response.error) {
      return { data: response.data ?? null, error: { message: "TRUNCATED" } };
    }
    return response as SupabaseQueryResult<unknown>;
  }

  capture(record: QueryRecord): void {
    this.lastQuery = record;
  }

  getLastQuery(): QueryRecord | undefined {
    return this.lastQuery;
  }

  trace(method: string, args: unknown[]): void {
    this.traceItems.push({ t: Date.now(), method, args });
  }

  getTrace(): CallTraceItem[] {
    return this.traceItems.slice();
  }

  reset(): void {
    this.responseQueue = [];
    this.lastQuery = undefined;
    this.traceItems = [];
  }
}

export function createSupabaseMock(): MockSupabaseClient {
  return new MockSupabaseClient();
}
