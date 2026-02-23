/**
 * Topography/Elevation Service
 * Uses SRTM data for elevation information
 */

import type { TopographyData } from './types';

/**
 * Fetch topography data
 * For MVP, we use a simplified approach based on coordinates
 * In production, integrate with NASA SRTM or DEMNAS
 */
export async function fetchTopographyData(
  lat: number,
  lng: number,
  timeout = 5000
): Promise<TopographyData> {
  // For MVP: Use Open-Elevation API (free, no auth required)
  // Production: Use cached SRTM data or DEMNAS for Indonesia
  const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Elevation API error: ${response.status}`);
    }

    const data = await response.json();
    return parseTopographyData(data, lat, lng);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Elevation API timeout');
    }
    throw error;
  }
}

/**
 * Parse elevation response and calculate topography index
 */
function parseTopographyData(
  data: any,
  lat: number,
  lng: number
): TopographyData {
  const elevation = data.results?.[0]?.elevation ?? 50;

  // Calculate topography index based on elevation
  // For construction: moderate elevation (50-500m) is optimal
  const topographyIndex = calculateTopographyIndex(elevation, lat, lng);

  return {
    topography_index: topographyIndex,
    elevation: elevation,
    slope: 5, // Default slope for MVP
  };
}

/**
 * Calculate topography index based on elevation
 * Optimal for construction: 50-500m elevation, gentle slope
 */
function calculateTopographyIndex(
  elevation: number,
  lat: number,
  lng: number
): number {
  let score = 50; // Base score

  // Elevation scoring
  if (elevation >= 50 && elevation <= 500) {
    score = 80; // Optimal elevation range
  } else if (elevation < 50) {
    score = 60; // Low elevation (potential flooding)
  } else if (elevation <= 1000) {
    score = 70; // Moderate elevation
  } else if (elevation <= 2000) {
    score = 50; // High elevation
  } else {
    score = 30; // Very high elevation (difficult construction)
  }

  // Special handling for coastal areas (simplified)
  // Indonesia: most coastal areas are 0-10m elevation
  if (elevation < 10 && Math.abs(lat) < 5) {
    // Tropical coastal area
    score -= 10; // Higher flood risk
  }

  // Ensure score is within 0-100
  return Math.min(100, Math.max(0, score));
}
