"use client";

import { useState, useEffect } from "react";
import { useBurnoutStore, StressLevel } from "@/store/useBurnoutStore";
import {
  calculateBurnoutScore,
  filterToLastNDays,
  getAverageHours,
  getMostFrequentStress,
  mergeLogsByDay,
  CombinedDayLog,
} from "@/utils/burnoutLogic";
import Card from "@/components/Card";
import RiskBadge from "@/components/RiskBadge";

const stressColor = (level?: StressLevel) => {
  if (!level) return "text-gray-400";
  if (level === "low") return "text-green-600";
  if (level === "medium") return "text-yellow-600";
  return "text-red-600";
};

const stressBg = (level?: StressLevel) => {
  if (!level) return "bg-gray-100";
  if (level === "low") return "bg-green-50 border-green-200";
  if (level === "medium") return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};

export default function Insights() {
  const { workLogs, stressLogs } = useBurnoutStore();

  // Derived weekly state (computed via useEffect)
  const [weeklyRisk, setWeeklyRisk] = useState("Low");
  const [avgHours, setAvgHours] = useState(0);
  const [dominantStress, setDominantStress] = useState<StressLevel | null>(null);
  const [weekWorkCount, setWeekWorkCount] = useState(0);
  const [weekStressCount, setWeekStressCount] = useState(0);
  const [weeklyCombined, setWeeklyCombined] = useState<CombinedDayLog[]>([]);

  // All-time merged logs for the individual log view
  const [allTimeLogs, setAllTimeLogs] = useState<CombinedDayLog[]>([]);

  // useEffect recalculates all derived data when store changes
  useEffect(() => {
    const weeklyWork = filterToLastNDays(workLogs, 7);
    const weeklyStress = filterToLastNDays(stressLogs, 7);

    const hours = weeklyWork.map((l) => l.hours);
    const stressLevels = weeklyStress.map((l) => l.level);

    const { risk } = calculateBurnoutScore(hours, stressLevels);
    setWeeklyRisk(risk);
    setAvgHours(getAverageHours(hours));
    setDominantStress(getMostFrequentStress(stressLevels));
    setWeekWorkCount(weeklyWork.length);
    setWeekStressCount(weeklyStress.length);
    setWeeklyCombined(mergeLogsByDay(weeklyWork, weeklyStress));

    // All-time logs (user's new feature)
    setAllTimeLogs(mergeLogsByDay(workLogs, stressLogs));
  }, [workLogs, stressLogs]);

  const recommendation =
    weeklyRisk === "Low"
      ? "You're maintaining a great work-life balance. Keep it up — consistency here is key!"
      : weeklyRisk === "Moderate"
        ? `You're averaging ${avgHours.toFixed(1)} hrs/day this week. Consider short breaks between tasks and avoid consistent overtime.`
        : `High burnout risk! At ${avgHours.toFixed(1)} hrs/day average, it's critical to rest, reduce workload, and speak to someone you trust.`;

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10 flex flex-col items-center gap-6">

      {/* ── Weekly Trends ────────────────────────────────────────── */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Weekly Trends</h2>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Work Entries</p>
            <p className="text-2xl font-bold text-blue-600">{weekWorkCount}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Stress Entries</p>
            <p className="text-2xl font-bold text-purple-600">{weekStressCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Avg Daily Hours</p>
            <p className="text-2xl font-bold text-green-600">{avgHours.toFixed(1)}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Dominant Stress</p>
            <p className="text-xl font-bold text-orange-600 capitalize">{dominantStress ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Weekly Risk Level:</span>
          <RiskBadge risk={weeklyRisk} />
        </div>
      </Card>

      {/* ── Recommendation ──────────────────────────────────────── */}
      <Card>
        <h2 className="text-xl font-bold mb-3"> Personalized Recommendation</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{recommendation}</p>
      </Card>

      {/* ── This Week's Logs ─────────────────────────────────────── */}
      {weeklyCombined.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold mb-4">This Week&apos;s Logs</h2>
          <ul className="flex flex-col gap-2">
            {weeklyCombined.map((log) => (
              <li
                key={log.dateKey}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between
                            border rounded-lg px-4 py-2 gap-1 sm:gap-0 ${stressBg(log.stressLevel)}`}
              >
                <span className="text-gray-600 font-medium text-sm">{log.displayDate}</span>
                <div className="flex gap-4 text-sm font-medium">
                  <span>
                    {" "}
                    {log.hours !== undefined ? (
                      <span className="text-blue-700">{log.hours} hrs</span>
                    ) : (
                      <span className="text-gray-400 font-normal">No work log</span>
                    )}
                  </span>
                  <span className={`capitalize ${stressColor(log.stressLevel)}`}>
                    {" "}
                    {log.stressLevel ?? (
                      <span className="text-gray-400 font-normal">No stress log</span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ── All-Time Individual Log Entries ──────────────────────── */}
      <Card>
        <h2 className="text-xl font-bold mb-1">All Log Entries</h2>
        <p className="text-gray-400 text-xs mb-4">
          Every logged day — work hours and stress level side by side
        </p>

        {allTimeLogs.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No logs yet. Head to{" "}
            <span className="font-semibold text-blue-500">Log Work</span> or{" "}
            <span className="font-semibold text-purple-500">Log Stress</span> to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {allTimeLogs.map((log) => (
              <li
                key={log.dateKey}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm
                           flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                {/* Date */}
                <span className="text-gray-500 text-sm font-medium min-w-[110px]">
                   {log.displayDate}
                </span>

                {/* Hours Chip */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-blue-500"></span>
                  <span className="text-sm font-semibold text-blue-700">
                    {log.hours !== undefined ? `${log.hours} hrs worked` : "No work logged"}
                  </span>
                </div>

                {/* Stress Chip */}
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border
                    ${log.stressLevel === "low"
                      ? "bg-green-50 border-green-200"
                      : log.stressLevel === "medium"
                        ? "bg-yellow-50 border-yellow-200"
                        : log.stressLevel === "high"
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <span></span>
                  <span
                    className={`text-sm font-semibold capitalize ${stressColor(log.stressLevel)}`}
                  >
                    {log.stressLevel ? `${log.stressLevel} stress` : "No stress logged"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}