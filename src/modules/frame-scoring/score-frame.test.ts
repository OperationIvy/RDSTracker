import { describe, expect, it } from "vitest";
import { scoreFrame } from "./score-frame";

describe("scoreFrame", () => {
  it("advances on 2 of 3 wins", () => {
    expect(scoreFrame(["win", "loss", "win"], 7)).toMatchObject({
      wins: 2,
      losses: 1,
      aggregate: "2-1",
      levelBefore: 7,
      levelAfter: 8,
      levelChange: 1,
    });
  });

  it("advances on 3 of 3 wins", () => {
    expect(scoreFrame(["win", "win", "win"], 7).levelAfter).toBe(8);
  });

  it("stays on exactly 1 win", () => {
    expect(scoreFrame(["win", "loss", "loss"], 7)).toMatchObject({
      aggregate: "1-2",
      levelBefore: 7,
      levelAfter: 7,
      levelChange: 0,
    });
  });

  it("drops on 0 wins", () => {
    expect(scoreFrame(["loss", "loss", "loss"], 7)).toMatchObject({
      aggregate: "0-3",
      levelBefore: 7,
      levelAfter: 6,
      levelChange: -1,
    });
  });

  it("clamps at level 16", () => {
    expect(scoreFrame(["win", "win", "loss"], 16).levelAfter).toBe(16);
  });

  it("clamps at level 1", () => {
    expect(scoreFrame(["loss", "loss", "loss"], 1).levelAfter).toBe(1);
  });
});
