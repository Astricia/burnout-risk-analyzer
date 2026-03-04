"use client";

import { useState } from "react";
import { useBurnoutStore, StressLevel } from "@/store/useBurnoutStore";
import Card from "@/components/Card";

const options: { value: StressLevel; label: string; description: string }[] = [
  { value: "low", label: " Low", description: "Feeling calm and in control" },
  { value: "medium", label: " Medium", description: "Some pressure but manageable" },
  { value: "high", label: " High", description: "Overwhelmed or very stressed" },
];

export default function LogStress() {
  const [level, setLevel] = useState<StressLevel>("low");
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [message, setMessage] = useState("");
  const { addStressLog } = useBurnoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const iso = new Date(date).toISOString();
    addStressLog(level, iso);
    const selected = options.find((o) => o.value === level);
    setMessage(` Stress level "${selected?.label}" logged successfully!`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10 flex justify-center">
      <Card>
        <h2 className="text-xl font-semibold mb-1">Log Stress Level</h2>
        <p className="text-gray-400 text-sm mb-4">How are you feeling today?</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setMessage("");
              }}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </label>

          {/* Styled option buttons instead of a plain select */}
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors
                  ${level === opt.value
                    ? opt.value === "low"
                      ? "bg-green-50 border-green-400"
                      : opt.value === "medium"
                        ? "bg-yellow-50 border-yellow-400"
                        : "bg-red-50 border-red-400"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="stress"
                  value={opt.value}
                  checked={level === opt.value}
                  onChange={() => { setLevel(opt.value); setMessage(""); }}
                  className="accent-purple-500"
                />
                <div>
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors font-semibold"
          >
            Submit
          </button>
        </form>
        {message && <p className="mt-3 text-green-600 font-medium">{message}</p>}
      </Card>
    </main>
  );
}