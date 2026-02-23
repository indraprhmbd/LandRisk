"use client";

import RiskCompositionCard from "./risk-composition-card";
import DataIntegrityCard from "./data-integrity-card";

interface RightColumnProps {
  pieChartData: { name: string; value: number; percentage: string }[];
  pieColors: string[];
  details: {
    engine_output: {
      risk_score: number;
    };
    confidence_output: {
      confidence_score: number;
      completeness_score: number;
      consistency_score: number;
      recency_score: number;
    };
  } | null;
}

export default function RightColumn({
  pieChartData,
  pieColors,
  details,
}: RightColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <RiskCompositionCard
        pieChartData={pieChartData}
        pieColors={pieColors}
        riskScore={details?.engine_output?.risk_score || 0}
      />
      <DataIntegrityCard confidenceOutput={details?.confidence_output || null} />
    </div>
  );
}
