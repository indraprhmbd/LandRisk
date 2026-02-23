/**
 * Simple in-memory cache for hackathon scope.
 * For production, replace with Redis or similar.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    // Default 5 minutes TTL
    this.defaultTTL = defaultTTL;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Optionally set custom TTL for this entry
    if (ttl !== undefined) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Global cache instance
export const cache = new InMemoryCache();

// Cache TTLs
export const CACHE_TTL = {
  RISK_CALCULATION: 60 * 60 * 1000, // 1 hour
  CONFIDENCE_CALCULATION: 60 * 60 * 1000, // 1 hour
  PARCEL_DATA: 5 * 60 * 1000, // 5 minutes
} as const;

// Cache key generators
export const CacheKey = {
  risk: (parcelData: {
    soil_index: number;
    flood_index: number;
    environmental_index: number;
    zoning_index: number;
    topography_index: number;
  }) =>
    `risk:${parcelData.soil_index}:${parcelData.flood_index}:${parcelData.environmental_index}:${parcelData.zoning_index}:${parcelData.topography_index}`,

  confidence: (parcelData: {
    data_completeness: number;
    model_consistency: number;
    data_recency: number;
  }) =>
    `confidence:${parcelData.data_completeness}:${parcelData.model_consistency}:${parcelData.data_recency}`,

  parcel: (id: string) => `parcel:${id}`,

  parcels: () => "parcels:all",
};
