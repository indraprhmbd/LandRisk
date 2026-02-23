"use client";

import RiskInsightCard from "@/components/risk-insight-card";
import DataTransparencyCard from "./data-transparency-card";

interface BottomRowProps {
  details: {
    engine_output: {
      risk_score: number;
      classification: "Low" | "Moderate" | "High";
      dominant_factor: string;
      factor_breakdown: {
        factor: string;
        raw_value: number;
        weight: number;
        weighted_value: number;
      }[];
      model_version: string;
    };
    confidence_output: {
      confidence_score: number;
      completeness_score: number;
      consistency_score: number;
      recency_score: number;
      low_integrity: boolean;
    };
    interpretation: {
      summary: string;
      key_observations: string[];
      recommended_action: string;
      limitations: string;
      is_ai_generated?: boolean;
    };
  } | null;
  metadata?: {
    source: string;
    data_sources: string[];
    is_offline: boolean;
    data_quality_score?: number;
  } | null;
}

export default function BottomRow({ details, metadata }: BottomRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Left: LandRisk Engine */}
      <section className="lg:col-span-2">
        {details && (
          <RiskInsightCard
            engineOutput={details.engine_output}
            confidenceOutput={details.confidence_output}
            interpretation={details.interpretation}
          />
        )}
      </section>

      {/* Right: Data Transparency */}
      <section className="lg:col-span-1">
        <DataTransparencyCard metadata={metadata} />
      </section>
    </div>
  );
}
