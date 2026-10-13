import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Languages, LogIn, LogOut, Moon, Search, Sun } from "lucide-react";
import { navItems, miscNavItems } from "../navigation";
import { useI18n } from "../i18n/i18n-context";
import { useTheme } from "../theme/theme-context";
import { useAuth } from "../auth/auth-context";
import { cn } from "../lib/cn";

interface CommandPaletteProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface Command {
  id: string;
  group: "navigate" | "actions";
  label: string;
  hint?: string;
  keywords: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  run: () => void;
}

export function CommandPalette({ isOpen, onOpen, onClose }: CommandPaletteProps) {
  const { t, locale, setLocale, dir } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Global shortcut: ⌘K / Ctrl+K anywhere, "/" when not typing.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
        return;
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActiveIndex(0);
      // Focus after paint so the dialog is in the DOM.
      const id = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
    restoreFocusRef.current?.focus?.();
  }, [isOpen]);

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = [...navItems, ...miscNavItems].map(
      (item) => ({
        id: `nav-${item.path}`,
        group: "navigate",
        label: t(item.labelKey),
        keywords: item.keywords,
        icon: item.icon,
        run: () => navigate(item.path),
      }),
    );

    const nextMode = theme === "dark" ? t("theme.light") : t("theme.dark");
    const actions: Command[] = [
      {
        id: "action-theme",
        group: "actions",
        label: t("theme.switchTo", { mode: nextMode }),
        keywords: "theme dark light تم روشن تاریک",
        icon: theme === "dark" ? Sun : Moon,
        run: toggleTheme,
      },
      {
        id: "action-lang",
        group: "actions",
        label: `${t("action.toggleLanguage")} — ${
          locale === "en" ? t("lang.fa") : t("lang.en")
        }`,
        keywords: "language fa en rtl زبان فارسی انگلیسی",
        icon: Languages,
        run: () => setLocale(locale === "en" ? "fa" : "en"),
      },
      user
        ? {
            id: "action-sign-out",
            group: "actions",
            label: t("auth.signOut"),
            keywords: "sign out logout exit خروج حساب",
            icon: LogOut,
            run: signOut,
          }
        : {
            id: "action-sign-in",
            group: "actions",
            label: t("auth.signInCta"),
            keywords: "sign in login auth account ورود حساب",
            icon: LogIn,
            run: () => navigate("/login"),
          },
    ];

    return [...navCommands, ...actions];
  }, [t, theme, locale, toggleTheme, setLocale, navigate, user, signOut]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.keywords}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  const grouped = useMemo(
    () => ({
      navigate: results.filter((command) => command.group === "navigate"),
      actions: results.filter((command) => command.group === "actions"),
    }),
    [results],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const allCommands = useMemo(
    () => [...grouped.navigate, ...grouped.actions],
    [grouped],
  );

  // Every hook above must run on both renders — bail out only after them.
  if (!isOpen) return null;

  function runCommand(command: Command) {
    onClose();
    // Run after the overlay unmounts so focus can move cleanly.
    window.setTimeout(command.run, 0);
  }

  function onKeyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "Tab") {
      // Trap focus inside the dialog: cycle through input + result buttons.
      const focusables = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>(
          "input, button:not([disabled])",
        ),
      );
      if (focusables.length === 0) return;
      event.preventDefault();
      const active = document.activeElement;
      const index =
        active instanceof HTMLElement ? focusables.indexOf(active) : -1;
      const offset = event.shiftKey ? -1 : 1;
      const next = (index + offset + focusables.length) % focusables.length;
      focusables[next]?.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(allCommands.length, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) =>
          (index - 1 + allCommands.length) % Math.max(allCommands.length, 1),
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = allCommands[activeIndex];
      if (command) runCommand(command);
    }
  }

  let flatIndex = -1;
  const renderGroup = (group: "navigate" | "actions", title: string) => {
    const items = grouped[group];
    if (items.length === 0) return null;
    return (
      <div className="p-2">
        <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {title}
        </p>
        <ul>
          {items.map((command) => {
            flatIndex += 1;
            const index = flatIndex;
            const active = index === activeIndex;
            const Icon = command.icon;
            return (
              <li key={command.id}>
                <button
                  type="button"
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => runCommand(command)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                      : "text-zinc-700 dark:text-zinc-300",
                  )}
                >
                  <Icon size={16} className="shrink-0 opacity-70" />
                  <span className="flex-1 truncate">{command.label}</span>
                  {active ? (
                    <CornerDownLeft
                      size={14}
                      className="shrink-0 opacity-60"
                      aria-hidden
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-zinc-950/50 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      data-testid="command-backdrop"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("cmd.title")}
        dir={dir}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-3 dark:border-zinc-800">
          <Search size={16} className="shrink-0 text-zinc-400" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("action.jumpTo")}
            aria-label={t("cmd.title")}
            className="h-12 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:border-zinc-700 sm:block">
            esc
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              {t("cmd.empty")}
            </p>
          ) : (
            <>
              {renderGroup("navigate", t("cmd.navigate"))}
              {renderGroup("actions", t("cmd.actions"))}
            </>
          )}
        </div>

        <div className="border-t border-zinc-100 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          {t("cmd.hint")}
        </div>
      </div>
    </div>
  );
}
