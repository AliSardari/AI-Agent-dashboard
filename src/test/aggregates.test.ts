import { describe, expect, it } from "vitest";
import { percentChange, signedPercent, summarize } from "../lib/aggregates";
import {
  getDailyUsage,
  getModels,
  getRecentRequests,
  getUsageByModel,
  type DailyUsage,
} from "../data/usage";

const row = (overrides: Partial<DailyUsage>): DailyUsage => ({
  date: 0,
  inputTokens: 1_000,
  outputTokens: 500,
  cost: 1,
  requests: 10,
  errors: 1,
  p50LatencyMs: 400,
  ...overrides,
});

describe("summarize", () => {
  it("totals tokens, cost and requests and derives the error rate", () => {
    const summary = summarize([
      row({}),
      row({ inputTokens: 3_000, outputTokens: 1_000, cost: 3, requests: 30, errors: 4, p50LatencyMs: 600 }),
    ]);

    expect(summary.tokens).toBe(5_500);
    expect(summary.cost).toBe(4);
    expect(summary.requests).toBe(40);
    expect(summary.errorRate).toBeCloseTo(5 / 40);
    expect(summary.latencyMs).toBe(500);
  });

  it("does not divide by zero on an empty window", () => {
    expect(summarize([]).errorRate).toBe(0);
  });
});

describe("percentChange / signedPercent", () => {
  it("returns the relative change", () => {
    expect(percentChange(120, 100)).toBeCloseTo(0.2);
    expect(percentChange(80, 100)).toBeCloseTo(-0.2);
    expect(percentChange(5, 0)).toBe(0);
  });

  it("signs the formatted value", () => {
    expect(signedPercent(0.186, "en-US")).toBe("+18.6%");
    expect(signedPercent(-0.186, "en-US")).toBe("-18.6%");
  });
});

describe("demo data", () => {
  it("is deterministic for the same window", () => {
    expect(getDailyUsage(30)).toEqual(getDailyUsage(30));
    expect(getModels()).toEqual(getModels());
  });

  it("agrees across window lengths — overlapping days are identical", () => {
    const long = getDailyUsage(90);
    const short = getDailyUsage(30);
    expect(long.slice(-30)).toEqual(short);
    expect(getDailyUsage(180).slice(-90)).toEqual(getDailyUsage(90));
  });

  it("returns one row per day, oldest first", () => {
    const daily = getDailyUsage(30);
    expect(daily).toHaveLength(30);
    for (let i = 1; i < daily.length; i++) {
      expect(daily[i]?.date).toBeGreaterThan(daily[i - 1]!.date);
    }
  });

  it("distributes spend across models to roughly 100%", () => {
    const models = getModels();
    const total = models.reduce((sum, model) => sum + model.share, 0);
    expect(total).toBeCloseTo(1, 5);
    expect(models.every((model) => model.share > 0)).toBe(true);
  });

  it("splits spend by model in descending order", () => {
    const usage = getUsageByModel(30);
    const costs = usage.map((entry) => entry.cost);
    expect(costs).toEqual([...costs].sort((a, b) => b - a));
    expect(usage).toHaveLength(getModels().length);
  });

  it("produces newest-first requests with valid statuses", () => {
    const rows = getRecentRequests(40);
    expect(rows).toHaveLength(40);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]?.timestamp).toBeLessThanOrEqual(rows[i - 1]!.timestamp);
    }
    expect(rows.every((row) => ["success", "error", "limited"].includes(row.status))).toBe(true);
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
  });
});
