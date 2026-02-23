/**
 * Soil Data Service
 * Provides soil property data globally
 * 
 * NOTE: SoilGrids REST API is currently paused (as of 2025).
 * Using regional soil databases and fallback values.
 */

import type { SoilData } from './types';

/**
 * Fetch soil data using regional databases and fallback values
 * @param lat Latitude
 * @param lng Longitude
 * @param timeout Request timeout in ms
 */
export async function fetchSoilData(
  lat: number,
  lng: number,
  timeout = 5000
): Promise<SoilData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Use regional soil data based on coordinates
    // This provides realistic default values based on geographic location
    const soilData = getRegionalSoilData(lat, lng);
    
    clearTimeout(timeoutId);
    return soilData;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Soil data timeout');
    }
    throw error;
  }
}

/**
 * Get regional soil data based on geographic location
 * Provides realistic default values for different regions
 */
function getRegionalSoilData(lat: number, lng: number): SoilData {
  // Indonesia/Southeast Asia region (tropical rainforest soils)
  if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) {
    return {
      soil_index: 55, // Moderate soil stability
      clay_content: 35, // Tropical clay soils
      sand_content: 35, // Moderate sand
      organic_carbon: 3.2, // High organic content (rainforest)
      ph_level: 5.8, // Slightly acidic (typical tropical soil)
    };
  }
  
  // Mediterranean region
  if (lat >= 30 && lat <= 46 && lng >= -10 && lng <= 36) {
    return {
      soil_index: 65,
      clay_content: 28,
      sand_content: 42,
      organic_carbon: 2.1,
      ph_level: 7.2,
    };
  }
  
  // North America temperate region
  if (lat >= 25 && lat <= 50 && lng >= -125 && lng <= -70) {
    return {
      soil_index: 68,
      clay_content: 30,
      sand_content: 38,
      organic_carbon: 3.5,
      ph_level: 6.5,
    };
  }
  
  // Default global average (fallback)
  return {
    soil_index: 50,
    clay_content: 33,
    sand_content: 40,
    organic_carbon: 2.5,
    ph_level: 6.5,
  };
}
