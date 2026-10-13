import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/Feedback";
import { useI18n } from "../i18n/i18n-context";

export function NotFound() {
  const { t } = useI18n();

  return (
    <Card>
      <EmptyState
        icon={<Compass size={20} />}
        title={t("common.notFound")}
        description={t("common.notFoundDesc")}
        action={
          <Link
            to="/"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-500"
          >
            {t("common.backHome")}
          </Link>
        }
      />
    </Card>
  );
}
