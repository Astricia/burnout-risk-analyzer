"use client";

import { useState } from "react";
import { useBurnoutStore } from "@/store/useBurnoutStore";
import Card from "@/components/Card";

export default function LogWork() {
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { addWorkLog } = useBurnoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(hours);

    if (!hours.trim() || isNaN(parsed)) {
      setError("Please enter a valid number.");
      return;
    }
    if (parsed <= 0 || parsed > 24) {
      setError("Hours must be between 1 and 24.");
      return;
    }

    addWorkLog(parsed);
    setMessage(` ${parsed} work hour${parsed !== 1 ? "s" : ""} logged successfully!`);
    setError("");
    setHours("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10 flex justify-center">
      <Card>
        <h2 className="text-xl font-semibold mb-1">Log Work Hours</h2>
        <p className="text-gray-400 text-sm mb-4">Enter how many hours you worked today.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            value={hours}
            onChange={(e) => {
              setHours(e.target.value);
              setMessage("");
              setError("");
            }}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. 8"
            min="1"
            max="24"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors font-semibold"
          >
            Submit
          </button>
        </form>
        {message && <p className="mt-3 text-green-600 font-medium">{message}</p>}
      </Card>
    </main>
  );
}