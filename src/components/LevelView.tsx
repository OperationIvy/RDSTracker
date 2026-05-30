import { getLevel, GENERAL_RULES } from "@/modules/level-catalog/levels";

interface LevelViewProps {
  level: number;
}

export function LevelView({ level }: LevelViewProps) {
  const definition = getLevel(level);

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
        <img
          src={definition.diagramPath}
          alt={`Racking diagram for level ${definition.level}`}
          className="level-diagram"
          onError={(event) => {
            event.currentTarget.classList.add("diagram-missing");
          }}
        />
        <p className="diagram-fallback">Diagram: see BU Exam IV PDF if image is missing</p>
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
