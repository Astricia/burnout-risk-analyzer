import { create } from "zustand";

export type StressLevel = "low" | "medium" | "high";

interface WorkLog {
  date: string;
  hours: number;
}

interface StressLog {
  date: string;
  level: StressLevel;
}

interface BurnoutState {
  workLogs: WorkLog[];
  stressLogs: StressLog[];
  addWorkLog: (hours: number) => void;
  addStressLog: (level: StressLevel) => void;
}

export const useBurnoutStore = create<BurnoutState>((set) => ({
  workLogs: [],
  stressLogs: [],

  addWorkLog: (hours) =>
    set((state) => ({
      workLogs: [
        ...state.workLogs,
        { date: new Date().toISOString(), hours },
      ],
    })),

  addStressLog: (level) =>
    set((state) => ({
      stressLogs: [
        ...state.stressLogs,
        { date: new Date().toISOString(), level },
      ],
    })),
}));