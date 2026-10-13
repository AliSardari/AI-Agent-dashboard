import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext, type I18nValue } from "./i18n-context";
import {
  dictionaries,
  type Locale,
  type TranslationKey,
} from "./translations";

const STORAGE_KEY = "aud.lang";

const INTL_LOCALE: Record<Locale, string> = { en: "en-US", fa: "fa-IR" };

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fa" || stored === "en") return stored;
  } catch {
    /* storage unavailable */
  }
  return "en";
}

function interpolate(
  template: string,
  params?: Record<string, string>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    params[name] ?? match,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readInitialLocale);

  const dir: I18nValue["dir"] = locale === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable */
    }
  }, [locale, dir]);

  const setLocaleSafe = useCallback(
    (next: Locale) => setLocale(next),
    [],
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir,
      setLocale: setLocaleSafe,
      intlLocale: INTL_LOCALE[locale],
      t: (key: TranslationKey, params?: Record<string, string>) =>
        interpolate(dictionaries[locale][key], params),
    }),
    [locale, dir, setLocaleSafe],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
