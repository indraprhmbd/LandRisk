// Deterministic Risk Engine — Single Source of Truth
// Formula: risk_score = (soil × 0.35) + (flood × 0.25) + (env × 0.15) + (zoning × 0.15) + (topo × 0.10)

import { cache, CacheKey, CACHE_TTL } from "@/lib/cache";

export interface FactorBreakdown {
  factor: string;
  raw_value: number;
  weight: number;
  weighted_value: number;
}

export interface RiskEngineOutput {
  risk_score: number;
  classification: "Low" | "Moderate" | "High";
  dominant_factor: string;
  factor_breakdown: FactorBreakdown[];
  model_version: string;
}

const MODEL_VERSION = "LR-Engine-v1.0";

const WEIGHTS: Record<string, number> = {
  soil_index: 0.35,
  flood_index: 0.25,
  environmental_index: 0.15,
  zoning_index: 0.15,
  topography_index: 0.1,
};

const FACTOR_LABELS: Record<string, string> = {
  soil_index: "Soil Stability",
  flood_index: "Flood Exposure",
  environmental_index: "Environmental Sensitivity",
  zoning_index: "Zoning Compliance",
  topography_index: "Topography Index",
};

function classify(score: number): "Low" | "Moderate" | "High" {
  if (score <= 39) return "Low";
  if (score <= 69) return "Moderate";
  return "High";
}

export function calculateRisk(parcel: {
  soil_index: number;
  flood_index: number;
  environmental_index: number;
  zoning_index: number;
  topography_index: number;
}): RiskEngineOutput {
  // Check cache first
  const cacheKey = CacheKey.risk(parcel);
  const cached = cache.get<RiskEngineOutput>(cacheKey);
  if (cached) return cached;

  const factorBreakdown: FactorBreakdown[] = Object.entries(WEIGHTS).map(
    ([key, weight]) => {
      const rawValue = parcel[key as keyof typeof parcel];
      return {
        factor: FACTOR_LABELS[key],
        raw_value: Math.round(rawValue * 100) / 100,
        weight,
        weighted_value: Math.round(rawValue * weight * 100) / 100,
      };
    },
  );

  const riskScore =
    Math.round(
      factorBreakdown.reduce((sum, f) => sum + f.weighted_value, 0) * 100,
    ) / 100;

  // Find dominant factor (highest weighted contribution)
  const dominantFactor = factorBreakdown.reduce((max, f) =>
    f.weighted_value > max.weighted_value ? f : max,
  );

  const result: RiskEngineOutput = {
    risk_score: riskScore,
    classification: classify(riskScore),
    dominant_factor: dominantFactor.factor,
    factor_breakdown: factorBreakdown,
    model_version: MODEL_VERSION,
  };

  // Cache the result
  cache.set(cacheKey, result, CACHE_TTL.RISK_CALCULATION);

  return result;
}
