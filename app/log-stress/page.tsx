"use client";

import { useState } from "react";
import { useBurnoutStore } from "@/store/useBurnoutStore";
import Card from "@/components/Card";

export default function LogStress() {
  const [level, setLevel] = useState("low");
  const [message, setMessage] = useState("");
  const { addStressLog } = useBurnoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStressLog(level as any);
    setMessage("Stress level logged!");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Log Stress Level</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button className="bg-purple-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
        {message && <p className="mt-3 text-green-600">{message}</p>}
      </Card>
    </main>
  );
}