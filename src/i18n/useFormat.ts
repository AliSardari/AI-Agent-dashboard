import { useMemo } from "react";
import { useI18n } from "./i18n-context";
import {
  formatCompact,
  formatCurrency,
  formatDate,
  formatMilliseconds,
  formatNumber,
  formatPercent,
  formatRelative,
  formatShortDate,
} from "../lib/format";

/** Binds the pure formatters in lib/format to the active locale. */
export function useFormat() {
  const { intlLocale } = useI18n();

  return useMemo(
    () => ({
      number: (value: number, options?: Intl.NumberFormatOptions) =>
        formatNumber(value, intlLocale, options),
      compact: (value: number) => formatCompact(value, intlLocale),
      currency: (value: number) => formatCurrency(value, intlLocale),
      percent: (ratio: number, digits?: number) =>
        formatPercent(ratio, intlLocale, digits),
      ms: (value: number) => formatMilliseconds(value, intlLocale),
      date: (value: Date | number, options?: Intl.DateTimeFormatOptions) =>
        formatDate(value, intlLocale, options),
      shortDate: (value: Date | number) => formatShortDate(value, intlLocale),
      relative: (value: number, now: number) =>
        formatRelative(value, now, intlLocale),
    }),
    [intlLocale],
  );
}
