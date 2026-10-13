import { useMemo } from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { IconButton, SegmentedControl } from "../components/ui/Controls";
import { Badge } from "../components/ui/Badge";
import { useI18n } from "../i18n/i18n-context";
import { useTheme } from "../theme/theme-context";
import { isApplePlatform } from "../lib/platform";
import { NotificationBell } from "./NotificationBell";
import { ProfileMenu } from "./ProfileMenu";
import type { TranslationKey } from "../i18n/translations";

interface HeaderProps {
  titleKey: TranslationKey;
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function Header({ titleKey, onMenuClick, onSearchClick }: HeaderProps) {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isApple = useMemo(() => isApplePlatform(), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 sm:gap-3 sm:px-6">
      <IconButton
        label={t("nav.menu")}
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu size={18} />
      </IconButton>

      <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-base">
        {t(titleKey)}
      </h1>

      <Badge tone="brand" className="hidden md:inline-flex">
        <span className="size-1.5 rounded-full bg-brand-500" aria-hidden />
        {t("app.demo")}
      </Badge>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onSearchClick}
        className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:text-zinc-300 md:flex"
      >
        <Search size={15} aria-hidden />
        <span className="flex-1 text-start">{t("action.jumpTo")}</span>
        <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          {isApple ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <IconButton
        label={t("action.search")}
        onClick={onSearchClick}
        className="md:hidden"
      >
        <Search size={18} />
      </IconButton>

      <SegmentedControl
        ariaLabel={t("action.toggleLanguage")}
        value={locale}
        onChange={setLocale}
        className="hidden sm:inline-flex"
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

      <NotificationBell />

      <ProfileMenu />
    </header>
  );
}
