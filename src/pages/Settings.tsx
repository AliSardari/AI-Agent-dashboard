import { Languages, Moon, Sun } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { SegmentedControl } from "../components/ui/Controls";
import { useI18n } from "../i18n/i18n-context";
import { useTheme } from "../theme/theme-context";

const STACK = [
  "React 19",
  "TypeScript",
  "Vite 6",
  "Tailwind CSS v4",
  "Recharts",
  "Vitest",
];

export function Settings() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("settings.title")}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
                {t("settings.appearance")}
              </span>
            }
            hint={t("settings.appearanceDesc")}
            className="px-0 pt-0"
          />
          <div className="px-5 pb-5 pt-4">
            <SegmentedControl
              ariaLabel={t("settings.appearance")}
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: t("theme.light") },
                { value: "dark", label: t("theme.dark") },
              ]}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <Languages size={15} />
                {t("settings.language")}
              </span>
            }
            hint={t("settings.languageDesc")}
            className="px-0 pt-0"
          />
          <div className="px-5 pb-5 pt-4">
            <SegmentedControl
              ariaLabel={t("settings.language")}
              value={locale}
              onChange={setLocale}
              options={[
                { value: "en", label: t("lang.en") },
                { value: "fa", label: t("lang.fa") },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t("settings.about")}
          hint={t("settings.storage")}
          className="px-0 pt-0"
        />
        <dl className="grid gap-x-8 gap-y-3 px-5 pb-5 pt-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-2 dark:border-zinc-800/70">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("settings.version")}
            </dt>
            <dd className="text-sm font-medium tabular-nums text-zinc-800 dark:text-zinc-200">
              {__APP_VERSION__}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-2 dark:border-zinc-800/70">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("app.demo")}
            </dt>
            <dd className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {t("common.demoNotice")}
            </dd>
          </div>
          <div className="col-span-full pt-1">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("settings.stack")}
            </dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {STACK.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
