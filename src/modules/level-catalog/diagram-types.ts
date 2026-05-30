/** How a ball is drawn — plain gray unless rules require a key ball. */
export type BallKind = "plain" | "solid" | "stripe" | "eight" | "one" | "six" | "nine";

export interface RackBall {
  kind: BallKind;
}

/** Rack rows, apex first. Triangle or diamond (1-2-3-2-1 for 9-ball). */
export type RackLayout = RackBall[][];

export interface LevelDiagramSpec {
  rows: RackLayout;
}
