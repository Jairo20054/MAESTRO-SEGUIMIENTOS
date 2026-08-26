import { describe, expect, it } from "vitest";

import { calculateMaestroScore } from "./maestro-score";
import { calculateCompletionRate } from "./progress";
import { calculateStreaks } from "./streaks";

describe("calculateCompletionRate", () => {
  it("excludes justified absences from the denominator by default", () => {
    expect(calculateCompletionRate(["completed", "missed", "excused"])).toBe(50);
  });
});

describe("calculateStreaks", () => {
  it("preserves a streak across a justified absence", () => {
    expect(
      calculateStreaks(
        [
          { date: "2026-08-23", status: "completed" },
          { date: "2026-08-24", status: "excused" },
          { date: "2026-08-25", status: "completed" },
        ],
        "2026-08-26",
      ),
    ).toEqual({ current: 3, best: 3 });
  });

  it("breaks the streak when justified absences are configured to break it", () => {
    expect(
      calculateStreaks(
        [
          { date: "2026-08-23", status: "completed" },
          { date: "2026-08-24", status: "excused" },
          { date: "2026-08-25", status: "completed" },
        ],
        "2026-08-25",
        { excusedPreservesStreak: false },
      ),
    ).toEqual({ current: 1, best: 1 });
  });
});

describe("calculateMaestroScore", () => {
  it("returns a transparent weighted score", () => {
    const result = calculateMaestroScore(
      [
        { key: "habits", label: "Hábitos", score: 80 },
        { key: "goals", label: "Metas", score: 70 },
        { key: "consistency", label: "Constancia", score: 90 },
        { key: "sessions", label: "Sesiones", score: 60 },
        { key: "commitments", label: "Compromisos", score: 100 },
      ],
      [
        { key: "habits", weight: 40 },
        { key: "goals", weight: 20 },
        { key: "consistency", weight: 15 },
        { key: "sessions", weight: 15 },
        { key: "commitments", weight: 10 },
      ],
    );

    expect(result.total).toBe(79);
    expect(result.formula).toContain("Hábitos 40%");
  });
});
