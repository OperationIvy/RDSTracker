export type RackResult = "win" | "loss";

export type RackSelection = RackResult | null;

export type FrameDraft = [RackSelection, RackSelection, RackSelection];

export interface FrameRecord {
  id: string;
  timestamp: string;
  levelBefore: number;
  levelAfter: number;
  wins: number;
  losses: number;
  aggregate: string;
}

export interface RackRecord {
  id: string;
  frameId: string;
  rackNumber: 1 | 2 | 3;
  level: number;
  result: RackResult;
  timestamp: string;
}

export interface FrameOutcome {
  wins: number;
  losses: number;
  aggregate: string;
  levelBefore: number;
  levelAfter: number;
  levelChange: -1 | 0 | 1;
}

export interface AppData {
  currentLevel: number | null;
  frames: FrameRecord[];
  racks: RackRecord[];
}
