/**
 * External API Data Types
 */

export interface SoilData {
  soil_index: number;
  clay_content: number;
  sand_content: number;
  organic_carbon: number;
  ph_level: number;
}

export interface EarthquakeData {
  seismic_index: number;
  earthquake_count: number;
  max_magnitude: number;
}

export interface WeatherData {
  flood_index: number;
  annual_rainfall: number;
  avg_humidity: number;
}

export interface TopographyData {
  topography_index: number;
  elevation: number;
  slope: number;
}

export interface ExternalAPIData {
  soil_index: number;
  flood_index: number;
  environmental_index: number;
  zoning_index: number;
  topography_index: number;
  is_offline: boolean;
  sources: string[];
}

export interface APIConfig {
  timeout: number;
  retries: number;
}

export const DEFAULT_API_CONFIG: APIConfig = {
  timeout: 5000, // 5 seconds
  retries: 1,
};
