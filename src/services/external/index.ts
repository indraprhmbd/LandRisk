/**
 * External API Aggregator
 * Fetches data from multiple sources and combines them
 * 
 * API Status (2025):
 * - SoilGrids: PAUSED (using regional fallback)
 * - NASA POWER: Working (requires date range)
 * - USGS: Working
 * - Open-Elevation: Working
 */

import { fetchSoilData } from './soilgrids';
import { fetchEarthquakeData } from './usgs';
import { fetchWeatherData } from './nasa-power';
import { fetchTopographyData } from './topography';
import type { ExternalAPIData } from './types';

/**
 * Fetch all external API data for a location
 * Handles failures gracefully with offline fallback
 */
export async function fetchExternalAPIData(
  lat: number,
  lng: number
): Promise<ExternalAPIData> {
  const sources: string[] = [];
  let isOffline = false;

  // Default values (fallback)
  let soilIndex = 50;
  let floodIndex = 50;
  let environmentalIndex = 50;
  let zoningIndex = 50; // Default for MVP
  let topographyIndex = 50;

  // Fetch soil data (uses regional fallback - always succeeds)
  try {
    const soilData = await fetchSoilData(lat, lng);
    soilIndex = soilData.soil_index;
    sources.push('soilgrids-regional');
  } catch (error) {
    console.error('Soil data failed, using default:', error);
    isOffline = true;
  }

  // Fetch weather/flood data (NASA POWER - working)
  try {
    const weatherData = await fetchWeatherData(lat, lng);
    floodIndex = weatherData.flood_index;
    sources.push('nasa-power');
  } catch (error) {
    console.error('NASA POWER failed, using fallback:', error);
    isOffline = true;
  }

  // Fetch earthquake/seismic data (USGS - working)
  try {
    const earthquakeData = await fetchEarthquakeData(lat, lng);
    // Use seismic data for environmental index (inverse - less seismic = better)
    environmentalIndex = 100 - earthquakeData.seismic_index;
    sources.push('usgs');
  } catch (error) {
    console.error('USGS failed, using fallback:', error);
    isOffline = true;
  }

  // Fetch topography data (Open-Elevation - working)
  try {
    const topoData = await fetchTopographyData(lat, lng);
    topographyIndex = topoData.topography_index;
    sources.push('open-elevation');
  } catch (error) {
    console.error('Elevation API failed, using fallback:', error);
    isOffline = true;
    topographyIndex = 50; // Default
  }

  console.log(`External API sources used: ${sources.join(', ')}`);
  console.log(`Offline mode: ${isOffline}`);

  return {
    soil_index: soilIndex,
    flood_index: floodIndex,
    environmental_index: environmentalIndex,
    zoning_index: zoningIndex,
    topography_index: topographyIndex,
    is_offline: isOffline,
    sources,
  };
}

/**
 * Get data source quality score based on which APIs succeeded
 */
export function getDataSourceQualityScore(sources: string[], isOffline: boolean): number {
  if (isOffline) {
    return 0.5; // Reduced quality for offline mode
  }

  const maxSources = 4; // soilgrids, nasa-power, usgs, open-elevation
  const sourceRatio = sources.length / maxSources;

  // Quality score: 0.7 to 1.0 based on number of successful API calls
  return 0.7 + (sourceRatio * 0.3);
}
