import { getAllLevels } from "@/modules/level-catalog/levels";
import { getLevelDiagram } from "@/modules/level-catalog/rack-layouts";
import { RackDiagram } from "@/components/RackDiagram";

interface LevelPickerProps {
  onSelect: (level: number) => void;
}

export function LevelPicker({ onSelect }: LevelPickerProps) {
  return (
    <section className="level-picker">
      <h1>RDS Tracker</h1>
      <p>Pick a starting level you are confident you can run 2 of 3 racks at.</p>
      <div className="level-picker-grid">
        {getAllLevels().map((level) => (
          <button
            key={level.level}
            type="button"
            className="level-picker-button"
            onClick={() => onSelect(level.level)}
          >
            <RackDiagram spec={getLevelDiagram(level.level)} level={level.level} compact />
            <span className="level-picker-number">
              {level.level}
              {level.optional ? "*" : ""}
            </span>
            <span className="level-picker-rating">{level.rating}</span>
          </button>
        ))}
      </div>
      <p className="level-picker-note">* Level 1 is optional</p>
    </section>
  );
}
