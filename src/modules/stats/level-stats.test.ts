import { describe, expect, it } from "vitest";
import { computeLevelStats, formatLevelStats, winRateColor } from "./level-stats";
import type { FrameRecord, RackRecord } from "@/types";

const frame = (overrides: Partial<FrameRecord> & Pick<FrameRecord, "levelBefore" | "wins">): FrameRecord => ({
  id: "f1",
  timestamp: "2026-01-01T00:00:00.000Z",
  levelAfter: overrides.levelBefore ?? 10,
  losses: 3 - overrides.wins,
  aggregate: `${overrides.wins}-${3 - overrides.wins}`,
  ...overrides,
});

const rack = (overrides: Partial<RackRecord> & Pick<RackRecord, "level" | "result">): RackRecord => ({
  id: "r1",
  frameId: "f1",
  rackNumber: 1,
  timestamp: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("computeLevelStats", () => {
  it("counts frames by 2-of-3 threshold and racks by individual results", () => {
    const frames = [
      frame({ levelBefore: 10, wins: 2 }),
      frame({ id: "f2", levelBefore: 10, wins: 0 }),
      frame({ id: "f3", levelBefore: 10, wins: 1 }),
      frame({ id: "f4", levelBefore: 9, wins: 3 }),
    ];
    const racks = [
      rack({ level: 10, result: "win" }),
      rack({ id: "r2", level: 10, result: "win" }),
      rack({ id: "r3", level: 10, result: "loss" }),
      rack({ id: "r4", level: 10, result: "win" }),
      rack({ id: "r5", level: 9, result: "loss" }),
    ];

    expect(computeLevelStats(10, frames, racks)).toEqual({
      frameWins: 1,
      frameLosses: 1,
      framePushes: 1,
      rackWins: 3,
      rackLosses: 1,
    });
  });
});

describe("formatLevelStats", () => {
  it("formats frame records as win-loss-push", () => {
    expect(
      formatLevelStats({
        frameWins: 5,
        frameLosses: 4,
        framePushes: 1,
        rackWins: 0,
        rackLosses: 0,
      }),
    ).toBe("5-4-1 (.500) frames");
  });

  it("formats win-loss records with three-decimal rates", () => {
    expect(
      formatLevelStats({
        frameWins: 2,
        frameLosses: 2,
        framePushes: 0,
        rackWins: 3,
        rackLosses: 9,
      }),
    ).toBe("2-2-0 (.500) frames, 3-9 (.250) racks");
  });

  it("returns null when there is no history", () => {
    expect(
      formatLevelStats({
        frameWins: 0,
        frameLosses: 0,
        framePushes: 0,
        rackWins: 0,
        rackLosses: 0,
      }),
    ).toBeNull();
  });
});

describe("winRateColor", () => {
  it("maps 0 to red, one-third to yellow, and two-thirds and above to green", () => {
    expect(winRateColor(0)).toBe("hsl(0, 75%, 55%)");
    expect(winRateColor(1 / 3)).toBe("hsl(60, 75%, 55%)");
    expect(winRateColor(2 / 3)).toBe("hsl(120, 75%, 55%)");
    expect(winRateColor(1)).toBe("hsl(120, 75%, 55%)");
  });
});
