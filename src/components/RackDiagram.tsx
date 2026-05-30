import type { LevelDiagramSpec, RackBall } from "@/modules/level-catalog/diagram-types";

interface RackDiagramProps {
  spec: LevelDiagramSpec;
  level: number;
  compact?: boolean;
}

interface PlacedBall extends RackBall {
  x: number;
  y: number;
}

const BALL_R = 7;
const BALL_D = BALL_R * 2;
const ROW_STEP = BALL_R * Math.sqrt(3);
const PAD = 10;

function placeRack(rows: RackBall[][]): PlacedBall[] {
  const placed: PlacedBall[] = [];
  const maxCols = Math.max(...rows.map((row) => row.length));
  const originX = (maxCols * BALL_D) / 2;

  rows.forEach((row, rowIndex) => {
    row.forEach((ball, colIndex) => {
      placed.push({
        ...ball,
        x: originX + (colIndex - (row.length - 1) / 2) * BALL_D,
        y: PAD + BALL_R + rowIndex * ROW_STEP,
      });
    });
  });

  return placed;
}

function rackBounds(balls: PlacedBall[]) {
  const xs = balls.map((b) => b.x);
  const ys = balls.map((b) => b.y);
  const minX = Math.min(...xs) - BALL_R - PAD;
  const maxX = Math.max(...xs) + BALL_R + PAD;
  const minY = Math.min(...ys) - BALL_R - PAD;
  const maxY = Math.max(...ys) + BALL_R + PAD;
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

function StripeBall({
  x,
  y,
  clipId,
  bandColor,
  label,
}: {
  x: number;
  y: number;
  clipId: string;
  bandColor: string;
  label?: string;
}) {
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <circle cx={x} cy={y} r={BALL_R - 0.5} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={BALL_R} fill="#e8e8e8" stroke="#1a1a1a" strokeWidth={0.75} />
      <rect
        x={x - BALL_R}
        y={y - 2.5}
        width={BALL_D}
        height={5}
        fill={bandColor}
        clipPath={`url(#${clipId})`}
      />
      {label && (
        <text
          x={x}
          y={y + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#111"
          fontSize={6.5}
          fontWeight={700}
          fontFamily="Segoe UI, system-ui, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function NumberedSolid({
  x,
  y,
  label,
  fill = "#d4a820",
}: {
  x: number;
  y: number;
  label: string;
  fill?: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={BALL_R} fill={fill} stroke="#1a1a1a" strokeWidth={0.75} />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#111"
        fontSize={6.5}
        fontWeight={700}
        fontFamily="Segoe UI, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

function BallGraphic({ ball, clipId }: { ball: PlacedBall; clipId: string }) {
  const { x, y, kind } = ball;

  if (kind === "plain") {
    return <circle cx={x} cy={y} r={BALL_R} fill="#7a7a7a" stroke="#4a4a4a" strokeWidth={0.75} />;
  }

  if (kind === "solid") {
    return <circle cx={x} cy={y} r={BALL_R} fill="#d4a820" stroke="#1a1a1a" strokeWidth={0.75} />;
  }

  if (kind === "stripe") {
    return <StripeBall x={x} y={y} clipId={clipId} bandColor="#2060c0" />;
  }

  if (kind === "eight") {
    return (
      <g>
        <circle cx={x} cy={y} r={BALL_R} fill="#141414" stroke="#1a1a1a" strokeWidth={0.75} />
        <text
          x={x}
          y={y + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#f0f0f0"
          fontSize={6.5}
          fontWeight={700}
          fontFamily="Segoe UI, system-ui, sans-serif"
        >
          8
        </text>
      </g>
    );
  }

  if (kind === "one") {
    return <NumberedSolid x={x} y={y} label="1" />;
  }

  if (kind === "six") {
    return <NumberedSolid x={x} y={y} label="6" fill="#52b068" />;
  }

  if (kind === "nine") {
    return <StripeBall x={x} y={y} clipId={clipId} bandColor="#d4a820" label="9" />;
  }

  return null;
}

export function RackDiagram({ spec, level, compact = false }: RackDiagramProps) {
  const balls = placeRack(spec.rows);
  const { minX, minY, width, height } = rackBounds(balls);
  const prefix = compact ? `c${level}` : `l${level}`;

  return (
    <svg
      className={compact ? "rack-diagram rack-diagram--compact" : "rack-diagram"}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      role="img"
      aria-label={`Rack diagram for level ${level}`}
    >
      <title>Level {level} rack</title>
      <rect x={minX} y={minY} width={width} height={height} fill="#1e5230" rx={compact ? 4 : 6} />
      {balls.map((ball, index) => (
        <BallGraphic key={`${prefix}-${index}`} ball={ball} clipId={`${prefix}-clip-${index}`} />
      ))}
    </svg>
  );
}
