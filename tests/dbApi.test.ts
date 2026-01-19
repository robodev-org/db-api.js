import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  createDbApi,
  resolveDbApiOptions,
  finalizeDiagnosticsReport,
  recordSnapshot
} from "../src";
import { createSupabaseMock } from "./mockSupabase";
import { DiagnosticsProbe, withProbe } from "./probe";
import { InMemoryCacheAdapter } from "../src";
import { stableStringify } from "../src/utils";

const supabaseMock = createSupabaseMock();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => supabaseMock
}));

beforeEach(() => {
  supabaseMock.reset();
});

describe("defaults resolution", () => {
  it("applies mandatory defaults", () => {
    const options = resolveDbApiOptions({});
    expect(options.cache.enabled).toBe(true);
    expect(options.cache.ttlSeconds).toBe(300);
    expect(options.cache.staleWhileRevalidate).toBe(true);
    expect(options.pageSize).toBe(20);
    expect(options.publicOnly).toBe(true);
  });

  it("documents defaults in README", () => {
    const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
    expect(readme).toContain("cache.enabled | true");
    expect(readme).toContain("cache.ttlSeconds | 300");
    expect(readme).toContain("cache.staleWhileRevalidate | true");
    expect(readme).toContain("pageSize | 20");
    expect(readme).toContain("publicOnly | true");
  });
});

describe("behavior coverage", () => {
  it("records events, timeline, snapshots for content list", async () => {
    const probe = new DiagnosticsProbe(
      "behavior-content-list",
      { diagnostics: { enabled: true, includeSamples: false } },
      supabaseMock
    );
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );
    probe.session = api.diagnostics.session;

    supabaseMock.enqueueResponse({ data: [{ id: 1 }], error: null });
    await withProbe(probe, async () => {
      await probe.run("list", async () => {
        recordSnapshot(api.diagnostics.session, "before.list", { table: "content" });
        await api.content.list({ table: "content" });
        recordSnapshot(api.diagnostics.session, "after.list", { ok: true });
      });
    });

    const report = finalizeDiagnosticsReport(api.diagnostics.session);
    const eventNames = report.events.map((event) => event.name);
    const timelineNames = report.timeline.map((entry) => entry.name);
    const snapshotNames = report.snapshots?.map((snap) => snap.name) ?? [];
    const traceMethods = probe.capture.callTrace.map((call) => call.method);

    expect(eventNames).toContain("cache.miss");
    expect(eventNames).toContain("filter.publishedOnly.applied");
    expect(timelineNames).toContain("query.build");
    expect(timelineNames).toContain("query.execute");
    expect(timelineNames).toContain("query.complete");
    expect(snapshotNames).toContain("before.list");
    expect(snapshotNames).toContain("after.list");
    expect(traceMethods).toContain("from");
    expect(traceMethods).toContain("select");
    expect(traceMethods).toContain("range");
    expect(traceMethods).toContain("eq");
  });
});

describe("negative tests", () => {
  it("throws on missing config", () => {
    expect(() => createDbApi({ supabaseUrl: "", anonKey: "", appId: "" })).toThrow(
      "supabaseUrl is required"
    );
  });

  it("captures timeout errors", async () => {
    const probe = new DiagnosticsProbe(
      "timeout",
      { diagnostics: { enabled: true, includeSamples: false } },
      supabaseMock
    );
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );
    probe.session = api.diagnostics.session;

    supabaseMock.enqueueResponse({ data: null, error: null, timeout: true });

    await expect(
      withProbe(probe, async () => {
        await probe.run("timeout", async () => {
          await api.content.list({ table: "content" });
        });
      })
    ).rejects.toThrow("Timeout");

    const report = finalizeDiagnosticsReport(api.diagnostics.session);
    expect(report.events.map((event) => event.name)).toContain("query.exception");
    expect(report.errors?.[0]?.code).toBe("ERR_QUERY_FAILED");
  });

  it("captures abort errors", async () => {
    const probe = new DiagnosticsProbe(
      "abort",
      { diagnostics: { enabled: true, includeSamples: false } },
      supabaseMock
    );
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );
    probe.session = api.diagnostics.session;

    supabaseMock.enqueueResponse({ data: null, error: null, abort: true });

    await expect(
      withProbe(probe, async () => {
        await probe.run("abort", async () => {
          await api.content.list({ table: "content" });
        });
      })
    ).rejects.toThrow("Aborted");

    const report = finalizeDiagnosticsReport(api.diagnostics.session);
    expect(report.events.map((event) => event.name)).toContain("query.exception");
  });

  it("captures truncation errors", async () => {
    const probe = new DiagnosticsProbe(
      "truncation",
      { diagnostics: { enabled: true, includeSamples: false } },
      supabaseMock
    );
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );
    probe.session = api.diagnostics.session;

    supabaseMock.enqueueResponse({ data: [{ id: 1 }], error: null, truncated: true });

    await expect(
      withProbe(probe, async () => {
        await probe.run("truncation", async () => {
          await api.content.list({ table: "content" });
        });
      })
    ).rejects.toThrow("TRUNCATED");

    const report = finalizeDiagnosticsReport(api.diagnostics.session);
    expect(report.events.map((event) => event.name)).toContain("query.failed");
  });

  it("captures partial output errors", async () => {
    const probe = new DiagnosticsProbe(
      "partial-output",
      { diagnostics: { enabled: true, includeSamples: false } },
      supabaseMock
    );
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );
    probe.session = api.diagnostics.session;

    supabaseMock.enqueueResponse({ data: [{ id: 1 }], error: { message: "PARTIAL" } });

    await expect(
      withProbe(probe, async () => {
        await probe.run("partial", async () => {
          await api.content.list({ table: "content" });
        });
      })
    ).rejects.toThrow("PARTIAL");

    const report = finalizeDiagnosticsReport(api.diagnostics.session);
    expect(report.errors?.[0]?.message).toBe("PARTIAL");
  });

  it("simulates delayed responses without network", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    try {
      const api = createDbApi(
        { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
        { diagnostics: { enabled: true, includeSamples: false } }
      );
      supabaseMock.enqueueResponse({ data: [{ id: 1 }], error: null, delayMs: 50 });

      const promise = api.content.list<{ id: number }>({ table: "content" });
      await vi.advanceTimersByTimeAsync(50);
      const result = await promise;
      expect(result[0]?.id).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("ordering tests", () => {
  it("maintains query lifecycle order", async () => {
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );
    supabaseMock.enqueueResponse({ data: [{ id: 1 }], error: null });

    await api.content.list({ table: "content" });

    const report = finalizeDiagnosticsReport(api.diagnostics.session);
    const names = report.timeline.map((entry) => entry.name);
    const buildIndex = names.indexOf("query.build");
    const executeIndex = names.indexOf("query.execute");
    const completeIndex = names.indexOf("query.complete");
    const events = report.events.map((event) => event.name);
    const missIndex = events.indexOf("cache.miss");
    const setIndex = events.indexOf("cache.set");

    expect(buildIndex).toBeGreaterThan(-1);
    expect(executeIndex).toBeGreaterThan(buildIndex);
    expect(completeIndex).toBeGreaterThan(executeIndex);
    expect(missIndex).toBeGreaterThan(-1);
    expect(setIndex).toBeGreaterThan(missIndex);
  });
});

describe("resource tests", () => {
  it("sweep releases expired cache entries", () => {
    const adapter = new InMemoryCacheAdapter();
    adapter.set("a", { value: 1, createdAt: 0, expiresAt: 1, staleUntil: 2 });
    adapter.set("b", { value: 2, createdAt: 0, expiresAt: 100, staleUntil: 200 });

    adapter.sweep(5);

    expect(adapter.get("a")).toBeUndefined();
    expect(adapter.get("b")).toBeDefined();
  });
});

describe("performance smoke", () => {
  it("stableStringify runs within a loose threshold", () => {
    const start = Date.now();
    for (let i = 0; i < 5000; i += 1) {
      stableStringify({ a: i, b: { c: i + 1, d: [i, i + 2] } });
    }
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });
});

describe("contract tests", () => {
  it("public API shape is stable", () => {
    const api = createDbApi(
      { supabaseUrl: "https://example.supabase.co", anonKey: "anon", appId: "app" },
      { diagnostics: { enabled: true, includeSamples: false } }
    );

    expect(api.content).toBeDefined();
    expect(api.profiles).toBeDefined();
    expect(api.progress).toBeDefined();
    expect(api.diagnostics.session).toBeDefined();
  });
});
