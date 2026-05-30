import { useCallback, useEffect, useMemo, useState } from "react";
import { LevelPicker } from "@/components/LevelPicker";
import { LevelView } from "@/components/LevelView";
import { ScoringGrid } from "@/components/ScoringGrid";
import { createBrowserStore } from "@/modules/persistence/store";
import {
  canSubmitFrame,
  draftToResults,
  EMPTY_FRAME,
  frameTally,
} from "@/modules/session/session-state";
import { computeLevelStats } from "@/modules/stats/level-stats";
import type { FrameDraft, FrameOutcome, FrameRecord, RackRecord } from "@/types";

const store = createBrowserStore();

const EMPTY_HISTORY = { frames: [] as FrameRecord[], racks: [] as RackRecord[] };

export function App() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [draft, setDraft] = useState<FrameDraft>(EMPTY_FRAME);
  const [changingLevel, setChangingLevel] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<FrameOutcome | null>(null);
  const [history, setHistory] = useState(EMPTY_HISTORY);
  const [loading, setLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    setHistory(await store.getHistory());
  }, []);

  useEffect(() => {
    void (async () => {
      const level = await store.getCurrentLevel();
      setCurrentLevel(level);
      await refreshHistory();
      setLoading(false);
    })();
  }, [refreshHistory]);

  const tally = useMemo(() => frameTally(draft), [draft]);
  const showSubmit = canSubmitFrame(draft);
  const levelStats = useMemo(() => {
    if (currentLevel === null) {
      return null;
    }
    return computeLevelStats(currentLevel, history.frames, history.racks);
  }, [currentLevel, history]);

  const handleLevelSelect = useCallback(async (level: number) => {
    await store.setCurrentLevel(level);
    setCurrentLevel(level);
    setDraft(EMPTY_FRAME);
    setLastOutcome(null);
    setChangingLevel(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (currentLevel === null || !canSubmitFrame(draft)) {
      return;
    }

    const outcome = await store.submitFrame(draftToResults(draft), currentLevel);
    setCurrentLevel(outcome.levelAfter);
    setDraft(EMPTY_FRAME);
    setLastOutcome(outcome);
    await refreshHistory();
  }, [currentLevel, draft, refreshHistory]);

  const handleClearData = useCallback(async () => {
    await store.clearAllData();
    setCurrentLevel(null);
    setDraft(EMPTY_FRAME);
    setLastOutcome(null);
    setChangingLevel(false);
    setHistory(EMPTY_HISTORY);
  }, []);

  if (loading) {
    return <main className="app loading">Loading…</main>;
  }

  if (currentLevel === null || changingLevel) {
    return (
      <main className="app">
        {changingLevel && (
          <div className="app-toolbar">
            <button type="button" className="text-button" onClick={() => setChangingLevel(false)}>
              Cancel
            </button>
          </div>
        )}
        <LevelPicker
          onSelect={(level) => void handleLevelSelect(level)}
          onClearData={() => void handleClearData()}
          hasData={history.frames.length > 0 || history.racks.length > 0 || currentLevel !== null}
          history={history}
        />
      </main>
    );
  }

  return (
    <main className="app app-play">
      <div className="app-toolbar">
        <button type="button" className="text-button" onClick={() => setChangingLevel(true)}>
          Change level
        </button>
      </div>

      <LevelView level={currentLevel} stats={levelStats} />

      <ScoringGrid draft={draft} onChange={setDraft} />

      <footer className="frame-footer">
        {tally ? (
          <p className="frame-tally">
            Frame: {tally.wins}-{tally.losses}
          </p>
        ) : (
          <p className="frame-tally muted">Mark all 3 racks to submit</p>
        )}

        {showSubmit && (
          <button type="button" className="submit-button" onClick={() => void handleSubmit()}>
            Submit frame
          </button>
        )}
      </footer>

      {lastOutcome && (
        <div className="submit-toast" role="status">
          {lastOutcome.aggregate} — Level {lastOutcome.levelBefore} → {lastOutcome.levelAfter}
        </div>
      )}
    </main>
  );
}
