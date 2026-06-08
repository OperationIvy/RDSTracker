import type { FrameRecord, RackRecord } from "@/types";

export interface LevelStats {
  frameWins: number;
  frameLosses: number;
  framePushes: number;
  rackWins: number;
  rackLosses: number;
}

export function computeLevelStats(
  level: number,
  frames: FrameRecord[],
  racks: RackRecord[],
): LevelStats {
  let frameWins = 0;
  let frameLosses = 0;
  let framePushes = 0;

  for (const frame of frames) {
    if (frame.levelBefore !== level) {
      continue;
    }
    if (frame.wins >= 2) {
      frameWins += 1;
    } else if (frame.wins === 1) {
      framePushes += 1;
    } else {
      frameLosses += 1;
    }
  }

  let rackWins = 0;
  let rackLosses = 0;

  for (const rack of racks) {
    if (rack.level !== level) {
      continue;
    }
    if (rack.result === "win") {
      rackWins += 1;
    } else {
      rackLosses += 1;
    }
  }

  return { frameWins, frameLosses, framePushes, rackWins, rackLosses };
}

function formatWinRate(wins: number, total: number): string {
  const rate = wins / total;
  return `.${Math.round(rate * 1000)
    .toString()
    .padStart(3, "0")}`;
}

export function winRate(wins: number, total: number): number {
  return wins / total;
}

export function winRateColor(rate: number): string {
  const clamped = Math.max(0, Math.min(1, rate));
  let hue: number;

  if (clamped <= 1 / 3) {
    hue = (clamped / (1 / 3)) * 60;
  } else if (clamped <= 2 / 3) {
    hue = 60 + ((clamped - 1 / 3) / (1 / 3)) * 60;
  } else {
    hue = 120;
  }

  return `hsl(${hue}, 75%, 55%)`;
}

export function hasLevelStats(stats: LevelStats): boolean {
  return (
    stats.frameWins + stats.frameLosses + stats.framePushes + stats.rackWins + stats.rackLosses > 0
  );
}

export function formatLevelStats(stats: LevelStats): string | null {
  const frameTotal = stats.frameWins + stats.frameLosses + stats.framePushes;
  const rackTotal = stats.rackWins + stats.rackLosses;

  if (frameTotal === 0 && rackTotal === 0) {
    return null;
  }

  const parts: string[] = [];

  if (frameTotal > 0) {
    parts.push(
      `${stats.frameWins}-${stats.frameLosses}-${stats.framePushes} (${formatWinRate(stats.frameWins, frameTotal)}) frames`,
    );
  }

  if (rackTotal > 0) {
    parts.push(
      `${stats.rackWins}-${stats.rackLosses} (${formatWinRate(stats.rackWins, rackTotal)}) racks`,
    );
  }

  return parts.join(", ");
}

export { formatWinRate };
