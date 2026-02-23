/**
 * USGS Earthquake API Service
 * Provides seismic/earthquake data globally
 * Documentation: https://earthquake.usgs.gov/fdsnws/event/1/
 */

import type { EarthquakeData } from './types';

const USGS_EARTHQUAKE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

/**
 * Fetch earthquake data from USGS API
 * @param lat Latitude
 * @param lng Longitude
 * @param radiusKm Search radius in kilometers
 * @param timeout Request timeout in ms
 */
export async function fetchEarthquakeData(
  lat: number,
  lng: number,
  radiusKm = 100,
  timeout = 5000
): Promise<EarthquakeData> {
  const url = new URL(USGS_EARTHQUAKE_URL);
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lng.toString());
  url.searchParams.set('maxradiuskm', radiusKm.toString());
  url.searchParams.set('format', 'geojson');
  url.searchParams.set('limit', '100');
  url.searchParams.set('orderby', 'time');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();
    return parseEarthquakeData(data);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('USGS API timeout');
    }
    throw error;
  }
}

/**
 * Parse USGS earthquake response
 */
function parseEarthquakeData(data: any): EarthquakeData {
  const earthquakes = data.features || [];

  // Count earthquakes and find max magnitude
  const earthquakeCount = earthquakes.length;
  const maxMagnitude = earthquakes.reduce(
    (max: number, eq: any) => Math.max(max, eq.properties?.mag ?? 0),
    0
  );

  // Calculate seismic risk index (0-100)
  // Higher = more seismic activity = higher risk
  const seismicIndex = calculateSeismicRisk(earthquakeCount, maxMagnitude);

  return {
    seismic_index: seismicIndex,
    earthquake_count: earthquakeCount,
    max_magnitude: maxMagnitude,
  };
}

/**
 * Calculate seismic risk index based on earthquake history
 */
function calculateSeismicRisk(count: number, maxMag: number): number {
  let score = 20; // Base score (low risk by default)

  // Score based on earthquake count
  if (count === 0) {
    score = 10; // Very low seismic activity
  } else if (count <= 5) {
    score += 10;
  } else if (count <= 20) {
    score += 30;
  } else if (count <= 50) {
    score += 50;
  } else {
    score += 70; // High activity
  }

  // Score based on maximum magnitude
  if (maxMag >= 7) {
    score += 30; // Major earthquake risk
  } else if (maxMag >= 5) {
    score += 20; // Moderate earthquake risk
  } else if (maxMag >= 3) {
    score += 10; // Minor earthquake activity
  }

  // Ensure score is within 0-100
  return Math.min(100, Math.max(0, score));
}
