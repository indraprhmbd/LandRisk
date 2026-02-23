/**
 * Database Cache Service
 * Handles caching of parcel data and API responses
 */

import prisma from '@/lib/db';

const CACHE_EXPIRY_HOURS = 24;

/**
 * Get cached parcel data for a location
 * Uses coordinate tolerance for matching (within ~500m)
 */
export async function getCachedParcel(
  lat: number,
  lng: number,
  toleranceKm = 0.5
): Promise<any | null> {
  try {
    // Convert km to degrees (rough approximation)
    const tolerance = toleranceKm / 111;

    const parcel = await prisma.parcel.findFirst({
      where: {
        latitude: {
          gte: lat - tolerance,
          lte: lat + tolerance,
        },
        longitude: {
          gte: lng - tolerance,
          lte: lng + tolerance,
        },
        api_cache_timestamp: {
          gte: new Date(
            Date.now() - CACHE_EXPIRY_HOURS * 60 * 60 * 1000
          ),
        },
      },
      orderBy: {
        api_cache_timestamp: 'desc',
      },
    });

    return parcel;
  } catch (error) {
    console.error('Error fetching cached parcel:', error);
    return null;
  }
}

/**
 * Check if cached data is stale
 */
export function isCacheStale(timestamp: Date, expiryHours = CACHE_EXPIRY_HOURS): boolean {
  const expiryTime = new Date(timestamp.getTime() + expiryHours * 60 * 60 * 1000);
  return new Date() > expiryTime;
}

/**
 * Cache parcel data in database
 */
export async function cacheParcelData(
  lat: number,
  lng: number,
  data: any,
  locationName: string,
  userId?: string
) {
  try {
    const parcel = await prisma.parcel.create({
      data: {
        location_name: locationName,
        latitude: lat,
        longitude: lng,
        land_area: data.land_area || 1000,
        zoning_category: data.zoning_category || 'Unknown',
        soil_index: data.soil_index,
        flood_index: data.flood_index,
        environmental_index: data.environmental_index,
        zoning_index: data.zoning_index,
        topography_index: data.topography_index,
        data_completeness: data.is_offline ? 0.5 : 0.9,
        model_consistency: 0.8,
        data_recency: 1.0,
        data_source_label: data.sources?.join(', ') || 'external_api',
        is_offline_mode: data.is_offline || false,
        api_cache_timestamp: new Date(),
        last_updated: new Date(),
        userId: userId || null,
      },
    });

    return parcel;
  } catch (error) {
    console.error('Error caching parcel data:', error);
    throw error;
  }
}

/**
 * Update existing parcel with new data
 */
export async function updateParcelData(
  parcelId: string,
  data: any
) {
  try {
    const parcel = await prisma.parcel.update({
      where: { id: parcelId },
      data: {
        ...data,
        api_cache_timestamp: new Date(),
        last_updated: new Date(),
      },
    });

    return parcel;
  } catch (error) {
    console.error('Error updating parcel:', error);
    throw error;
  }
}

/**
 * Get parcels by user ID
 */
export async function getUserParcels(userId: string) {
  try {
    return await prisma.parcel.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching user parcels:', error);
    return [];
  }
}

/**
 * Clear expired cache entries
 * Run this periodically (e.g., daily cron job)
 */
export async function clearExpiredCache() {
  try {
    const expiredTime = new Date(
      Date.now() - CACHE_EXPIRY_HOURS * 60 * 60 * 1000
    );

    const result = await prisma.parcel.deleteMany({
      where: {
        api_cache_timestamp: {
          lt: expiredTime,
        },
        userId: null, // Don't delete user-saved parcels
      },
    });

    console.log(`Cleared ${result.count} expired cache entries`);
    return result.count;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return 0;
  }
}
