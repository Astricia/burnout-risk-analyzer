"use client";

import { useState } from "react";
import { useBurnoutStore } from "@/store/useBurnoutStore";
import Card from "@/components/Card";

export default function LogWork() {
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");
  const { addWorkLog } = useBurnoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours) return;

    addWorkLog(Number(hours));
    setMessage("Work hours logged successfully!");
    setHours("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Log Work Hours</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter hours"
          />
          <button className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
        {message && <p className="mt-3 text-green-600">{message}</p>}
      </Card>
    </main>
  );
}