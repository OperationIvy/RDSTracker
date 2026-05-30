import { getLevel, GENERAL_RULES } from "@/modules/level-catalog/levels";
import { getLevelDiagram } from "@/modules/level-catalog/rack-layouts";
import { RackDiagram } from "@/components/RackDiagram";

interface LevelViewProps {
  level: number;
}

export function LevelView({ level }: LevelViewProps) {
  const definition = getLevel(level);
  const diagram = getLevelDiagram(level);

  return (
    <section className="level-view">
      <header className="level-header">
        <h1>
          Level {definition.level}
          {definition.optional ? " (optional)" : ""}
        </h1>
        <p className="level-rating">{definition.rating}</p>
        <p className="level-title">{definition.title}</p>
      </header>

      <div className="diagram-wrap">
        <RackDiagram spec={diagram} level={level} />
      </div>

      <ol className="level-instructions">
        {definition.instructions.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <details className="general-rules">
        <summary>General RDS rules</summary>
        <ul>
          {GENERAL_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
