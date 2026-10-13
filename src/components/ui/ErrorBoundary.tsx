/* eslint-disable react-refresh/only-export-components -- an error boundary is a class component with static members, which fast refresh cannot handle */
import { Component, type ReactNode } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Card } from "./Card";
import { EmptyState } from "./Feedback";
import { useI18n } from "../../i18n/i18n-context";

interface State {
  error: Error | null;
}

/**
 * Last-resort boundary around the routed pages — a render crash shows a
 * recoverable error card instead of a blank screen. Remounting (e.g. via the
 * keyed wrapper in AppLayout) resets it.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback onRetry={() => this.setState({ error: null })} />
      );
    }
    return this.props.children;
  }
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n();
  return (
    <Card>
      <EmptyState
        icon={<TriangleAlert size={20} />}
        title={t("error.title")}
        description={t("error.description")}
        action={
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-500"
          >
            <RefreshCw size={14} />
            {t("common.retry")}
          </button>
        }
      />
    </Card>
  );
}
