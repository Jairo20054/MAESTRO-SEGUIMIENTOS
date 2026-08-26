import type { DatedHabitLog } from "@maestro/types";

const DAY_IN_MS = 86_400_000;

export interface StreakOptions {
  excusedPreservesStreak?: boolean;
}

export interface StreakResult {
  current: number;
  best: number;
}

function toUtcDay(date: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error(`Invalid date: ${date}`);

  const timestamp = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (new Date(timestamp).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid date: ${date}`);
  }
  return timestamp;
}

function dateFromUtcDay(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function calculateStreaks(
  logs: readonly DatedHabitLog[],
  asOfDate: string,
  options: StreakOptions = {},
): StreakResult {
  const excusedPreservesStreak = options.excusedPreservesStreak ?? true;
  const statusByDate = new Map(logs.map((log) => [log.date, log.status]));
  const qualifies = (date: string) => {
    const status = statusByDate.get(date);
    return status === "completed" || (excusedPreservesStreak && status === "excused");
  };

  let cursor = toUtcDay(asOfDate);
  if (!qualifies(asOfDate)) cursor -= DAY_IN_MS;

  let current = 0;
  while (qualifies(dateFromUtcDay(cursor))) {
    current += 1;
    cursor -= DAY_IN_MS;
  }

  const qualifyingDays = [
    ...new Set(logs.filter((log) => qualifies(log.date)).map((log) => toUtcDay(log.date))),
  ].sort((left, right) => left - right);

  let best = 0;
  let run = 0;
  let previous: number | undefined;
  for (const day of qualifyingDays) {
    run = previous !== undefined && day - previous === DAY_IN_MS ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }

  return { current, best };
}
