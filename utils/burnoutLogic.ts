import { StressLevel } from "@/store/useBurnoutStore";

// ─── Core Score Calculation ───────────────────────────────────────────────────

export const calculateBurnoutScore = (
  hours: number[],
  stressLevels: StressLevel[]
) => {
  const avgHours =
    hours.reduce((sum, h) => sum + h, 0) / (hours.length || 1);

  const stressScore =
    stressLevels.reduce((sum, level) => {
      if (level === "low") return sum + 1;
      if (level === "medium") return sum + 2;
      return sum + 3;
    }, 0) / (stressLevels.length || 1);

  const score = avgHours * 0.6 + stressScore * 10 * 0.4;

  if (score < 40) return { score, risk: "Low" };
  if (score < 70) return { score, risk: "Moderate" };
  return { score, risk: "High" };
};

// ─── Weekly Filtering (uses filter) ──────────────────────────────────────────

export const filterToLastNDays = <T extends { date: string }>(
  logs: T[],
  days: number
): T[] => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return logs.filter((log) => new Date(log.date) >= cutoff);
};

// ─── Derived Stats ────────────────────────────────────────────────────────────

export const getAverageHours = (hours: number[]): number => {
  if (hours.length === 0) return 0;
  return hours.reduce((sum, h) => sum + h, 0) / hours.length;
};

export const getMostFrequentStress = (
  levels: StressLevel[]
): StressLevel | null => {
  if (levels.length === 0) return null;
  const counts = levels.reduce<Record<string, number>>((acc, level) => {
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as StressLevel;
};

// ─── Combined Day Log ─────────────────────────────────────────────────────────

export interface CombinedDayLog {
  dateKey: string;       // YYYY-MM-DD  (used as React key)
  displayDate: string;   // e.g. "Mar 1, 2026"
  hours?: number;
  stressLevel?: StressLevel;
}

export const mergeLogsByDay = (
  workLogs: { date: string; hours: number }[],
  stressLogs: { date: string; level: StressLevel }[]
): CombinedDayLog[] => {
  const map = new Map<string, CombinedDayLog>();

  const fmt = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  for (const log of workLogs) {
    const dateKey = log.date.slice(0, 10);
    const existing = map.get(dateKey) ?? { dateKey, displayDate: fmt(log.date) };
    map.set(dateKey, { ...existing, hours: log.hours });
  }

  for (const log of stressLogs) {
    const dateKey = log.date.slice(0, 10);
    const existing = map.get(dateKey) ?? { dateKey, displayDate: fmt(log.date) };
    map.set(dateKey, { ...existing, stressLevel: log.level });
  }

  // Sort newest first
  return Array.from(map.values()).sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey)
  );
};