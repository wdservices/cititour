import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@citivas/cache/';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class DataCache {
  private memStore = new Map<string, CacheEntry<any>>();
  private loaded = false;
  private loadPromise: Promise<void> | null = null;

  constructor() {
    this.loadFromDisk();
  }

  private async loadFromDisk() {
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
        if (cacheKeys.length === 0) { this.loaded = true; return; }
        const pairs = await AsyncStorage.multiGet(cacheKeys);
        const now = Date.now();
        for (const [rawKey, rawValue] of pairs) {
          if (!rawValue) continue;
          try {
            const entry: CacheEntry<any> = JSON.parse(rawValue);
            if (now - entry.timestamp < entry.ttl) {
              const memKey = rawKey.slice(CACHE_PREFIX.length);
              this.memStore.set(memKey, entry);
            }
          } catch { /* corrupted entry, skip */ }
        }
      } catch (e) {
        console.warn('[Cache] Failed to load from disk:', e);
      } finally {
        this.loaded = true;
      }
    })();
    return this.loadPromise;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const effectiveTtl = ttl || DEFAULT_TTL;
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl: effectiveTtl };
    this.memStore.set(key, entry);
    // Write-through to disk (fire and forget)
    AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry)).catch(() => {});
  }

  get<T>(key: string): T | null {
    const entry = this.memStore.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp >= entry.ttl) {
      this.memStore.delete(key);
      AsyncStorage.removeItem(CACHE_PREFIX + key).catch(() => {});
      return null;
    }
    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  invalidate(key: string): void {
    this.memStore.delete(key);
    AsyncStorage.removeItem(CACHE_PREFIX + key).catch(() => {});
  }

  invalidatePrefix(prefix: string): void {
    const toRemove: string[] = [];
    for (const memKey of this.memStore.keys()) {
      if (memKey.startsWith(prefix)) {
        this.memStore.delete(memKey);
        toRemove.push(CACHE_PREFIX + memKey);
      }
    }
    if (toRemove.length > 0) {
      AsyncStorage.multiRemove(toRemove).catch(() => {});
    }
  }

  clear(): void {
    this.memStore.clear();
    AsyncStorage.getAllKeys().then((keys) => {
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      AsyncStorage.multiRemove(cacheKeys).catch(() => {});
    }).catch(() => {});
  }

  keys(): string[] {
    return Array.from(this.memStore.keys());
  }
}

export const dataCache = new DataCache();

export function cacheKey(collection: string, ...parts: (string | undefined)[]): string {
  return [collection, ...parts.filter(Boolean)].join('/');
}
