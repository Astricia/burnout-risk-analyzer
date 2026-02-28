"use client";

import { useBurnoutStore } from "@/store/useBurnoutStore";
import { calculateBurnoutScore } from "@/utils/burnoutLogic";
import Card from "@/components/Card";
import RiskBadge from "@/components/RiskBadge";

export default function Home() {
  const { workLogs, stressLogs } = useBurnoutStore();

  const hours = workLogs.map((log) => log.hours);
  const stressLevels = stressLogs.map((log) => log.level);

  const { score, risk } = calculateBurnoutScore(hours, stressLevels);

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex flex-col items-center gap-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Burnout Dashboard</h1>
        <p className="text-lg">Risk Score: {score.toFixed(2)}</p>
        <RiskBadge risk={risk} />
      </Card>
    </main>
  );
}