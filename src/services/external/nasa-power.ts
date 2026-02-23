/**
 * NASA POWER API Service
 * Provides weather and climate data globally
 * Documentation: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
 */

import type { WeatherData } from './types';

const NASA_POWER_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point';

/**
 * Fetch weather data from NASA POWER API
 * @param lat Latitude
 * @param lng Longitude
 * @param timeout Request timeout in ms
 */
export async function fetchWeatherData(
  lat: number,
  lng: number,
  timeout = 5000
): Promise<WeatherData> {
  const url = new URL(NASA_POWER_URL);
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lng.toString());
  url.searchParams.set('parameters', 'PRECTOTCORR,RH2M');
  url.searchParams.set('community', 'AG');
  url.searchParams.set('format', 'JSON');
  
  // Required: start and end dates (NASA POWER requires date range)
  // Get last 30 days of data for analysis
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  
  url.searchParams.set('start', startDate.toISOString().slice(0, 10).replace(/-/g, ''));
  url.searchParams.set('end', endDate.toISOString().slice(0, 10).replace(/-/g, ''));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NASA POWER API error: ${response.status}`);
    }

    const data = await response.json();
    return parseWeatherData(data);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('NASA POWER API timeout');
    }
    throw error;
  }
}

/**
 * Parse NASA POWER response
 */
function parseWeatherData(data: any): WeatherData {
  const parameters = data.properties?.parameter ?? {};

  // Get precipitation data (daily averages in mm/day)
  const precipitation = parameters.PRECTOTCORR ?? {};
  const humidity = parameters.RH2M ?? {};

  // Calculate annual rainfall (sum of daily values)
  const annualRainfall = Object.values(precipitation).reduce(
    (sum: number, val: any) => sum + (val ?? 0),
    0
  );

  // Calculate average humidity
  const humidityValues = Object.values(humidity);
  const avgHumidity =
    humidityValues.length > 0
      ? humidityValues.reduce((sum: number, val: any) => sum + (val ?? 0), 0) /
        humidityValues.length
      : 50;

  // Calculate flood risk index (0-100)
  // Higher rainfall = higher flood risk
  const floodIndex = calculateFloodRisk(annualRainfall, avgHumidity);

  return {
    flood_index: floodIndex,
    annual_rainfall: annualRainfall,
    avg_humidity: avgHumidity,
  };
}

/**
 * Calculate flood risk index based on precipitation and humidity
 */
function calculateFloodRisk(annualRainfall: number, avgHumidity: number): number {
  let score = 30; // Base score

  // Annual rainfall scoring (mm/year)
  // Indonesia average: 2000-3000mm/year
  if (annualRainfall < 1000) {
    score = 20; // Low rainfall
  } else if (annualRainfall < 2000) {
    score = 40; // Moderate rainfall
  } else if (annualRainfall < 3000) {
    score = 60; // High rainfall (typical Indonesia)
  } else if (annualRainfall < 4000) {
    score = 75; // Very high rainfall
  } else {
    score = 90; // Extreme rainfall
  }

  // Humidity adjustment (higher humidity = higher flood risk)
  if (avgHumidity > 80) {
    score += 10;
  } else if (avgHumidity < 50) {
    score -= 10;
  }

  // Ensure score is within 0-100
  return Math.min(100, Math.max(0, score));
}
