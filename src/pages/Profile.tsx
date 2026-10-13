import { Link } from "react-router-dom";
import { ArrowRight, LogIn, Settings } from "lucide-react";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/Feedback";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../auth/auth-context";
import { useI18n } from "../i18n/i18n-context";
import { useFormat } from "../i18n/useFormat";
import { initials } from "../lib/format";

export function Profile() {
  const { t } = useI18n();
  const fmt = useFormat();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("profile.title")}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t("profile.subtitle")}
        </p>
      </div>

      {user ? (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-4 p-6">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-lg font-semibold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {user.name}
              </p>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
            <Badge tone="brand" className="ms-auto">
              {t("app.demo")}
            </Badge>
          </div>

          <dl className="grid gap-x-8 gap-y-3 border-t border-zinc-100 px-6 py-5 sm:grid-cols-2 dark:border-zinc-800/60">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-2 dark:border-zinc-800/70">
              <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("auth.email")}
              </dt>
              <dd className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {user.email}
              </dd>
            </div>
            {typeof user.createdAt === "number" ? (
              <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-2 dark:border-zinc-800/70">
                <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("profile.memberSince")}
                </dt>
                <dd className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {fmt.date(user.createdAt)}
                </dd>
              </div>
            ) : null}
            <div className="col-span-full flex items-center justify-between gap-4 pt-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("settings.storage")}
              </p>
              <Link
                to="/settings"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10"
              >
                <Settings size={14} aria-hidden />
                {t("profile.openSettings")}
                <ArrowRight size={14} className="rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </dl>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={<LogIn size={20} />}
            title={t("profile.guest.title")}
            description={t("profile.guest.desc")}
            action={
              <div className="mt-3 flex gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-500"
                >
                  {t("auth.signInCta")}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {t("auth.signUpCta")}
                </Link>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
}
