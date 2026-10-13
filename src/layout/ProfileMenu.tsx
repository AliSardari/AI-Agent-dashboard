import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../auth/auth-context";
import { useI18n } from "../i18n/i18n-context";
import { initials } from "../lib/format";
import { cn } from "../lib/cn";

function MenuRow({
  to,
  icon: Icon,
  children,
  onNavigate,
  danger,
}: {
  to: string;
  icon: LucideIcon;
  children: ReactNode;
  onNavigate: () => void;
  danger?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      role="menuitem"
      className={cn(
        "flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
        danger
          ? "text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
          : "text-zinc-700 dark:text-zinc-300",
      )}
    >
      <Icon size={15} aria-hidden className="shrink-0 opacity-70" />
      {children}
    </Link>
  );
}

/** Avatar button in the header — opens the account menu. */
export function ProfileMenu() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.accountMenu")}
        title={user ? user.name : t("nav.accountMenu")}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-xs font-semibold text-white transition-transform hover:scale-105"
      >
        {user ? initials(user.name) : <UserRound size={16} aria-hidden />}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("nav.accountMenu")}
          className="absolute end-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          {user ? (
            <>
              <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/60">
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  {t("auth.signedInAs")}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {user.name}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              </div>
              <div className="py-1">
                <MenuRow
                  to="/profile"
                  icon={CircleUserRound}
                  onNavigate={close}
                >
                  {t("nav.profile")}
                </MenuRow>
                <MenuRow to="/settings" icon={Settings} onNavigate={close}>
                  {t("nav.settings")}
                </MenuRow>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    signOut();
                    close();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-start text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <LogOut size={15} aria-hidden className="shrink-0 opacity-70" />
                  {t("auth.signOut")}
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <MenuRow to="/login" icon={LogIn} onNavigate={close}>
                {t("auth.signInCta")}
              </MenuRow>
              <MenuRow to="/register" icon={UserPlus} onNavigate={close}>
                {t("auth.signUpCta")}
              </MenuRow>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
