export type ErrorCode =
  | "ERR_INVALID_CONFIG"
  | "ERR_PUBLIC_ONLY_ENFORCED"
  | "ERR_CACHE_ADAPTER_INVALID"
  | "ERR_SUPABASE_INIT"
  | "ERR_QUERY_FAILED";

export class DbApiError extends Error {
  readonly code: ErrorCode;
  readonly cause?: string;

  constructor(code: ErrorCode, message: string, cause?: string) {
    super(message);
    this.name = "DbApiError";
    this.code = code;
    this.cause = cause;
  }

  toJSON(): { code: ErrorCode; message: string; cause?: string } {
    return { code: this.code, message: this.message, cause: this.cause };
  }
}

export function assert(condition: boolean, code: ErrorCode, message: string): asserts condition {
  if (!condition) {
    throw new DbApiError(code, message);
  }
}
