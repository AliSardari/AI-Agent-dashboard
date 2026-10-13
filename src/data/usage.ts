/**
 * Locally generated demo data — deterministic for a given seed so charts look
 * identical between reloads and tests. Nothing here leaves the browser.
 */

export type Provider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Meta"
  | "Mistral"
  | "Alibaba";

export interface ModelStat {
  id: string;
  name: string;
  provider: Provider;
  /** USD per 1M tokens */
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  /** share of total spend over the window, 0..1 */
  share: number;
  requests: number;
  successRate: number;
  medianLatencyMs: number;
}

export type RequestStatus = "success" | "error" | "limited";

export interface RequestRow {
  id: string;
  modelId: string;
  status: RequestStatus;
  tokens: number;
  cost: number;
  latencyMs: number;
  timestamp: number;
}

export interface DailyUsage {
  date: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  requests: number;
  errors: number;
  p50LatencyMs: number;
}

/** Mulberry32 — tiny deterministic PRNG. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MODELS: Omit<
  ModelStat,
  "share" | "requests" | "successRate" | "medianLatencyMs"
>[] = [
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI", inputPrice: 1.25, outputPrice: 10, contextWindow: 400_000 },
  { id: "gpt-4.1-mini", name: "GPT-4.1 mini", provider: "OpenAI", inputPrice: 0.4, outputPrice: 1.6, contextWindow: 1_047_576 },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", inputPrice: 15, outputPrice: 75, contextWindow: 200_000 },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", inputPrice: 3, outputPrice: 15, contextWindow: 200_000 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 10, contextWindow: 1_048_576 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", inputPrice: 0.3, outputPrice: 2.5, contextWindow: 1_048_576 },
  { id: "llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", inputPrice: 0.27, outputPrice: 0.85, contextWindow: 1_000_000 },
  { id: "mistral-large-3", name: "Mistral Large 3", provider: "Mistral", inputPrice: 2, outputPrice: 6, contextWindow: 256_000 },
  { id: "qwen3-235b", name: "Qwen3 235B", provider: "Alibaba", inputPrice: 0.8, outputPrice: 2.4, contextWindow: 131_072 },
];

const REQUEST_PREFIX = "req";

function pad(n: number, width = 4): string {
  return String(n).padStart(width, "0");
}

/** Static per-model stats (stable across reloads). */
export function getModels(): ModelStat[] {
  const rand = rng(20261007);
  const raw = MODELS.map((model) => {
    const weight = 0.35 + rand() * 1.6;
    const requests = Math.round(4_000 + rand() * 46_000);
    return {
      ...model,
      weight,
      requests,
      successRate: 0.972 + rand() * 0.027,
      medianLatencyMs: Math.round(240 + rand() * 1_500),
    };
  });

  const totalWeight = raw.reduce((sum, m) => sum + m.weight, 0);

  return raw.map(({ weight, ...model }) => ({
    ...model,
    share: weight / totalWeight,
  }));
}

/** Daily aggregates for the last `days` days (today is the last entry).
 *
 * Every day is generated from a seed derived from its own timestamp, so the
 * last N days of `getDailyUsage(90)` are identical to `getDailyUsage(30)` —
 * KPI summaries and charts always agree, on any window.
 */
export function getDailyUsage(days: number, now = Date.now()): DailyUsage[] {
  const day = 86_400_000;
  const today = new Date(now);
  today.setHours(12, 0, 0, 0);
  const end = today.getTime();

  const rows: DailyUsage[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = end - i * day;
    const rand = rng(97_531 + Math.floor(date / day));
    const weekday = new Date(date).getDay();
    const weekendDip = weekday === 5 || weekday === 6 ? 0.62 : 1;
    // Smooth upward trend anchored to "today" (i = days back), independent of
    // the requested window length so overlapping windows agree.
    const growth = 1 + (1 - i / 180) / 6;
    const noise = 0.82 + rand() * 0.4;

    const inputTokens = Math.round(
      (1_650_000 + rand() * 700_000) * weekendDip * growth * noise,
    );
    const outputTokens = Math.round(
      (620_000 + rand() * 320_000) * weekendDip * growth * noise,
    );
    const requests = Math.round(
      (9_500 + rand() * 3_800) * weekendDip * growth * noise,
    );

    const errors = Math.round(requests * (0.006 + rand() * 0.021));

    rows.push({
      date,
      inputTokens,
      outputTokens,
      requests,
      errors,
      cost: Number(((inputTokens / 1e6) * 2.4 + (outputTokens / 1e6) * 9.1).toFixed(2)),
      p50LatencyMs: Math.round(410 + rand() * 320),
    });
  }
  return rows;
}

/** Requests aggregated by model over the whole window. */
export function getUsageByModel(days: number): {
  model: ModelStat;
  cost: number;
  tokens: number;
}[] {
  const daily = getDailyUsage(days);
  const totalCost = daily.reduce((sum, d) => sum + d.cost, 0);
  const totalTokens = daily.reduce(
    (sum, d) => sum + d.inputTokens + d.outputTokens,
    0,
  );

  return getModels()
    .map((model) => ({
      model,
      cost: totalCost * model.share,
      tokens: totalTokens * model.share,
    }))
    .sort((a, b) => b.cost - a.cost);
}

/** Latest requests, newest first. */
export function getRecentRequests(count: number, now = Date.now()): RequestRow[] {
  const rand = rng(4_242_424);
  const models = getModels();
  const rows: RequestRow[] = [];

  for (let i = 0; i < count; i++) {
    const model =
      models[Math.floor(rand() * models.length)] ?? models[0];
    if (!model) continue;
    const roll = rand();
    const status: RequestStatus =
      roll > 0.935 ? "error" : roll > 0.905 ? "limited" : "success";
    const tokens = Math.round(400 + rand() * 14_000);
    const inputShare = 0.62;

    rows.push({
      id: `${REQUEST_PREFIX}_${pad(i, 6)}${Math.floor(rand() * 1e6)
        .toString()
        .padStart(6, "0")}`,
      modelId: model.id,
      status,
      tokens,
      cost:
        ((tokens * inputShare) / 1e6) * model.inputPrice +
        ((tokens * (1 - inputShare)) / 1e6) * model.outputPrice,
      latencyMs: Math.round(
        model.medianLatencyMs * (0.65 + rand() * 1.1) * (status === "error" ? 1.9 : 1),
      ),
      timestamp: now - Math.round(rand() * 6 * 3_600_000) - i * 47_000,
    });
  }

  return rows.sort((a, b) => b.timestamp - a.timestamp);
}

export function getModel(models: ModelStat[], id: string): ModelStat | undefined {
  return models.find((model) => model.id === id);
}
