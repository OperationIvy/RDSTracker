import { describe, expect, it } from "vitest";
import {
  canSubmitFrame,
  clearRackOutcome,
  EMPTY_FRAME,
  frameTally,
  selectRackOutcome,
  toggleRackCell,
} from "./session-state";

describe("session state", () => {
  it("requires all racks before submit", () => {
    let draft = EMPTY_FRAME;
    expect(canSubmitFrame(draft)).toBe(false);

    draft = selectRackOutcome(draft, 0, "win");
    draft = selectRackOutcome(draft, 1, "loss");
    expect(canSubmitFrame(draft)).toBe(false);

    draft = selectRackOutcome(draft, 2, "win");
    expect(canSubmitFrame(draft)).toBe(true);
  });

  it("replaces win with loss for the same rack", () => {
    const draft = toggleRackCell(
      toggleRackCell(EMPTY_FRAME, 1, "win"),
      1,
      "loss",
    );
    expect(draft[1]).toBe("loss");
  });

  it("clears a rack when tapping the active cell and hides submit again", () => {
    let draft = selectRackOutcome(
      selectRackOutcome(selectRackOutcome(EMPTY_FRAME, 0, "win"), 1, "loss"),
      2,
      "win",
    );
    expect(canSubmitFrame(draft)).toBe(true);

    draft = toggleRackCell(draft, 2, "win");
    expect(draft[2]).toBeNull();
    expect(canSubmitFrame(draft)).toBe(false);
  });

  it("reports frame tally only when complete", () => {
    expect(frameTally(EMPTY_FRAME)).toBeNull();
    const complete = selectRackOutcome(
      selectRackOutcome(selectRackOutcome(EMPTY_FRAME, 0, "win"), 1, "loss"),
      2,
      "win",
    );
    expect(frameTally(complete)).toEqual({ wins: 2, losses: 1 });
  });

  it("clearRackOutcome resets a single rack", () => {
    const draft = clearRackOutcome(selectRackOutcome(EMPTY_FRAME, 0, "win"), 0);
    expect(draft[0]).toBeNull();
  });
});
