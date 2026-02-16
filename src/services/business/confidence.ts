// Confidence Engine
// Formula: confidence = (data_completeness × 0.5) + (model_consistency × 0.3) + (data_recency × 0.2)

export interface ConfidenceOutput {
  confidence_score: number;
  completeness_score: number;
  consistency_score: number;
  recency_score: number;
  low_integrity: boolean;
}

export function calculateConfidence(parcel: {
  data_completeness: number;
  model_consistency: number;
  data_recency: number;
}): ConfidenceOutput {
  const confidenceScore =
    parcel.data_completeness * 0.5 +
    parcel.model_consistency * 0.3 +
    parcel.data_recency * 0.2;

  return {
    confidence_score: Math.round(confidenceScore * 1000) / 1000,
    completeness_score: parcel.data_completeness,
    consistency_score: parcel.model_consistency,
    recency_score: parcel.data_recency,
    low_integrity: parcel.data_completeness < 0.6,
  };
}
