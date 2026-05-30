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

function StatLine({
  wins,
  losses,
  label,
  compact = false,
}: {
  wins: number;
  losses: number;
  label: "frames" | "racks";
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
      {label}
    </p>
  );
}

export function LevelStatsDisplay({ stats, compact = false }: LevelStatsDisplayProps) {
  if (!hasLevelStats(stats)) {
    return null;
  }

  const frameTotal = stats.frameWins + stats.frameLosses;
  const rackTotal = stats.rackWins + stats.rackLosses;

  return (
    <div className={`level-stats${compact ? " level-stats--compact" : ""}`}>
      {frameTotal > 0 && (
        <StatLine
          wins={stats.frameWins}
          losses={stats.frameLosses}
          label="frames"
          compact={compact}
        />
      )}
      {rackTotal > 0 && (
        <StatLine wins={stats.rackWins} losses={stats.rackLosses} label="racks" compact={compact} />
      )}
    </div>
  );
}
