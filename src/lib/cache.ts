type CacheEntry<T> = {
  data: T;
  expiry?: number;
};

/**
 * In memory cache
 * @author Sojeb Sikder
 */
class Scache {
  private cache = new Map<string, CacheEntry<any>>();

  // mergeListingsAndDedup(oldList: any[], newList: any[]): any[] {
  //   const seen = new Set<string>();
  //   const combined = [...oldList, ...newList];

  //   return combined.filter((item) => {
  //     if (seen.has(item.id)) return false;
  //     seen.add(item.id);
  //     return true;
  //   });
  // }

  mergeAppendDedup(existing: any[], incoming: any[]): any[] {
    const seen = new Set<string>();
    const combined: any[] = [];

    for (const item of [...existing, ...incoming]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }

    return combined;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, { data, expiry });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cache = new Scache();
