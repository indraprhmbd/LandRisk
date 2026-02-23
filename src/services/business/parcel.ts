import { Parcel } from "@prisma/client";

/**
 * Find the nearest parcel to given coordinates using Euclidean distance.
 * Note: This is a simple approximation. For production, use PostGIS with proper geospatial queries.
 */
export function findNearestParcel(
  parcels: Parcel[],
  latitude: number,
  longitude: number,
): { parcel: Parcel; distance: number } | null {
  if (parcels.length === 0) return null;

  let nearest = parcels[0];
  let minDist = Infinity;

  for (const parcel of parcels) {
    const dist = Math.sqrt(
      Math.pow(parcel.latitude - latitude, 2) +
        Math.pow(parcel.longitude - longitude, 2),
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = parcel;
    }
  }

  return { parcel: nearest, distance: minDist };
}

/**
 * Calculate distance between two coordinates (in degrees).
 * For more accurate distance in km, use Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  return Math.sqrt(
    Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2),
  );
}
