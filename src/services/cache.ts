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
        land_area: Number(data.land_area) || 1000,
        zoning_category: data.zoning_category || 'Unknown',
        soil_index: Number(data.soil_index) || 50,
        flood_index: Number(data.flood_index) || 50,
        environmental_index: Number(data.environmental_index) || 50,
        zoning_index: Number(data.zoning_index) || 50,
        topography_index: Number(data.topography_index) || 50,
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
 * Create a user-owned copy of a cached parcel
 * This ensures each user has their own parcel record while reusing cached data
 */
export async function createUserParcelFromCache(
  cachedParcel: any,
  userId: string
) {
  try {
    // Ensure all required fields have valid values
    const data = {
      location_name: cachedParcel.location_name || `Location ${cachedParcel.latitude.toFixed(4)}, ${cachedParcel.longitude.toFixed(4)}`,
      latitude: Number(cachedParcel.latitude),
      longitude: Number(cachedParcel.longitude),
      land_area: Number(cachedParcel.land_area) || 1000,
      zoning_category: cachedParcel.zoning_category || 'Unknown',
      soil_index: Number(cachedParcel.soil_index) || 50,
      flood_index: Number(cachedParcel.flood_index) || 50,
      environmental_index: Number(cachedParcel.environmental_index) || 50,
      zoning_index: Number(cachedParcel.zoning_index) || 50,
      topography_index: Number(cachedParcel.topography_index) || 50,
      data_completeness: Number(cachedParcel.data_completeness) || 0.8,
      model_consistency: Number(cachedParcel.model_consistency) || 0.8,
      data_recency: Number(cachedParcel.data_recency) || 1.0,
      data_source_label: cachedParcel.data_source_label || 'user_generated',
      is_offline_mode: Boolean(cachedParcel.is_offline_mode),
      api_cache_timestamp: new Date(),
      last_updated: new Date(),
      userId: userId,
    };

    console.log('Creating user parcel with data:', JSON.stringify(data, null, 2));

    const userParcel = await prisma.parcel.create({
      data,
    });

    console.log('User parcel created successfully:', userParcel.id);
    return userParcel;
  } catch (error) {
    console.error('Error creating user parcel from cache:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.error('Failed data:', {
      cachedParcel,
      userId,
    });
    throw error;
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

/**
 * Create a report for a user
 * Stores a snapshot of the risk assessment owned by the user
 */
export async function createReport(
  userId: string,
  parcelId: string,
  reportData: {
    location_name: string;
    coordinates: string;
    land_area: number;
    zoning_category: string;
    data_source: string;
    risk_score: number;
    classification: string;
    dominant_factor: string;
    factor_breakdown: any;
    confidence_score: number;
    completeness_score: number;
    consistency_score: number;
    recency_score: number;
    low_integrity: boolean;
    summary: string;
    key_observations: any;
    recommended_action: string;
    limitations: string;
  }
) {
  try {
    const report = await prisma.report.create({
      data: {
        userId,
        parcelId,
        location_name: reportData.location_name,
        coordinates: reportData.coordinates,
        land_area: reportData.land_area,
        zoning_category: reportData.zoning_category,
        data_source: reportData.data_source,
        risk_score: reportData.risk_score,
        classification: reportData.classification,
        dominant_factor: reportData.dominant_factor,
        factor_breakdown: reportData.factor_breakdown,
        confidence_score: reportData.confidence_score,
        completeness_score: reportData.completeness_score,
        consistency_score: reportData.consistency_score,
        recency_score: reportData.recency_score,
        low_integrity: reportData.low_integrity,
        summary: reportData.summary,
        key_observations: reportData.key_observations,
        recommended_action: reportData.recommended_action,
        limitations: reportData.limitations,
      },
    });

    return report;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}

/**
 * Get reports by user ID
 */
export async function getUserReports(userId: string) {
  try {
    return await prisma.report.findMany({
      where: { userId },
      include: {
        parcel: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
}

/**
 * Get a specific report by ID and verify ownership
 */
export async function getReportById(
  reportId: string,
  userId: string
) {
  try {
    return await prisma.report.findUnique({
      where: {
        id: reportId,
        userId: userId,
      },
      include: {
        parcel: true,
      },
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}
