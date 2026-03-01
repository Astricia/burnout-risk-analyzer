"use client";

import { useState, useEffect } from "react";
import { useBurnoutStore, WorkLog, StressLog } from "@/store/useBurnoutStore";
import {
  calculateBurnoutScore,
  filterToLastNDays,
  getAverageHours,
  getMostFrequentStress,
} from "@/utils/burnoutLogic";
import Card from "@/components/Card";
import RiskBadge from "@/components/RiskBadge";

// ── Small helper components ────────────────────────────────────────────────────

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-3 ${color}`}>
      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
      />
    </svg>
  );
}

// ── Stress colour helpers ──────────────────────────────────────────────────────

const stressTextColor = (level: string) =>
  level === "low"
    ? "text-green-600"
    : level === "medium"
      ? "text-yellow-600"
      : "text-red-600";

const stressBadgeBg = (level: string) =>
  level === "low"
    ? "bg-green-100 text-green-700 border-green-200"
    : level === "medium"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const { workLogs, stressLogs, removeWorkLog, removeStressLog } =
    useBurnoutStore();

  // Derived weekly state
  const [weeklyScore, setWeeklyScore] = useState({ score: 0, risk: "Low" });
  const [avgHours, setAvgHours] = useState(0);
  const [dominantStress, setDominantStress] = useState<string | null>(null);
  const [weekWorkCount, setWeekWorkCount] = useState(0);
  const [weekStressCount, setWeekStressCount] = useState(0);

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

  // Sort newest-first for display
  const sortedWork = [...workLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedStress = [...stressLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 flex flex-col items-center gap-6 text-black">

      {/* ── Burnout Score ──────────────────────────────────────────── */}
      <Card>
        <h1 className="text-2xl font-bold mb-3">Burnout Dashboard</h1>
        <p className="text-lg mb-2">
          Weekly Risk Score:{" "}
          <span className="font-bold">{weeklyScore.score.toFixed(2)}</span>
        </p>
        <RiskBadge risk={weeklyScore.risk} />
      </Card>

      {/* ── Weekly Summary ─────────────────────────────────────────── */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Weekly Summary</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <StatBox
            label="Work Entries"
            value={String(weekWorkCount)}
            color="bg-blue-50 text-blue-700"
          />
          <StatBox
            label="Stress Entries"
            value={String(weekStressCount)}
            color="bg-purple-50 text-purple-700"
          />
          <StatBox
            label="Avg Daily Hours"
            value={`${avgHours.toFixed(1)} hrs`}
            color="bg-green-50 text-green-700"
          />
          <StatBox
            label="Dominant Stress"
            value={dominantStress ?? "—"}
            color="bg-orange-50 text-orange-700"
          />
        </div>
      </Card>

      {/* ── All Work Logs ──────────────────────────────────────────── */}
      <div className="w-full max-w-md">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold"> Work Hour Logs</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full">
              {workLogs.length} {workLogs.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {sortedWork.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No work logs yet. Head to{" "}
              <span className="font-semibold text-blue-500">Log Work</span> to
              add your first entry.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {sortedWork.map((log: WorkLog) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between border border-gray-200
                             rounded-lg px-4 py-3 bg-white hover:bg-blue-50
                             transition-colors group"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">{formatDate(log.date)}</span>
                    <span className="text-blue-700 font-bold text-lg">
                      {log.hours}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        hrs worked
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => removeWorkLog(log.id)}
                    title="Delete this entry"
                    className="text-gray-300 hover:text-red-500 transition-colors
                               group-hover:text-gray-400 p-1.5 rounded-lg
                               hover:bg-red-50 cursor-pointer"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* ── All Stress Logs ────────────────────────────────────────── */}
      <div className="w-full max-w-md">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold"> Stress Level Logs</h2>
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full">
              {stressLogs.length} {stressLogs.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {sortedStress.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No stress logs yet. Head to{" "}
              <span className="font-semibold text-purple-500">Log Stress</span>{" "}
              to add your first entry.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {sortedStress.map((log: StressLog) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between border border-gray-200
                             rounded-lg px-4 py-3 bg-white hover:bg-purple-50
                             transition-colors group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400">{formatDate(log.date)}</span>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest border
                                  px-2 py-0.5 rounded-full w-fit ${stressBadgeBg(log.level)}`}
                    >
                      {log.level} stress
                    </span>
                  </div>
                  <button
                    onClick={() => removeStressLog(log.id)}
                    title="Delete this entry"
                    className={`transition-colors p-1.5 rounded-lg cursor-pointer
                               text-gray-300 hover:text-red-500 hover:bg-red-50
                               group-hover:text-gray-400 ${stressTextColor(log.level)}`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

    </div>
  );
}