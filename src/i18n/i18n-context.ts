import { createContext, useContext } from "react";
import type { Locale, TranslationKey } from "./translations";

export interface I18nValue {
  locale: Locale;
  /** "rtl" for Persian, "ltr" for English. */
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  /** Type-safe lookup — a missing key is a compile error, not a blank UI. */
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  /** BCP-47 tag handed to Intl, e.g. "fa-IR" / "en-US". */
  intlLocale: string;
}

export const I18nContext = createContext<I18nValue | null>(null);

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
