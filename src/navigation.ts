import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Boxes,
  ChartNoAxesCombined,
  CircleUserRound,
  ListChecks,
  Settings,
} from "lucide-react";
import type { TranslationKey } from "./i18n/translations";

export interface NavItem {
  path: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  /** Shown as the page title in the header. */
  titleKey: TranslationKey;
  /** Command palette keywords (English + Persian) so both locales match a query. */
  keywords: string;
}

export interface NavSection {
  titleKey: TranslationKey;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    titleKey: "nav.section.analytics",
    items: [
      {
        path: "/",
        labelKey: "nav.overview",
        titleKey: "overview.title",
        icon: ChartNoAxesCombined,
        keywords: "overview home dashboard نمای کلی خانه",
      },
      {
        path: "/models",
        labelKey: "nav.models",
        titleKey: "models.title",
        icon: Boxes,
        keywords: "models pricing provider مدل‌ها قیمت",
      },
      {
        path: "/requests",
        labelKey: "nav.requests",
        titleKey: "requests.title",
        icon: ListChecks,
        keywords: "requests logs activity درخواست‌ها گزارش",
      },
    ],
  },
  {
    titleKey: "nav.section.workspace",
    items: [
      {
        path: "/settings",
        labelKey: "nav.settings",
        titleKey: "settings.title",
        icon: Settings,
        keywords: "settings preferences language theme تنظیمات زبان تم",
      },
    ],
  },
];

export const navItems: NavItem[] = navSections.flatMap((section) => section.items);

/**
 * Pages reachable from the header (profile menu / bell) rather than the
 * sidebar — still needed for header titles and the command palette.
 */
export const miscNavItems: NavItem[] = [
  {
    path: "/profile",
    labelKey: "nav.profile",
    titleKey: "profile.title",
    icon: CircleUserRound,
    keywords: "profile account me account حساب کاربری پروفایل",
  },
  {
    path: "/notifications",
    labelKey: "nav.notifications",
    titleKey: "notif.title",
    icon: Bell,
    keywords: "notifications alerts bell اعلان اعلان‌ها هشدار",
  },
];
