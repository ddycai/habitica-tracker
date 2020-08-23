import { Task } from "./HabiticaTypes";

const VALUE_THRESHOLDS = [-16, -9, -1, 1, 6, 12];
const COLOR_CLASS = ["worst", "worse", "bad", "neutral", "good", "better"];

export function getColorClass(task: Task): string {
  for (let i = 0; i < VALUE_THRESHOLDS.length; i++) {
    if (task.value < VALUE_THRESHOLDS[i]) {
      return COLOR_CLASS[i];
    }
  }
  return "best";
}