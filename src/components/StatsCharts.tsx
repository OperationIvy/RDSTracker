import { winRateColor } from "@/modules/stats/level-stats";

const CHART_PADDING = { top: 12, right: 12, bottom: 28, left: 36 };

interface ChartDimensions {
  width: number;
  height: number;
}

function getPlotArea({ width, height }: ChartDimensions) {
  return {
    width: width - CHART_PADDING.left - CHART_PADDING.right,
    height: height - CHART_PADDING.top - CHART_PADDING.bottom,
  };
}

function xForIndex(index: number, count: number, plotWidth: number): number {
  if (count <= 1) {
    return plotWidth / 2;
  }

  return (index / (count - 1)) * plotWidth;
}

function yForRate(rate: number, plotHeight: number): number {
  return plotHeight - rate * plotHeight;
}

function yForLevel(level: number, plotHeight: number, minLevel = 1, maxLevel = 16): number {
  const span = maxLevel - minLevel;
  return plotHeight - ((level - minLevel) / span) * plotHeight;
}

function pointsToPath(points: { x: number; y: number }[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

interface LineSeriesProps {
  points: { index: number; rate: number }[];
  color: string;
  dimensions: ChartDimensions;
}

function LineSeries({ points, color, dimensions }: LineSeriesProps) {
  const plot = getPlotArea(dimensions);

  if (points.length === 0) {
    return null;
  }

  const mapped = points.map((point) => ({
    x: CHART_PADDING.left + xForIndex(point.index, points.length, plot.width),
    y: CHART_PADDING.top + yForRate(point.rate, plot.height),
  }));

  return (
    <>
      <path d={pointsToPath(mapped)} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {mapped.map((point, index) => (
        <circle key={points[index].index} cx={point.x} cy={point.y} r="3" fill={color} />
      ))}
    </>
  );
}

interface WinRateChartProps {
  frameSeries: { index: number; rate: number }[];
  rackSeries: { index: number; rate: number }[];
  frameWinRate: number;
  rackWinRate: number;
}

export function WinRateChart({
  frameSeries,
  rackSeries,
  frameWinRate,
  rackWinRate,
}: WinRateChartProps) {
  const width = 320;
  const height = 180;
  const plot = getPlotArea({ width, height });
  const count = Math.max(frameSeries.length, rackSeries.length, 1);
  const yTicks = [0, 0.5, 1];

  if (frameSeries.length === 0 && rackSeries.length === 0) {
    return <p className="chart-empty">No history at this level yet.</p>;
  }

  return (
    <div className="chart-stack">
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Win rate over time">
        {yTicks.map((tick) => {
          const y = CHART_PADDING.top + yForRate(tick, plot.height);
          return (
            <g key={tick}>
              <line
                x1={CHART_PADDING.left}
                x2={width - CHART_PADDING.right}
                y1={y}
                y2={y}
                className="chart-grid-line"
              />
              <text x={CHART_PADDING.left - 6} y={y + 4} className="chart-axis-label chart-axis-label--y">
                {Math.round(tick * 100)}%
              </text>
            </g>
          );
        })}

        <LineSeries points={frameSeries} color="#69f0ae" dimensions={{ width, height }} />
        <LineSeries points={rackSeries} color="#8ab4ff" dimensions={{ width, height }} />

        <text x={CHART_PADDING.left} y={height - 8} className="chart-axis-label">
          Start
        </text>
        <text x={width - CHART_PADDING.right} y={height - 8} className="chart-axis-label chart-axis-label--end">
          Latest ({count})
        </text>
      </svg>

      <div className="chart-legend">
        <span className="chart-legend-item">
          <span className="chart-legend-swatch" style={{ background: "#69f0ae" }} />
          Frame win rate
        </span>
        <span className="chart-legend-item">
          <span className="chart-legend-swatch" style={{ background: "#8ab4ff" }} />
          Rack win rate
        </span>
      </div>

      <div className="chart-bars">
        <div className="chart-bar-row">
          <span className="chart-bar-label">Frames</span>
          <div className="chart-bar-track">
            <div
              className="chart-bar-fill"
              style={{ width: `${frameWinRate * 100}%`, background: winRateColor(frameWinRate) }}
            />
          </div>
          <span className="chart-bar-value">{Math.round(frameWinRate * 1000) / 10}%</span>
        </div>
        <div className="chart-bar-row">
          <span className="chart-bar-label">Racks</span>
          <div className="chart-bar-track">
            <div
              className="chart-bar-fill"
              style={{ width: `${rackWinRate * 100}%`, background: winRateColor(rackWinRate) }}
            />
          </div>
          <span className="chart-bar-value">{Math.round(rackWinRate * 1000) / 10}%</span>
        </div>
      </div>
    </div>
  );
}

interface LevelHistoryChartProps {
  points: { index: number; timestamp: Date; level: number }[];
  dateLabels: { index: number; label: string }[];
}

export function LevelHistoryChart({ points, dateLabels }: LevelHistoryChartProps) {
  const width = 320;
  const height = 200;
  const plot = getPlotArea({ width, height });

  if (points.length === 0) {
    return <p className="chart-empty">No frame history yet.</p>;
  }

  const mapped = points.map((point) => ({
    x: CHART_PADDING.left + xForIndex(point.index, points.length, plot.width),
    y: CHART_PADDING.top + yForLevel(point.level, plot.height),
    level: point.level,
    timestamp: point.timestamp,
  }));

  const yLevels = [1, 4, 8, 12, 16];

  return (
    <div className="chart-stack">
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Level history">
        {yLevels.map((level) => {
          const y = CHART_PADDING.top + yForLevel(level, plot.height);
          return (
            <g key={level}>
              <line
                x1={CHART_PADDING.left}
                x2={width - CHART_PADDING.right}
                y1={y}
                y2={y}
                className="chart-grid-line"
              />
              <text x={CHART_PADDING.left - 6} y={y + 4} className="chart-axis-label chart-axis-label--y">
                {level}
              </text>
            </g>
          );
        })}

        <path
          d={pointsToPath(mapped)}
          fill="none"
          stroke="#8ab4ff"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {mapped.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="#69f0ae">
            <title>{`Level ${point.level} — ${point.timestamp.toLocaleString()}`}</title>
          </circle>
        ))}

        {dateLabels.map((label) => {
          const x = CHART_PADDING.left + xForIndex(label.index, points.length, plot.width);
          return (
            <text key={`${label.index}-${label.label}`} x={x} y={height - 8} className="chart-axis-label">
              {label.label}
            </text>
          );
        })}
      </svg>

      <p className="chart-caption">
        Each point is one frame, spaced evenly by play order. Date labels mark where those frames fall in time.
      </p>
    </div>
  );
}
