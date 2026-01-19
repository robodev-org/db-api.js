import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { DbApiOptions, DiagnosticsSession } from "../src/types";
import { finalizeDiagnosticsReport, recordSnapshot, recordTimeline } from "../src";
import { resolveDbApiOptions } from "../src";
import type { MockSupabaseClient } from "./mockSupabase";

export type ProbeCapture = {
  resolvedOptions: DbApiOptions;
  callTrace: Array<{ t: number; method: string; args: unknown[] }>;
  outputs: unknown[];
  errors: unknown[];
};

export class DiagnosticsProbe {
  readonly testName: string;
  session: DiagnosticsSession;
  readonly capture: ProbeCapture;
  private readonly supabaseMock: MockSupabaseClient;

  constructor(testName: string, options: Partial<DbApiOptions> | undefined, supabaseMock: MockSupabaseClient) {
    this.testName = testName;
    this.capture = {
      resolvedOptions: resolveDbApiOptions(options),
      callTrace: [],
      outputs: [],
      errors: []
    };
    this.session = {
      enabled: false,
      startedAt: 0,
      report: {
        repo: "db-api",
        version: "test",
        traceId: "pending",
        env: {},
        options: {},
        timeline: [],
        events: [],
        artifacts: {}
      }
    };
    this.supabaseMock = supabaseMock;
  }

  snapshot(name: string, data: Record<string, unknown>): void {
    recordSnapshot(this.session, name, data);
  }

  timeline(name: string, meta?: Record<string, unknown>): void {
    recordTimeline(this.session, name, meta);
  }

  captureTrace(): void {
    this.capture.callTrace = this.supabaseMock.getTrace();
  }

  async run<T>(label: string, fn: () => Promise<T> | T): Promise<T> {
    this.snapshot("probe.before", { label });
    this.timeline("probe.start", { label });
    try {
      const result = await fn();
      this.capture.outputs.push(result);
      this.snapshot("probe.after", { label, ok: true });
      return result;
    } catch (error) {
      this.capture.errors.push(error);
      this.snapshot("probe.after", { label, ok: false });
      throw error;
    } finally {
      this.captureTrace();
      this.timeline("probe.end", { label });
    }
  }

  finalizeReport() {
    return finalizeDiagnosticsReport(this.session);
  }

  writeArtifacts(): void {
    const report = this.finalizeReport();
    const dir = join(process.cwd(), "tests", "artifacts");
    try {
      mkdirSync(dir, { recursive: true });
      const file = join(dir, `${this.testName}-${report.traceId}.json`);
      writeFileSync(file, JSON.stringify({ report, capture: this.capture }, null, 2), "utf8");
    } catch {
      // Best-effort; ignore write failures in restricted environments.
    }
  }
}

export async function withProbe<T>(probe: DiagnosticsProbe, fn: () => Promise<T>): Promise<T> {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    const report = probe.finalizeReport();
    console.error(JSON.stringify(report, null, 2));
    probe.writeArtifacts();
    throw error;
  }
}
