import type { AppData, FrameOutcome, FrameRecord, RackRecord, RackResult } from "../../types";
import { scoreFrame } from "../frame-scoring/score-frame";

const STORAGE_KEY = "rds-tracker-data";

export interface PersistenceAdapter {
  load(): Promise<AppData>;
  save(data: AppData): Promise<void>;
}

export function createEmptyData(): AppData {
  return { currentLevel: null, frames: [], racks: [] };
}

export class MemoryPersistence implements PersistenceAdapter {
  private data: AppData = createEmptyData();

  async load(): Promise<AppData> {
    return structuredClone(this.data);
  }

  async save(data: AppData): Promise<void> {
    this.data = structuredClone(data);
  }

  snapshot(): AppData {
    return structuredClone(this.data);
  }
}

export class LocalStoragePersistence implements PersistenceAdapter {
  async load(): Promise<AppData> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyData();
    }
    return JSON.parse(raw) as AppData;
  }

  async save(data: AppData): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export class RdsStore {
  constructor(private readonly adapter: PersistenceAdapter) {}

  async getCurrentLevel(): Promise<number | null> {
    const data = await this.adapter.load();
    return data.currentLevel;
  }

  async setCurrentLevel(level: number): Promise<void> {
    const data = await this.adapter.load();
    data.currentLevel = level;
    await this.adapter.save(data);
  }

  async submitFrame(
    rackResults: [RackResult, RackResult, RackResult],
    currentLevel: number,
  ): Promise<FrameOutcome> {
    const data = await this.adapter.load();
    const outcome = scoreFrame(rackResults, currentLevel);
    const timestamp = new Date().toISOString();
    const frameId = crypto.randomUUID();

    const frame: FrameRecord = {
      id: frameId,
      timestamp,
      levelBefore: outcome.levelBefore,
      levelAfter: outcome.levelAfter,
      wins: outcome.wins,
      losses: outcome.losses,
      aggregate: outcome.aggregate,
    };

    const racks: RackRecord[] = rackResults.map((result, index) => ({
      id: crypto.randomUUID(),
      frameId,
      rackNumber: (index + 1) as 1 | 2 | 3,
      level: outcome.levelBefore,
      result,
      timestamp,
    }));

    data.frames.push(frame);
    data.racks.push(...racks);
    data.currentLevel = outcome.levelAfter;
    await this.adapter.save(data);

    return outcome;
  }

  async getHistory(): Promise<{ frames: FrameRecord[]; racks: RackRecord[] }> {
    const data = await this.adapter.load();
    return { frames: data.frames, racks: data.racks };
  }

  async clearAllData(): Promise<void> {
    await this.adapter.save(createEmptyData());
  }
}

export function createBrowserStore(): RdsStore {
  return new RdsStore(new LocalStoragePersistence());
}
