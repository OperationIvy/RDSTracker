import {
  formatWinRate,
  hasLevelStats,
  winRate,
  winRateColor,
  type LevelStats,
} from "@/modules/stats/level-stats";

interface LevelStatsDisplayProps {
  stats: LevelStats;
}

function StatLine({
  wins,
  losses,
  label,
}: {
  wins: number;
  losses: number;
  label: "frames" | "racks";
}) {
  const total = wins + losses;
  const rate = winRate(wins, total);

  return (
    <p className="level-stats-line">
      <span className="stat-wins">{wins}</span>-<span className="stat-losses">{losses}</span>{" "}
      <span className="stat-rate" style={{ color: winRateColor(rate) }}>
        ({formatWinRate(wins, total)})
      </span>{" "}
      {label}
    </p>
  );
}

export function LevelStatsDisplay({ stats }: LevelStatsDisplayProps) {
  if (!hasLevelStats(stats)) {
    return null;
  }

  const frameTotal = stats.frameWins + stats.frameLosses;
  const rackTotal = stats.rackWins + stats.rackLosses;

  return (
    <div className="level-stats">
      {frameTotal > 0 && (
        <StatLine wins={stats.frameWins} losses={stats.frameLosses} label="frames" />
      )}
      {rackTotal > 0 && (
        <StatLine wins={stats.rackWins} losses={stats.rackLosses} label="racks" />
      )}
    </div>
  );
}
