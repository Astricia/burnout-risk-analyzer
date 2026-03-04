import { create } from "zustand";

export type StressLevel = "low" | "medium" | "high";

export interface WorkLog {
  id: string;
  date: string;
  hours: number;
}

export interface StressLog {
  id: string;
  date: string;
  level: StressLevel;
}

interface BurnoutState {
  workLogs: WorkLog[];
  stressLogs: StressLog[];
  // allow caller to specify a date (iso string); default to now when omitted
  addWorkLog: (hours: number, date?: string) => void;
  addStressLog: (level: StressLevel, date?: string) => void;
  removeWorkLog: (id: string) => void;
  removeStressLog: (id: string) => void;
}

export const useBurnoutStore = create<BurnoutState>((set) => ({
  workLogs: [],
  stressLogs: [],

  addWorkLog: (hours, date = new Date().toISOString()) =>
    set((state) => ({
      workLogs: [
        ...state.workLogs,
        { id: crypto.randomUUID(), date, hours },
      ],
    })),

  addStressLog: (level, date = new Date().toISOString()) =>
    set((state) => ({
      stressLogs: [
        ...state.stressLogs,
        { id: crypto.randomUUID(), date, level },
      ],
    })),

  removeWorkLog: (id) =>
    set((state) => ({
      workLogs: state.workLogs.filter((log) => log.id !== id),
    })),

  removeStressLog: (id) =>
    set((state) => ({
      stressLogs: state.stressLogs.filter((log) => log.id !== id),
    })),
}));