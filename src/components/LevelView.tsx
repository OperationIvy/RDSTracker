import { getLevel } from "@/modules/level-catalog/levels";
import { getLevelDiagram } from "@/modules/level-catalog/rack-layouts";
import { RackDiagram } from "@/components/RackDiagram";
import { LevelStatsDisplay } from "@/components/LevelStatsDisplay";
import type { LevelStats } from "@/modules/stats/level-stats";

interface LevelViewProps {
  level: number;
  stats?: LevelStats | null;
}

export function LevelView({ level, stats }: LevelViewProps) {
  const definition = getLevel(level);
  const diagram = getLevelDiagram(level);

  return (
    <section className="level-view">
      <header className="level-header">
        <h1>
          Level {definition.level}
          {definition.optional ? " (optional)" : ""}
        </h1>
        {stats && <LevelStatsDisplay stats={stats} />}
        <p className="level-rating">{definition.rating}</p>
        <p className="level-title">{definition.title}</p>
      </header>

      <div className="diagram-wrap">
        <div className="diagram-wrap-inner">
          <RackDiagram spec={diagram} level={level} />
          <ol className="level-instructions">
            {definition.instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
