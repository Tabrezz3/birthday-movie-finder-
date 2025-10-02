// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; expiry: number }>();

const TTL = 5 * 60 * 1000; // 5 minutes

export const getCache = (key: string) => {
  const item = cache.get(key);
  if (!item) return null;

  // Check if item has expired
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

export const setCache = (key: string, data: any) => {
  const expiry = Date.now() + TTL;
  cache.set(key, { data, expiry });
};