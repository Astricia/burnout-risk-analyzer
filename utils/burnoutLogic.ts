import { StressLevel } from "@/store/useBurnoutStore";

export const calculateBurnoutScore = (
  hours: number[],
  stressLevels: StressLevel[]
) => {
  const avgHours =
    hours.reduce((sum, h) => sum + h, 0) / (hours.length || 1);

  const stressScore =
    stressLevels.reduce((sum, level) => {
      if (level === "low") return sum + 1;
      if (level === "medium") return sum + 2;
      return sum + 3;
    }, 0) / (stressLevels.length || 1);

  const score = avgHours * 0.6 + stressScore * 10 * 0.4;

  if (score < 40) return { score, risk: "Low" };
  if (score < 70) return { score, risk: "Moderate" };
  return { score, risk: "High" };
};