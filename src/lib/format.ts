/**
 * Locale-aware formatters. Pure functions so they can be unit tested without a
 * React tree; `useFormat` in ../i18n/useFormat binds them to the active locale.
 */

const usd = (intlLocale: string, digits: number) =>
  new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export function formatNumber(
  value: number,
  intlLocale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(intlLocale, options).format(value);
}

/** 1_250_000 → "1.25M" / "۱٫۲۵ میلیون" */
export function formatCompact(value: number, intlLocale: string): string {
  return new Intl.NumberFormat(intlLocale, {
    notation: "compact",
    maximumSignificantDigits: 3,
  }).format(value);
}

/** Costs are always shown in USD; digits follow the locale (fa gets ۱٬۲۳۴). */
export function formatCurrency(value: number, intlLocale: string): string {
  const magnitude = Math.abs(value);
  const digits = magnitude === 0 ? 2 : magnitude < 0.01 ? 4 : magnitude < 10 ? 2 : 0;
  return `$${usd(intlLocale, digits).format(value)}`;
}

/** 0.0234 → "2.3%" */
export function formatPercent(
  ratio: number,
  intlLocale: string,
  digits = 1,
): string {
  return new Intl.NumberFormat(intlLocale, {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
}

export function formatMilliseconds(value: number, intlLocale: string): string {
  return `${formatNumber(Math.round(value), intlLocale)} ms`;
}

export function formatDate(
  date: Date | number,
  intlLocale: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}

/** "Ali Reza" → "AR" — fallback "؟"/"?" for empty names. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.charAt(0) ?? "";
  const last =
    words.length > 1 ? (words[words.length - 1]?.charAt(0) ?? "") : "";
  const mark = (first + last).toUpperCase();
  return mark || "?";
}

/** "3 hours ago" / "۳ ساعت پیش" — chart- and list-friendly relative time. */
export function formatRelative(
  date: number,
  now: number,
  intlLocale: string,
): string {
  const diff = date - now;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: "auto" });
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (abs < hour) return rtf.format(Math.round(diff / minute), "minute");
  if (abs < day) return rtf.format(Math.round(diff / hour), "hour");
  return rtf.format(Math.round(diff / day), "day");
}

/** Chart-friendly short date: "Oct 7" / "۷ اکتبر" */
export function formatShortDate(
  date: Date | number,
  intlLocale: string,
): string {
  return new Intl.DateTimeFormat(intlLocale, {
    month: "short",
    day: "numeric",
  }).format(date);
}
