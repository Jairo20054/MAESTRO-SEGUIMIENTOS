import type { ScoreComponent, ScoreWeight } from "@maestro/types";

export interface MaestroScoreResult {
  total: number;
  formula: string;
  contributions: Array<ScoreComponent & { weight: number; contribution: number }>;
}

function boundedScore(value: number): number {
  if (!Number.isFinite(value)) throw new Error("Score values must be finite numbers");
  return Math.min(100, Math.max(0, value));
}

export function calculateMaestroScore(
  components: readonly ScoreComponent[],
  weights: readonly ScoreWeight[],
): MaestroScoreResult {
  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.001) {
    throw new Error(`Score weights must total 100; received ${totalWeight}`);
  }

  const componentByKey = new Map(components.map((component) => [component.key, component]));
  const contributions = weights.map(({ key, weight }) => {
    const component = componentByKey.get(key);
    if (!component) throw new Error(`Missing score component: ${key}`);
    if (weight < 0) throw new Error(`Score weight cannot be negative: ${key}`);

    const score = boundedScore(component.score);
    return {
      ...component,
      score,
      weight,
      contribution: Number(((score * weight) / 100).toFixed(2)),
    };
  });

  const total = Math.round(contributions.reduce((sum, item) => sum + item.contribution, 0));
  const formula = contributions.map((item) => `${item.label} ${item.weight}%`).join(" + ");
  return { total, formula, contributions };
}
