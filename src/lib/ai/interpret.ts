import { RiskEngineOutput } from "../services/business/risk";
import { ConfidenceOutput } from "../services/business/confidence";

export interface InterpretationOutput {
  summary: string;
  key_observations: string[];
  recommended_action: string;
  limitations: string;
}

interface InterpretRequest {
  engine_output: RiskEngineOutput;
  confidence_output: ConfidenceOutput;
  parcel_metadata: {
    location_name: string;
    coordinates: string;
    land_area: number;
    zoning_category: string;
  };
}

/**
 * Calls the FastAPI AI interpretation endpoint.
 * Falls back to a deterministic template if the AI is unavailable.
 */
export async function getInterpretation(
  request: InterpretRequest,
): Promise<InterpretationOutput> {
  const aiBaseUrl = process.env.AI_ENDPOINT_URL || "http://127.0.0.1:8000";
  const aiEndpoint = `${aiBaseUrl}/interpret`;

  if (aiBaseUrl) {
    // Check if a base URL is available (either env var or fallback)
    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.AI_API_KEY
            ? { Authorization: `Bearer ${process.env.AI_API_KEY}` }
            : {}),
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (response.ok) {
        const data = await response.json();
        return data as InterpretationOutput;
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Deterministic fallback interpretation
  return generateFallbackInterpretation(request);
}

function generateFallbackInterpretation(
  request: InterpretRequest,
): InterpretationOutput {
  const { engine_output, confidence_output, parcel_metadata } = request;
  const { risk_score, classification, dominant_factor, factor_breakdown } =
    engine_output;
  const { confidence_score, low_integrity } = confidence_output;

  const confidencePercent = Math.round(confidence_score * 100);

  // Sort factors by weighted value descending
  const sortedFactors = [...factor_breakdown].sort(
    (a, b) => b.weighted_value - a.weighted_value,
  );
  const topFactor = sortedFactors[0];
  const secondFactor = sortedFactors[1];

  const summary = `The parcel at ${parcel_metadata.location_name} (${parcel_metadata.coordinates}) has been evaluated with a composite risk score of ${risk_score.toFixed(1)}/100, classified as ${classification} Risk. The dominant risk contributor is ${dominant_factor}, which accounts for a weighted value of ${topFactor.weighted_value.toFixed(1)} out of the total score. The assessment carries a confidence level of ${confidencePercent}%, derived from data completeness, model consistency, and data recency metrics.`;

  const observations = sortedFactors.map(
    (f) =>
      `${f.factor}: Raw value ${f.raw_value.toFixed(1)}/100 (weight: ${(f.weight * 100).toFixed(0)}%) contributing ${f.weighted_value.toFixed(1)} to composite score.`,
  );

  if (low_integrity) {
    observations.push(
      "Data completeness is below 60% threshold — results should be treated with caution.",
    );
  }

  let recommendedAction: string;
  if (classification === "High") {
    recommendedAction = `High risk detected primarily from ${dominant_factor}. Recommend conducting a comprehensive geotechnical survey and ${secondFactor ? secondFactor.factor.toLowerCase() + " assessment" : "environmental impact study"} before proceeding with any capital allocation.`;
  } else if (classification === "Moderate") {
    recommendedAction = `Moderate risk profile driven by ${dominant_factor}. Recommend targeted investigation of ${dominant_factor.toLowerCase()} conditions and verification of ${parcel_metadata.zoning_category} zoning compliance before commitment.`;
  } else {
    recommendedAction = `Low risk profile. Standard due diligence recommended, with particular attention to ${dominant_factor.toLowerCase()} verification and zoning regulatory confirmation.`;
  }

  const limitations = [
    "Interpretation generated from structured engine output.",
    low_integrity
      ? "Data completeness is below acceptable threshold (60%). Findings are preliminary and require field verification."
      : "",
    "Risk indices are based on seeded hackathon data and should not be used for actual investment decisions.",
    `Confidence: ${confidencePercent}%.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    summary,
    key_observations: observations,
    recommended_action: recommendedAction,
    limitations,
  };
}
