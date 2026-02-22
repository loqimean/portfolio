import type { RepoConfig } from './types';
import type { Project } from './types';

const CACHE_KEY = 'os-projects';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: Project[];
  ts: number;
  key: string;
}

/** Stable string derived from the config list — invalidates when repos change. */
function configKey(configs: RepoConfig[]): string {
  return configs.map(c => `${c.owner}/${c.repo}`).join('|');
}

/** In-memory layer — survives re-renders without JSON parse overhead. */
let memCache: CacheEntry | null = null;

export function readCache(configs: RepoConfig[]): Project[] | null {
  const key = configKey(configs);

  if (memCache && memCache.key === key && Date.now() - memCache.ts < CACHE_TTL) {
    return memCache.data;
  }

  try {
    const raw = localStorage.getItem(CACHE_KEY);

    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);

    if (entry.key !== key || Date.now() - entry.ts > CACHE_TTL) return null;

    memCache = entry;

    return entry.data;
  } catch {
    return null;
  }
}

export function writeCache(configs: RepoConfig[], data: Project[]): void {
  const entry: CacheEntry = { data, ts: Date.now(), key: configKey(configs) };

  memCache = entry;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — in-memory cache still works
  }
}
