import { useMemo, useState } from "react";
import { ChartIconButton } from "@/components/ChartIconButton";
import { Modal } from "@/components/Modal";
import { LevelHistoryChart } from "@/components/StatsCharts";
import { buildDateAxisLabels, buildLevelHistorySeries } from "@/modules/stats/chart-data";
import type { FrameRecord } from "@/types";

interface LevelHistoryModalTriggerProps {
  frames: FrameRecord[];
}

export function LevelHistoryModalTrigger({ frames }: LevelHistoryModalTriggerProps) {
  const [open, setOpen] = useState(false);
  const points = useMemo(() => buildLevelHistorySeries(frames), [frames]);
  const dateLabels = useMemo(() => buildDateAxisLabels(points), [points]);

  return (
    <>
      <ChartIconButton
        label="Level history"
        onClick={() => setOpen(true)}
        disabled={points.length === 0}
        variant="history"
      />
      {open && (
        <Modal title="Level history" onClose={() => setOpen(false)}>
          <LevelHistoryChart points={points} dateLabels={dateLabels} />
        </Modal>
      )}
    </>
  );
}
