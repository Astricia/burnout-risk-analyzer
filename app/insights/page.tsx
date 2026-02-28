"use client";

import { useBurnoutStore } from "@/store/useBurnoutStore";
import { calculateBurnoutScore } from "@/utils/burnoutLogic";
import Card from "@/components/Card";

export default function Insights() {
  const { workLogs, stressLogs } = useBurnoutStore();

  const hours = workLogs.map((l) => l.hours);
  const stress = stressLogs.map((l) => l.level);

  const { risk } = calculateBurnoutScore(hours, stress);

  const recommendation =
    risk === "Low"
      ? "Keep maintaining balance!"
      : risk === "Moderate"
      ? "Consider short breaks and reduce overtime."
      : "High burnout risk. Take rest and reduce workload.";

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <Card>
        <h2 className="text-xl font-bold mb-4">Weekly Insights</h2>
        <p>Total Work Entries: {workLogs.length}</p>
        <p>Total Stress Entries: {stressLogs.length}</p>
        <p className="mt-3 font-semibold">{recommendation}</p>
      </Card>
    </main>
  );
}