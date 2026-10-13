import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "./CommandPalette";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { Spinner } from "../components/ui/Feedback";
import { navItems, miscNavItems } from "../navigation";
import { useI18n } from "../i18n/i18n-context";

const COLLAPSE_KEY = "aud.sidebar.collapsed";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Placeholder while a lazily loaded route chunk is fetched. */
function RouteLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}

export function AppLayout() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  const titleKey = useMemo(() => {
    const match = [...navItems, ...miscNavItems].find(
      (item) => item.path === pathname,
    );
    return match?.titleKey ?? "common.notFound";
  }, [pathname]);

  // Keep the document title in sync with the page and the active language.
  useEffect(() => {
    document.title = `${t(titleKey)} — ${t("app.name")}`;
  }, [t, titleKey]);

  // Any navigation closes the mobile drawer.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!isMobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileOpen]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={toggleCollapse}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          titleKey={titleKey}
          onMenuClick={() => setIsMobileOpen(true)}
          onSearchClick={openPalette}
        />

        <main className="mx-auto w-full max-w-400 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<RouteLoading />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onOpen={openPalette}
        onClose={closePalette}
      />
    </div>
  );
}
