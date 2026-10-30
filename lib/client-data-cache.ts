'use client';

interface CacheEntry {
  value: unknown;
  updatedAt: number;
}

const cache = new Map<string, CacheEntry>();
const FRESH_FOR_MS = 30_000;
const KEEP_FOR_MS = 10 * 60_000;

export function getClientData<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.updatedAt > KEEP_FOR_MS) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function hasFreshClientData(key: string): boolean {
  const entry = cache.get(key);
  return !!entry && Date.now() - entry.updatedAt < FRESH_FOR_MS;
}

export function setClientData<T>(key: string, value: T): void {
  cache.set(key, { value, updatedAt: Date.now() });
}

export function clearClientData(key: string): void {
  cache.delete(key);
}

export function clearAllClientData(): void {
  cache.clear();
}
