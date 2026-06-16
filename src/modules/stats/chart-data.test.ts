import { describe, expect, it } from "vitest";
import {
  buildDateAxisLabels,
  buildLevelHistorySeries,
  buildLevelWinRateSeries,
} from "./chart-data";
import type { FrameRecord, RackRecord } from "@/types";

const frame = (overrides: Partial<FrameRecord> & Pick<FrameRecord, "timestamp" | "levelBefore" | "wins">): FrameRecord => ({
  id: "f1",
  levelAfter: overrides.levelBefore ?? 10,
  losses: 3 - overrides.wins,
  aggregate: `${overrides.wins}-${3 - overrides.wins}`,
  ...overrides,
});

const rack = (overrides: Partial<RackRecord> & Pick<RackRecord, "timestamp" | "level" | "result">): RackRecord => ({
  id: "r1",
  frameId: "f1",
  rackNumber: 1,
  ...overrides,
});

describe("buildLevelWinRateSeries", () => {
  it("builds cumulative win-rate series for frames and racks at a level", () => {
    const frames = [
      frame({ id: "f1", timestamp: "2026-01-01T10:00:00.000Z", levelBefore: 10, wins: 2 }),
      frame({ id: "f2", timestamp: "2026-01-02T10:00:00.000Z", levelBefore: 10, wins: 0 }),
      frame({ id: "f3", timestamp: "2026-01-03T10:00:00.000Z", levelBefore: 9, wins: 3 }),
    ];
    const racks = [
      rack({ id: "r1", timestamp: "2026-01-01T10:00:00.000Z", level: 10, result: "win" }),
      rack({ id: "r2", timestamp: "2026-01-01T10:05:00.000Z", level: 10, result: "win" }),
      rack({ id: "r3", timestamp: "2026-01-01T10:10:00.000Z", level: 10, result: "loss" }),
      rack({ id: "r4", timestamp: "2026-01-02T10:00:00.000Z", level: 10, result: "loss" }),
    ];

    const series = buildLevelWinRateSeries(10, frames, racks);

    expect(series.frameSeries).toEqual([
      { index: 0, timestamp: new Date("2026-01-01T10:00:00.000Z"), rate: 1 },
      { index: 1, timestamp: new Date("2026-01-02T10:00:00.000Z"), rate: 0.5 },
    ]);
    expect(series.rackSeries).toEqual([
      { index: 0, timestamp: new Date("2026-01-01T10:00:00.000Z"), rate: 1 },
      { index: 1, timestamp: new Date("2026-01-01T10:05:00.000Z"), rate: 1 },
      { index: 2, timestamp: new Date("2026-01-01T10:10:00.000Z"), rate: 2 / 3 },
      { index: 3, timestamp: new Date("2026-01-02T10:00:00.000Z"), rate: 0.5 },
    ]);
    expect(series.frameWinRate).toBe(0.5);
    expect(series.rackWinRate).toBe(0.5);
  });
});

describe("buildLevelHistorySeries", () => {
  it("orders all frames chronologically with levelBefore as the y value", () => {
    const frames = [
      frame({ id: "f2", timestamp: "2026-01-02T10:00:00.000Z", levelBefore: 8, wins: 2 }),
      frame({ id: "f1", timestamp: "2026-01-01T10:00:00.000Z", levelBefore: 7, wins: 1 }),
    ];

    expect(buildLevelHistorySeries(frames)).toEqual([
      { index: 0, timestamp: new Date("2026-01-01T10:00:00.000Z"), level: 7 },
      { index: 1, timestamp: new Date("2026-01-02T10:00:00.000Z"), level: 8 },
    ]);
  });
});

describe("buildDateAxisLabels", () => {
  it("returns sparse date labels aligned to frame indices", () => {
    const points = [
      { index: 0, timestamp: new Date("2026-01-01T10:00:00.000Z") },
      { index: 1, timestamp: new Date("2026-01-05T10:00:00.000Z") },
      { index: 2, timestamp: new Date("2026-01-10T10:00:00.000Z") },
    ];

    const labels = buildDateAxisLabels(points);

    expect(labels[0].index).toBe(0);
    expect(labels[labels.length - 1].index).toBe(2);
    expect(labels.every((label) => label.label.length > 0)).toBe(true);
  });
});
