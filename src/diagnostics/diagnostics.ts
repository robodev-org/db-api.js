import type { DiagnosticsReport, DiagnosticsSession, DiagnosticsLevel } from "../types";
import { DbApiError } from "../errors";

const REPO_NAME = "db-api";

function envInfo(): { userAgent?: string; platform?: string } {
  const env: { userAgent?: string; platform?: string } = {};
  if (typeof navigator !== "undefined") {
    if (typeof navigator.userAgent === "string") env.userAgent = navigator.userAgent;
    if (typeof navigator.platform === "string") env.platform = navigator.platform;
  }
  return env;
}

function randomTraceId(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let hex = "";
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, "0");
  }
  if (/^0+$/.test(hex)) {
    return randomTraceId();
  }
  return hex;
}

export function createDiagnosticsSession(options: {
  enabled: boolean;
  version: string;
  resolvedOptions: Record<string, unknown>;
}): DiagnosticsSession {
  return {
    enabled: options.enabled,
    startedAt: Date.now(),
    report: {
      repo: REPO_NAME,
      version: options.version,
      traceId: randomTraceId(),
      env: envInfo(),
      options: options.resolvedOptions,
      timeline: [],
      events: [],
      artifacts: {}
    }
  };
}

export function recordTimeline(
  session: DiagnosticsSession,
  name: string,
  meta?: Record<string, unknown>
): void {
  if (!session.enabled) return;
  session.report.timeline.push({
    t: Date.now() - session.startedAt,
    name,
    meta
  });
}

export function recordEvent(
  session: DiagnosticsSession,
  level: DiagnosticsLevel,
  name: string,
  meta?: Record<string, unknown>
): void {
  if (!session.enabled) return;
  session.report.events.push({ level, name, meta });
}

export function recordSnapshot(
  session: DiagnosticsSession,
  name: string,
  data: Record<string, unknown>
): void {
  if (!session.enabled) return;
  if (!session.report.snapshots) {
    session.report.snapshots = [];
  }
  session.report.snapshots.push({ name, at: new Date().toISOString(), data });
}

export function recordError(
  session: DiagnosticsSession,
  error: { code: string; message: string; cause?: string }
): void {
  if (!session.enabled) return;
  if (!session.report.errors) {
    session.report.errors = [];
  }
  session.report.errors.push(error);
}

export function finalizeDiagnosticsReport(session: DiagnosticsSession): DiagnosticsReport {
  if (!session.report.traceId) {
    throw new DbApiError("ERR_INVALID_CONFIG", "Diagnostics session missing traceId.");
  }
  return session.report;
}
