import { useEffect, useState } from "react";
import {
  getDailyUsage,
  getModels,
  getRecentRequests,
  type DailyUsage,
  type ModelStat,
  type RequestRow,
} from "../data/usage";

export type Range = 7 | 30 | 90;

export interface UsageData {
  daily: DailyUsage[];
  /** Window of `range * 2` days; the first half is the "previous" period. */
  trend: DailyUsage[];
  models: ModelStat[];
  requests: RequestRow[];
}

interface State {
  status: "loading" | "ready" | "error";
  data?: UsageData;
}

const LOAD_MS = 420;
const REQUEST_COUNT = 256;

/**
 * Stand-in for a real API call so pages can exercise genuine loading and
 * error states instead of rendering synchronously.
 */
export function useUsageData(range: Range): State & { retry: () => void } {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      try {
        setState({
          status: "ready",
          data: {
            daily: getDailyUsage(range),
            trend: getDailyUsage(range * 2),
            models: getModels(),
            requests: getRecentRequests(REQUEST_COUNT),
          },
        });
      } catch {
        setState({ status: "error" });
      }
    }, LOAD_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [range, attempt]);

  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
