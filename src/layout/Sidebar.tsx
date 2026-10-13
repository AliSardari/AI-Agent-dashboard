import { NavLink, useLocation } from "react-router-dom";
import { ChevronsLeft } from "lucide-react";
import { navSections } from "../navigation";
import { SidebarAuthCard } from "../components/auth/SidebarAuthCard";
import { useI18n } from "../i18n/i18n-context";
import { cn } from "../lib/cn";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-2.5",
        collapsed && "lg:justify-center lg:gap-0",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 dark:bg-zinc-900">
        <svg viewBox="0 0 32 32" aria-hidden className="size-5">
          <path
            d="M5 22 12 13l5 5.5L21.5 10 27 16.5"
            fill="none"
            stroke="url(#logo-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="5" y1="22" x2="27" y2="10">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span
        className={cn(
          "min-w-0 leading-tight",
          collapsed && "lg:hidden",
        )}
      >
        <span className="block truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Usage
        </span>
        <span className="block truncate text-[11px] text-zinc-400 dark:text-zinc-500">
          dashboard
        </span>
      </span>
    </div>
  );
}

export function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onMobileClose,
}: SidebarProps) {
  const { t, dir } = useI18n();
  const { pathname } = useLocation();
  // The chevron always points toward the rail — left in LTR, right in RTL —
  // so flipping it 180° communicates "collapse" vs "expand" in both directions.
  const chevronFlipped = dir === "rtl" ? !isCollapsed : isCollapsed;

  return (
    <aside
      data-sidebar-state={isMobileOpen ? "open" : "closed"}
      className={cn(
        "sidebar fixed inset-y-0 start-0 z-50 flex w-66 flex-col border-e border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-900",
        // On desktop the rail is sticky: always exactly one viewport tall so it
        // never scrolls away with the (taller) main column. Its nav scrolls
        // internally instead.
        "lg:sticky lg:top-0 lg:bottom-auto lg:z-auto lg:h-screen lg:transition-[width] lg:duration-200",
        isCollapsed && "lg:w-19",
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-100 px-2 dark:border-zinc-800/60">
        <Logo collapsed={isCollapsed} />
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? t("nav.expand") : t("nav.collapse")}
          title={isCollapsed ? t("nav.expand") : t("nav.collapse")}
          className="hidden size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:inline-flex"
        >
          <ChevronsLeft
            size={16}
            aria-hidden
            className={cn(
              "transition-transform duration-200 ease-out motion-reduce:transition-none",
              chevronFlipped && "rotate-180",
            )}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.titleKey} className="mb-5 last:mb-0">
            <p
              className={cn(
                "px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500",
                isCollapsed && "lg:hidden",
              )}
            >
              {t(section.titleKey)}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onMobileClose}
                      title={isCollapsed ? t(item.labelKey) : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors",
                        isCollapsed && "lg:justify-center lg:px-0 lg:gap-0",
                        active
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-brand-500 transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon size={18} className="shrink-0" aria-hidden />
                      <span className={cn("truncate", isCollapsed && "lg:hidden")}>
                        {t(item.labelKey)}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={cn(
          "shrink-0 space-y-3 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800/60",
          isCollapsed && "lg:px-2",
        )}
      >
        <SidebarAuthCard collapsed={isCollapsed} />
        <p
          className={cn(
            "text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400",
            isCollapsed && "lg:hidden",
          )}
        >
          {t("common.demoNotice")}
        </p>
      </div>
    </aside>
  );
}
