import type { FrameRecord, RackRecord } from "@/types";

export interface WinRatePoint {
  index: number;
  timestamp: Date;
  rate: number;
}

export interface LevelWinRateSeries {
  frameSeries: WinRatePoint[];
  rackSeries: WinRatePoint[];
  frameWinRate: number;
  rackWinRate: number;
}

export interface LevelHistoryPoint {
  index: number;
  timestamp: Date;
  level: number;
}

export interface DateAxisLabel {
  index: number;
  label: string;
}

function sortByTimestamp<T extends { timestamp: string }>(records: T[]): T[] {
  return [...records].sort(
    (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
}

function cumulativeWinRate<T extends { timestamp: string }>(
  records: T[],
  isWin: (record: T) => boolean,
): WinRatePoint[] {
  let wins = 0;

  return records.map((record, index) => {
    if (isWin(record)) {
      wins += 1;
    }

    return {
      index,
      timestamp: new Date(record.timestamp),
      rate: wins / (index + 1),
    };
  });
}

export function buildLevelWinRateSeries(
  level: number,
  frames: FrameRecord[],
  racks: RackRecord[],
): LevelWinRateSeries {
  const levelFrames = sortByTimestamp(frames.filter((frame) => frame.levelBefore === level));
  const levelRacks = sortByTimestamp(racks.filter((rack) => rack.level === level));

  const frameSeries = cumulativeWinRate(levelFrames, (frame) => frame.wins >= 2);
  const rackSeries = cumulativeWinRate(levelRacks, (rack) => rack.result === "win");

  const frameWinRate =
    levelFrames.length === 0
      ? 0
      : levelFrames.filter((frame) => frame.wins >= 2).length / levelFrames.length;
  const rackWinRate =
    levelRacks.length === 0
      ? 0
      : levelRacks.filter((rack) => rack.result === "win").length / levelRacks.length;

  return { frameSeries, rackSeries, frameWinRate, rackWinRate };
}

export function buildLevelHistorySeries(frames: FrameRecord[]): LevelHistoryPoint[] {
  return sortByTimestamp(frames).map((frame, index) => ({
    index,
    timestamp: new Date(frame.timestamp),
    level: frame.levelBefore,
  }));
}

function formatAxisDate(date: Date, spanDays: number): string {
  if (spanDays <= 1) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  if (spanDays <= 14) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
}

export function buildDateAxisLabels(points: { index: number; timestamp: Date }[]): DateAxisLabel[] {
  if (points.length === 0) {
    return [];
  }

  if (points.length === 1) {
    return [{ index: 0, label: formatAxisDate(points[0].timestamp, 0) }];
  }

  const first = points[0].timestamp.getTime();
  const last = points[points.length - 1].timestamp.getTime();
  const spanDays = (last - first) / (1000 * 60 * 60 * 24);
  const tickCount = Math.min(5, points.length);
  const labels: DateAxisLabel[] = [];

  for (let tick = 0; tick < tickCount; tick += 1) {
    const index = Math.round((tick / (tickCount - 1)) * (points.length - 1));
    const point = points[index];

    if (!labels.some((label) => label.index === index)) {
      labels.push({ index, label: formatAxisDate(point.timestamp, spanDays) });
    }
  }

  return labels;
}
