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
  addWorkLog: (hours: number) => void;
  addStressLog: (level: StressLevel) => void;
  removeWorkLog: (id: string) => void;
  removeStressLog: (id: string) => void;
}

export const useBurnoutStore = create<BurnoutState>((set) => ({
  workLogs: [],
  stressLogs: [],

  addWorkLog: (hours) =>
    set((state) => ({
      workLogs: [
        ...state.workLogs,
        { id: crypto.randomUUID(), date: new Date().toISOString(), hours },
      ],
    })),

  addStressLog: (level) =>
    set((state) => ({
      stressLogs: [
        ...state.stressLogs,
        { id: crypto.randomUUID(), date: new Date().toISOString(), level },
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