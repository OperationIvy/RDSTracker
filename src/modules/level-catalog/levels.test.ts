import { describe, expect, it } from "vitest";
import { getAllLevels, getLevel, MAX_LEVEL, MIN_LEVEL } from "./levels";

describe("level catalog", () => {
  it("exposes 16 levels from 1 to 16", () => {
    const levels = getAllLevels();
    expect(levels).toHaveLength(16);
    expect(levels[0]?.level).toBe(MIN_LEVEL);
    expect(levels.at(-1)?.level).toBe(MAX_LEVEL);
  });

  it("marks level 1 as optional", () => {
    expect(getLevel(1).optional).toBe(true);
  });

  it("includes required fields for every level", () => {
    for (const level of getAllLevels()) {
      expect(level.title.length).toBeGreaterThan(0);
      expect(level.rating.length).toBeGreaterThan(0);
      expect(level.diagramPath).toMatch(/^\/diagrams\/level-\d{2}\.png$/);
      expect(level.instructions.length).toBeGreaterThan(0);
    }
  });
});
