import type { HabitLogStatus } from "@maestro/types";

export interface CompletionRateOptions {
  excusedCountsInDenominator?: boolean;
}

export function calculateCompletionRate(
  statuses: readonly HabitLogStatus[],
  options: CompletionRateOptions = {},
): number {
  const completed = statuses.filter((status) => status === "completed").length;
  const denominator = options.excusedCountsInDenominator
    ? statuses.length
    : statuses.filter((status) => status !== "excused").length;

  if (denominator === 0) return 0;
  return Math.round((completed / denominator) * 100);
}
