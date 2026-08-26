export const HABIT_LOG_STATUSES = ["completed", "missed", "excused"] as const;

export type HabitLogStatus = (typeof HABIT_LOG_STATUSES)[number];

export const SYSTEM_KEYS = [
  "maestro",
  "micro_goals",
  "character",
  "bible",
  "finance",
  "learning",
  "nido",
] as const;

export type SystemKey = (typeof SYSTEM_KEYS)[number];

export interface DatedHabitLog {
  date: string;
  status: HabitLogStatus;
}

export interface ScoreComponent {
  key: "habits" | "goals" | "consistency" | "sessions" | "commitments";
  label: string;
  score: number;
}

export interface ScoreWeight {
  key: ScoreComponent["key"];
  weight: number;
}

export interface PendingSyncOperation<TPayload = unknown> {
  operationId: string;
  entityId: string;
  entityType: string;
  action: "create" | "update" | "delete";
  payload: TPayload;
  baseRevision: number | null;
  createdAt: string;
}
