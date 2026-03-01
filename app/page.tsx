"use client";

import { useState, useEffect } from "react";
import { useBurnoutStore } from "@/store/useBurnoutStore";
import {
  calculateBurnoutScore,
  filterToLastNDays,
  getAverageHours,
  getMostFrequentStress,
  mergeLogsByDay,
} from "@/utils/burnoutLogic";
import Card from "@/components/Card";
import RiskBadge from "@/components/RiskBadge";

export default function Home() {
  const { workLogs, stressLogs } = useBurnoutStore();

  const [weeklyScore, setWeeklyScore] = useState({ score: 0, risk: "Low" });
  const [avgHours, setAvgHours] = useState(0);
  const [dominantStress, setDominantStress] = useState<string | null>(null);
  const [weekWorkCount, setWeekWorkCount] = useState(0);
  const [weekStressCount, setWeekStressCount] = useState(0);

  // useEffect for derived weekly calculations whenever logs change
  useEffect(() => {
    const weeklyWork = filterToLastNDays(workLogs, 7);
    const weeklyStress = filterToLastNDays(stressLogs, 7);

    const hours = weeklyWork.map((l) => l.hours);
    const stressLevels = weeklyStress.map((l) => l.level);

    const { score, risk } = calculateBurnoutScore(hours, stressLevels);
    setWeeklyScore({ score, risk });
    setAvgHours(getAverageHours(hours));
    setDominantStress(getMostFrequentStress(stressLevels));
    setWeekWorkCount(weeklyWork.length);
    setWeekStressCount(weeklyStress.length);
  }, [workLogs, stressLogs]);

  // Merged recent logs for list rendering (with keys)
  const recentLogs = mergeLogsByDay(
    filterToLastNDays(workLogs, 7),
    filterToLastNDays(stressLogs, 7)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 flex flex-col items-center gap-6 text-black">

      {/* ── Burnout Score Card ───────────────────────────────────── */}
      <Card>
        <h1 className="text-2xl font-bold mb-4">Burnout Dashboard</h1>
        <p className="text-lg mb-2">
          Weekly Risk Score:{" "}
          <span className="font-bold">{weeklyScore.score.toFixed(2)}</span>
        </p>
        <RiskBadge risk={weeklyScore.risk} />
      </Card>

      {/* ── Weekly Summary Card ──────────────────────────────────── */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Weekly Summary</h2>
        <div className="grid grid-cols-2 gap-3 text-sm md:text-base">
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
      </Card>

      {/* ── Recent Log Entries (list rendering with keys) ────────── */}
      <Card>
        <h2 className="text-xl font-bold mb-4">This Week&apos;s Entries</h2>
        {recentLogs.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No entries this week. Log your work hours and stress level to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recentLogs.map((log) => (
              <li
                key={log.dateKey}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                           border rounded-lg px-4 py-2 bg-gray-50 gap-1 sm:gap-0"
              >
                <span className="text-gray-500 text-sm">{log.displayDate}</span>
                <div className="flex gap-4 text-sm font-medium">
                  <span>
                    🕐{" "}
                    {log.hours !== undefined ? (
                      <span className="text-blue-700">{log.hours} hrs</span>
                    ) : (
                      <span className="text-gray-400 font-normal">No work log</span>
                    )}
                  </span>
                  <span>
                    ❤️‍🔥{" "}
                    {log.stressLevel ? (
                      <span
                        className={`capitalize ${log.stressLevel === "low"
                            ? "text-green-600"
                            : log.stressLevel === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                      >
                        {log.stressLevel}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-normal">No stress log</span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}