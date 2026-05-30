import type { LevelDiagramSpec, RackBall } from "./diagram-types";

const p = (): RackBall => ({ kind: "plain" });
const s = (): RackBall => ({ kind: "solid" });
const t = (): RackBall => ({ kind: "stripe" });
const e = (): RackBall => ({ kind: "eight" });
const o = (): RackBall => ({ kind: "one" });
const x = (): RackBall => ({ kind: "six" });
const n = (): RackBall => ({ kind: "nine" });

/** 6-ball triangle — no key-ball requirements. */
export const RACK_6: LevelDiagramSpec = {
  rows: [[p()], [p(), p()], [p(), p(), p()]],
};

/** 6-ball triangle: 1 at head, 6 at back (level 10 rotation). */
export const RACK_6_ROTATION: LevelDiagramSpec = {
  rows: [[o()], [p(), p()], [p(), x(), p()]],
};

/** 7-ball: stripe & solid beside 8; other balls unrestricted (level 6). */
export const RACK_7_EIGHT_BALL: LevelDiagramSpec = {
  rows: [[p()], [p(), p()], [t(), e(), s()], [p()]],
};

/** 9-ball diamond — ball order does not matter (level 7). */
export const RACK_9_ANY_ORDER: LevelDiagramSpec = {
  rows: [[p()], [p(), p()], [p(), p(), p()], [p(), p()], [p()]],
};

/** 9-ball diamond: stripe & solid beside 8; 4 of each total per rules (levels 8, 13). */
export const RACK_9_EIGHT_BALL: LevelDiagramSpec = {
  rows: [[p()], [p(), p()], [t(), e(), s()], [p(), p()], [p()]],
};

/** 9-ball diamond: 1 on spot, 9 in center (level 14). */
export const RACK_9_NINE_BALL: LevelDiagramSpec = {
  rows: [[o()], [p(), p()], [p(), n(), p()], [p(), p()], [p()]],
};

/** 15-ball triangle — no key-ball requirements. */
export const RACK_15_ANY_ORDER: LevelDiagramSpec = {
  rows: [[p()], [p(), p()], [p(), p(), p()], [p(), p(), p(), p()], [p(), p(), p(), p(), p()]],
};

/** 15-ball triangle: 8 centered, solid & stripe on back corners (levels 12, 15). */
export const RACK_15_EIGHT_BALL: LevelDiagramSpec = {
  rows: [
    [p()],
    [p(), p()],
    [p(), e(), p()],
    [p(), p(), p(), p()],
    [s(), p(), p(), p(), t()],
  ],
};

export const LEVEL_DIAGRAMS: Record<number, LevelDiagramSpec> = {
  1: RACK_6,
  2: RACK_6,
  3: RACK_6,
  4: RACK_6,
  5: RACK_6,
  6: RACK_7_EIGHT_BALL,
  7: RACK_9_ANY_ORDER,
  8: RACK_9_EIGHT_BALL,
  9: RACK_15_ANY_ORDER,
  10: RACK_6_ROTATION,
  11: RACK_15_ANY_ORDER,
  12: RACK_15_EIGHT_BALL,
  13: RACK_9_EIGHT_BALL,
  14: RACK_9_NINE_BALL,
  15: RACK_15_EIGHT_BALL,
  16: RACK_15_ANY_ORDER,
};

export function getLevelDiagram(level: number): LevelDiagramSpec {
  const spec = LEVEL_DIAGRAMS[level];
  if (!spec) {
    throw new RangeError(`Invalid RDS level: ${level}`);
  }
  return spec;
}
