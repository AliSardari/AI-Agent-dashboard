import { useEffect, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { IconButton, SegmentedControl } from "../ui/Controls";
import { useI18n } from "../../i18n/i18n-context";
import { useTheme } from "../../theme/theme-context";

const FEATURES = ["auth.feature.1", "auth.feature.2", "auth.feature.3"] as const;

function BrandLogo() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
      <svg viewBox="0 0 32 32" aria-hidden className="size-6">
        <path
          d="M5 22 12 13l5 5.5L21.5 10 27 16.5"
          fill="none"
          stroke="url(#auth-logo-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="auth-logo-gradient" x1="5" y1="22" x2="27" y2="10">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

/** Full-screen split layout for the login/register pages. */
export function AuthShell({
  children,
  titleKey = "auth.signIn.title",
}: {
  children: ReactNode;
  titleKey?: "auth.signIn.title" | "auth.signUp.title";
}) {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();

  // Standalone pages don't render AppLayout, so they manage their own title.
  useEffect(() => {
    document.title = `${t(titleKey)} — ${t("app.name")}`;
  }, [t, titleKey]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-24 -top-24 size-80 rounded-full bg-brand-600/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -end-24 size-96 rounded-full bg-cyan-500/20 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <BrandLogo />
          <div>
            <p className="text-sm font-semibold tracking-tight">AI Usage</p>
            <p className="text-[11px] text-zinc-400">dashboard</p>
          </div>
        </div>

        <div className="relative max-w-sm space-y-6">
          <h2 className="text-2xl font-semibold leading-snug tracking-tight">
            {t("app.tagline")}
          </h2>
          <ul className="space-y-3">
            {FEATURES.map((key) => (
              <li key={key} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Check size={12} aria-hidden />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-zinc-500">{t("common.demoNotice")}</p>
      </aside>

      <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center justify-end gap-2 p-4 sm:p-6">
          <SegmentedControl
            ariaLabel={t("action.toggleLanguage")}
            value={locale}
            onChange={setLocale}
            options={[
              { value: "en", label: "EN", title: t("lang.en") },
              { value: "fa", label: "فا", title: t("lang.fa") },
            ]}
          />
          <IconButton
            label={`${t("action.toggleTheme")} — ${
              theme === "dark" ? t("theme.light") : t("theme.dark")
            }`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-20 sm:px-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
