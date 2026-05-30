import type { FrameDraft, RackResult } from "../../types";

export const EMPTY_FRAME: FrameDraft = [null, null, null];

export function selectRackOutcome(
  draft: FrameDraft,
  rackIndex: number,
  outcome: RackResult,
): FrameDraft {
  assertRackIndex(rackIndex);
  const next = [...draft] as FrameDraft;
  next[rackIndex] = outcome;
  return next;
}

export function clearRackOutcome(draft: FrameDraft, rackIndex: number): FrameDraft {
  assertRackIndex(rackIndex);
  const next = [...draft] as FrameDraft;
  next[rackIndex] = null;
  return next;
}

export function toggleRackCell(
  draft: FrameDraft,
  rackIndex: number,
  outcome: RackResult,
): FrameDraft {
  assertRackIndex(rackIndex);
  if (draft[rackIndex] === outcome) {
    return clearRackOutcome(draft, rackIndex);
  }
  return selectRackOutcome(draft, rackIndex, outcome);
}

export function canSubmitFrame(draft: FrameDraft): boolean {
  return draft.every((selection) => selection !== null);
}

export function draftToResults(draft: FrameDraft): [RackResult, RackResult, RackResult] {
  if (!canSubmitFrame(draft)) {
    throw new Error("Cannot convert incomplete frame draft");
  }
  return draft as [RackResult, RackResult, RackResult];
}

export function frameTally(draft: FrameDraft): { wins: number; losses: number } | null {
  if (!canSubmitFrame(draft)) {
    return null;
  }
  const wins = draft.filter((selection) => selection === "win").length;
  return { wins, losses: 3 - wins };
}

function assertRackIndex(rackIndex: number): void {
  if (rackIndex < 0 || rackIndex > 2) {
    throw new RangeError(`Invalid rack index: ${rackIndex}`);
  }
}
