import {
  formatWinRate,
  hasLevelStats,
  winRate,
  winRateColor,
  type LevelStats,
} from "@/modules/stats/level-stats";

interface LevelStatsDisplayProps {
  stats: LevelStats;
  compact?: boolean;
}

function FrameStatLine({
  wins,
  losses,
  pushes,
  compact = false,
}: {
  wins: number;
  losses: number;
  pushes: number;
  compact?: boolean;
}) {
  const total = wins + losses + pushes;
  const rate = winRate(wins, total);

  return (
    <p className={`level-stats-line${compact ? " level-stats-line--compact" : ""}`}>
      <span className="stat-wins">{wins}</span>-<span className="stat-losses">{losses}</span>-
      <span className="stat-pushes">{pushes}</span>{" "}
      <span className="stat-rate" style={{ color: winRateColor(rate) }}>
        ({formatWinRate(wins, total)})
      </span>{" "}
      frames
    </p>
  );
}

function RackStatLine({
  wins,
  losses,
  compact = false,
}: {
  wins: number;
  losses: number;
  compact?: boolean;
}) {
  const total = wins + losses;
  const rate = winRate(wins, total);

  return (
    <p className={`level-stats-line${compact ? " level-stats-line--compact" : ""}`}>
      <span className="stat-wins">{wins}</span>-<span className="stat-losses">{losses}</span>{" "}
      <span className="stat-rate" style={{ color: winRateColor(rate) }}>
        ({formatWinRate(wins, total)})
      </span>{" "}
      racks
    </p>
  );
}

export function LevelStatsDisplay({ stats, compact = false }: LevelStatsDisplayProps) {
  if (!hasLevelStats(stats)) {
    return null;
  }

  const frameTotal = stats.frameWins + stats.frameLosses + stats.framePushes;
  const rackTotal = stats.rackWins + stats.rackLosses;

  return (
    <div className={`level-stats${compact ? " level-stats--compact" : ""}`}>
      {frameTotal > 0 && (
        <FrameStatLine
          wins={stats.frameWins}
          losses={stats.frameLosses}
          pushes={stats.framePushes}
          compact={compact}
        />
      )}
      {rackTotal > 0 && (
        <RackStatLine wins={stats.rackWins} losses={stats.rackLosses} compact={compact} />
      )}
    </div>
  );
}
