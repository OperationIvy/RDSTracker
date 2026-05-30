import { describe, expect, it } from "vitest";
import { MemoryPersistence, RdsStore } from "./store";

describe("RdsStore", () => {
  it("persists current level", async () => {
    const store = new RdsStore(new MemoryPersistence());
    expect(await store.getCurrentLevel()).toBeNull();

    await store.setCurrentLevel(5);
    expect(await store.getCurrentLevel()).toBe(5);
  });

  it("writes one frame and three rack records on submit", async () => {
    const adapter = new MemoryPersistence();
    const store = new RdsStore(adapter);

    await store.setCurrentLevel(7);
    const outcome = await store.submitFrame(["win", "loss", "win"], 7);

    expect(outcome).toMatchObject({
      aggregate: "2-1",
      levelBefore: 7,
      levelAfter: 8,
    });

    const history = await store.getHistory();
    expect(history.frames).toHaveLength(1);
    expect(history.racks).toHaveLength(3);
    expect(history.frames[0]?.aggregate).toBe("2-1");
    expect(history.racks.every((rack) => rack.level === 7)).toBe(true);
    expect(await store.getCurrentLevel()).toBe(8);
  });

  it("appends multiple frames over time", async () => {
    const store = new RdsStore(new MemoryPersistence());
    await store.setCurrentLevel(4);

    await store.submitFrame(["loss", "loss", "loss"], 4);
    await store.submitFrame(["win", "win", "loss"], 3);

    const history = await store.getHistory();
    expect(history.frames).toHaveLength(2);
    expect(history.racks).toHaveLength(6);
    expect(await store.getCurrentLevel()).toBe(4);
  });
});
