import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "../components/ui/Controls";
import { useNotifications } from "../hooks/useNotifications";
import { useI18n } from "../i18n/i18n-context";

export function NotificationBell() {
  const { t } = useI18n();
  const { unread } = useNotifications();
  const navigate = useNavigate();

  const label =
    unread > 0
      ? `${t("nav.notifications")} — ${t("notif.unreadCount", {
          count: String(unread),
        })}`
      : t("nav.notifications");

  return (
    <IconButton
      label={label}
      onClick={() => navigate("/notifications")}
      className="relative"
    >
      <Bell size={18} aria-hidden />
      {unread > 0 ? (
        <span
          aria-hidden
          className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold tabular-nums text-white"
        >
          {unread > 9 ? "9+" : unread}
        </span>
      ) : null}
    </IconButton>
  );
}
