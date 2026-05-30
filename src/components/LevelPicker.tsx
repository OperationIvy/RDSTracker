import { useState } from "react";
import { GeneralRules } from "@/components/GeneralRules";
import { LevelStatsDisplay } from "@/components/LevelStatsDisplay";
import { getAllLevels } from "@/modules/level-catalog/levels";
import { getLevelDiagram } from "@/modules/level-catalog/rack-layouts";
import { computeLevelStats, hasLevelStats } from "@/modules/stats/level-stats";
import { RackDiagram } from "@/components/RackDiagram";
import type { FrameRecord, RackRecord } from "@/types";

interface LevelPickerProps {
  onSelect: (level: number) => void;
  onClearData: () => void;
  hasData: boolean;
  history: { frames: FrameRecord[]; racks: RackRecord[] };
}

export function LevelPicker({ onSelect, onClearData, hasData, history }: LevelPickerProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  return (
    <section className="level-picker">
      <h1>Runout Drill System Tracker</h1>
      <p className="level-picker-byline">
        Based on Dr. Dave&apos;s{" "}
        <a
          href="https://drdavepoolinfo.com/faq/drill/rds/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Runout Drill System
        </a>
      </p>
      <GeneralRules />
      <p>Pick a starting level you are confident you can run 2 of 3 racks at.</p>
      <div className="level-picker-grid">
        {getAllLevels().map((level) => {
          const stats = computeLevelStats(level.level, history.frames, history.racks);

          return (
            <button
              key={level.level}
              type="button"
              className="level-picker-button"
              onClick={() => onSelect(level.level)}
            >
              <RackDiagram spec={getLevelDiagram(level.level)} level={level.level} compact />
              <div className="level-picker-heading">
                <span className="level-picker-number">
                  {level.level}
                  {level.optional ? "*" : ""}
                </span>
                {hasLevelStats(stats) && <LevelStatsDisplay stats={stats} compact />}
              </div>
              <span className="level-picker-rating">{level.rating}</span>
            </button>
          );
        })}
      </div>
      <p className="level-picker-note">* Level 1 is optional</p>

      {hasData && (
        <div className="level-picker-actions">
          {!confirmingClear ? (
            <button
              type="button"
              className="danger-button"
              onClick={() => setConfirmingClear(true)}
            >
              Clear stats &amp; results
            </button>
          ) : (
            <div className="clear-confirm" role="alertdialog" aria-labelledby="clear-confirm-title">
              <p id="clear-confirm-title" className="clear-confirm-title">
                Delete all data?
              </p>
              <p className="clear-confirm-body">
                This permanently deletes your level, frame history, and rack results. This cannot
                be undone.
              </p>
              <div className="clear-confirm-actions">
                <button type="button" className="text-button" onClick={() => setConfirmingClear(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="danger-button danger-button--solid"
                  onClick={() => {
                    setConfirmingClear(false);
                    onClearData();
                  }}
                >
                  Delete all data
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
