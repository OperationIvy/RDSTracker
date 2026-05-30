import type { FrameDraft } from "@/types";
import { toggleRackCell } from "@/modules/session/session-state";

interface ScoringGridProps {
  draft: FrameDraft;
  onChange: (draft: FrameDraft) => void;
}

const RACKS = [0, 1, 2] as const;

export function ScoringGrid({ draft, onChange }: ScoringGridProps) {
  return (
    <section className="scoring-grid" aria-label="Frame results">
      <div className="grid-header">
        <div className="grid-corner" />
        {RACKS.map((rackIndex) => (
          <div key={rackIndex} className="grid-col-label">
            Rack {rackIndex + 1}
          </div>
        ))}
      </div>

      <GridRow
        label="Win"
        outcome="win"
        draft={draft}
        onChange={onChange}
        symbol="✓"
        className="win-row"
      />
      <GridRow
        label="Loss"
        outcome="loss"
        draft={draft}
        onChange={onChange}
        symbol="✕"
        className="loss-row"
      />
    </section>
  );
}

interface GridRowProps {
  label: string;
  outcome: "win" | "loss";
  draft: FrameDraft;
  onChange: (draft: FrameDraft) => void;
  symbol: string;
  className: string;
}

function GridRow({ label, outcome, draft, onChange, symbol, className }: GridRowProps) {
  return (
    <div className={`grid-row ${className}`}>
      <div className="grid-row-label">{label}</div>
      {RACKS.map((rackIndex) => {
        const selected = draft[rackIndex] === outcome;
        return (
          <button
            key={rackIndex}
            type="button"
            className={`grid-cell ${selected ? "selected" : ""}`}
            aria-pressed={selected}
            aria-label={`Rack ${rackIndex + 1} ${label}`}
            onClick={() => onChange(toggleRackCell(draft, rackIndex, outcome))}
          >
            {selected ? symbol : ""}
          </button>
        );
      })}
    </div>
  );
}
