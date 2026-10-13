import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../auth/auth-context";
import { useI18n } from "../../i18n/i18n-context";
import { initials } from "../../lib/format";
import { cn } from "../../lib/cn";

/** Bottom-of-sidebar account block: sign-in CTA when out, profile when in. */
export function SidebarAuthCard({ collapsed }: { collapsed: boolean }) {
  const { t } = useI18n();
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div
        className={cn(
          "space-y-2.5",
          collapsed && "lg:hidden",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-[11px] font-semibold text-white"
            title={`${user.name} — ${user.email}`}
          >
            {initials(user.name)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-100">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
              {t("auth.signedInAs")} · {user.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <LogOut size={14} aria-hidden className="rtl:-scale-x-100" />
          {t("auth.signOut")}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60",
        collapsed && "lg:hidden",
      )}
    >
      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
        {t("auth.cardTitle")}
      </p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t("auth.cardHint")}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to="/login"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-2 text-xs font-medium text-white transition-colors hover:bg-brand-500"
        >
          <LogIn size={14} className="rtl:-scale-x-100" aria-hidden />
          {t("auth.signInCta")}
        </Link>
        <Link
          to="/register"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {t("auth.signUpCta")}
        </Link>
      </div>
    </div>
  );
}
