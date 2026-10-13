import { describe, expect, it } from "vitest";
import {
  formatCompact,
  formatCurrency,
  formatMilliseconds,
  formatPercent,
  formatRelative,
} from "../lib/format";

describe("formatCurrency", () => {
  it("uses two decimals below ten and none above", () => {
    expect(formatCurrency(0, "en-US")).toBe("$0.00");
    expect(formatCurrency(4.25, "en-US")).toBe("$4.25");
    expect(formatCurrency(1234.5, "en-US")).toBe("$1,235");
  });

  it("keeps sub-cent request costs readable", () => {
    expect(formatCurrency(0.00042, "en-US")).toBe("$0.0004");
  });

  it("renders Persian digits in fa-IR", () => {
    expect(formatCurrency(1234, "fa-IR")).toBe("$۱٬۲۳۴");
  });
});

describe("formatCompact", () => {
  it("abbreviates large numbers", () => {
    expect(formatCompact(1_250_000, "en-US")).toBe("1.25M");
    expect(formatCompact(88_000, "en-US")).toBe("88K");
    expect(formatCompact(400, "en-US")).toBe("400");
  });

  it("translates the scale for Persian", () => {
    expect(formatCompact(22_000_000, "fa-IR")).toContain("۲۲");
    expect(formatCompact(22_000_000, "fa-IR")).toContain("میلیون");
  });
});

describe("formatRelative", () => {
  it("picks the largest sensible unit", () => {
    const now = 1_700_000_000_000;
    expect(formatRelative(now - 5 * 60_000, now, "en-US")).toBe("5 minutes ago");
    expect(formatRelative(now - 3 * 3_600_000, now, "en-US")).toBe(
      "3 hours ago",
    );
    expect(formatRelative(now - 6 * 86_400_000, now, "en-US")).toBe(
      "6 days ago",
    );
  });
});

describe("formatPercent / formatMilliseconds", () => {
  it("formats ratios as percentages", () => {
    expect(formatPercent(0.0234, "en-US")).toBe("2.3%");
    expect(formatPercent(0.9725, "en-US", 2)).toBe("97.25%");
  });

  it("formats latency", () => {
    expect(formatMilliseconds(567.4, "en-US")).toBe("567 ms");
    expect(formatMilliseconds(567.4, "fa-IR")).toContain("ms");
  });
});
