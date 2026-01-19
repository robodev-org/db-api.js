import type { CacheAdapter, CacheEntry } from "../types";

export class InMemoryCacheAdapter implements CacheAdapter {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): CacheEntry<T> | undefined {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    return entry;
  }

  set<T>(key: string, entry: CacheEntry<T>): void {
    this.store.set(key, entry as CacheEntry<unknown>);
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  sweep(now: number = Date.now()): void {
    for (const [key, entry] of this.store.entries()) {
      if (entry.staleUntil <= now) {
        this.store.delete(key);
      }
    }
  }

  stats(): { size: number } {
    return { size: this.store.size };
  }
}
