import type { FrameOutcome, RackResult } from "../../types";
import { MAX_LEVEL, MIN_LEVEL } from "../level-catalog/levels";

export function clampLevel(level: number): number {
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, level));
}

export function computeLevelChange(wins: number): -1 | 0 | 1 {
  if (wins >= 2) return 1;
  if (wins === 1) return 0;
  return -1;
}

export function scoreFrame(
  rackResults: [RackResult, RackResult, RackResult],
  currentLevel: number,
): FrameOutcome {
  const wins = rackResults.filter((result) => result === "win").length;
  const losses = 3 - wins;
  const levelChange = computeLevelChange(wins);
  const levelBefore = currentLevel;
  const levelAfter = clampLevel(currentLevel + levelChange);

  return {
    wins,
    losses,
    aggregate: `${wins}-${losses}`,
    levelBefore,
    levelAfter,
    levelChange: (levelAfter - levelBefore) as -1 | 0 | 1,
  };
}
