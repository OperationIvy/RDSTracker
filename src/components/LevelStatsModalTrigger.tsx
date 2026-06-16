import { useMemo, useState } from "react";
import { ChartIconButton } from "@/components/ChartIconButton";
import { Modal } from "@/components/Modal";
import { WinRateChart } from "@/components/StatsCharts";
import { buildLevelWinRateSeries } from "@/modules/stats/chart-data";
import type { FrameRecord, RackRecord } from "@/types";

interface LevelStatsModalTriggerProps {
  level: number;
  history: { frames: FrameRecord[]; racks: RackRecord[] };
}

export function LevelStatsModalTrigger({ level, history }: LevelStatsModalTriggerProps) {
  const [open, setOpen] = useState(false);
  const series = useMemo(
    () => buildLevelWinRateSeries(level, history.frames, history.racks),
    [history.frames, history.racks, level],
  );
  const hasData = series.frameSeries.length > 0 || series.rackSeries.length > 0;

  return (
    <>
      <ChartIconButton label="Level stats" onClick={() => setOpen(true)} disabled={!hasData} />
      {open && (
        <Modal title={`Level ${level} stats`} onClose={() => setOpen(false)}>
          <WinRateChart
            frameSeries={series.frameSeries}
            rackSeries={series.rackSeries}
            frameWinRate={series.frameWinRate}
            rackWinRate={series.rackWinRate}
          />
        </Modal>
      )}
    </>
  );
}
