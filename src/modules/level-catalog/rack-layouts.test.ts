import { describe, expect, it } from "vitest";
import { MAX_LEVEL, MIN_LEVEL } from "./levels";
import { getLevelDiagram, LEVEL_DIAGRAMS } from "./rack-layouts";

describe("rack layouts", () => {
  it("defines a diagram for every level 1–16", () => {
    for (let level = MIN_LEVEL; level <= MAX_LEVEL; level++) {
      const spec = getLevelDiagram(level);
      expect(spec.rows.length).toBeGreaterThan(0);
    }
  });

  it("uses standard ball counts per rack type", () => {
    const countBalls = (level: number) =>
      getLevelDiagram(level).rows.reduce((sum, row) => sum + row.length, 0);

    expect(countBalls(1)).toBe(6);
    expect(countBalls(6)).toBe(7);
    expect(countBalls(7)).toBe(9);
    expect(countBalls(9)).toBe(15);
  });

  it("uses a 9-ball diamond (5 rows) for level 7", () => {
    expect(getLevelDiagram(7).rows.map((row) => row.length)).toEqual([1, 2, 3, 2, 1]);
  });

  it("marks key balls on rule-specific levels", () => {
    const kinds = (level: number) =>
      getLevelDiagram(level)
        .rows.flat()
        .map((b) => b.kind);

    expect(kinds(7).every((k) => k === "plain")).toBe(true);

    for (const level of [6, 8, 13]) {
      const row3 = getLevelDiagram(level).rows[2]?.map((b) => b.kind);
      expect(row3).toEqual(["stripe", "eight", "solid"]);
    }

    expect(kinds(10).filter((k) => k === "one")).toHaveLength(1);
    expect(kinds(10).filter((k) => k === "six")).toHaveLength(1);

    expect(kinds(14).filter((k) => k === "one")).toHaveLength(1);
    expect(kinds(14).filter((k) => k === "nine")).toHaveLength(1);

    for (const level of [12, 15]) {
      const backRow = getLevelDiagram(level).rows[4]?.map((b) => b.kind);
      expect(backRow?.[0]).toBe("solid");
      expect(backRow?.[4]).toBe("stripe");
      expect(kinds(level).filter((k) => k === "solid")).toHaveLength(1);
      expect(kinds(level).filter((k) => k === "stripe")).toHaveLength(1);
    }
  });

  it("maps all 16 levels", () => {
    expect(Object.keys(LEVEL_DIAGRAMS)).toHaveLength(16);
  });
});
