interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class DataCache {
  private store = new Map<string, CacheEntry<any>>();
  private TTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl?: number): void {
    this.store.set(key, { data, timestamp: Date.now() });
    const timeout = ttl || this.TTL;
    setTimeout(() => this.store.delete(key), timeout);
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    return entry.data as T;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }
}

export const dataCache = new DataCache();

export function cacheKey(collection: string, ...parts: (string | undefined)[]): string {
  return [collection, ...parts.filter(Boolean)].join('/');
}
