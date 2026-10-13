import { describe, expect, it } from "vitest";
import { dictionaries, en, fa } from "../i18n/translations";

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

describe("translations", () => {
  it("defines exactly the same keys in both locales", () => {
    expect(Object.keys(fa).sort()).toEqual(Object.keys(en).sort());
  });

  it("never renders an empty label", () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${locale}:${key}`).not.toBe("");
      }
    }
  });

  it("uses the same interpolation placeholders in both locales", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(placeholders(fa[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it("keeps Persian strings actually Persian", () => {
    const latinOnly = /^[A-Za-z0-9\s\-—–/.%$]+$/;
    const translated = Object.entries(fa).filter(
      ([key, value]) => !key.startsWith("lang.") && latinOnly.test(value),
    );
    expect(translated).toEqual([]);
  });
});
