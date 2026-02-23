"use client";

interface RiskInsightCardProps {
  engineOutput: {
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
  confidenceOutput: {
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
}

export default function RiskInsightCard({
  engineOutput,
  confidenceOutput,
  interpretation,
}: RiskInsightCardProps) {
  const getRiskLabel = (classification: string) => {
    switch (classification) {
      case "Low":
        return { text: "LOW RISK", color: "text-forest", bg: "bg-forest" };
      case "Moderate":
        return { text: "MODERATE RISK", color: "text-amber", bg: "bg-amber" };
      case "High":
        return { text: "HIGH RISK", color: "text-rust", bg: "bg-rust" };
      default:
        return { text: "UNKNOWN", color: "text-gray-400", bg: "bg-gray-500" };
    }
  };

  const getSeverity = (value: number) => {
    if (value <= 39) return "Low";
    if (value <= 69) return "Moderate";
    return "High";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-rust";
      case "Moderate":
        return "text-amber";
      default:
        return "text-forest";
    }
  };

  const riskLabel = getRiskLabel(engineOutput.classification);
  const confidencePercent = Math.round(confidenceOutput.confidence_score * 100);

  // Generate key insight narrative
  const generateKeyInsight = () => {
    const dominantFactor = engineOutput.factor_breakdown.find(
      (f) => f.factor === engineOutput.dominant_factor
    );
    const dominantSeverity = dominantFactor 
      ? getSeverity(dominantFactor.raw_value)
      : "Moderate";

    const bestFactor = [...engineOutput.factor_breakdown].sort(
      (a, b) => a.raw_value - b.raw_value
    )[0];

    return `This parcel shows ${dominantSeverity.toLowerCase()} ${engineOutput.dominant_factor.toLowerCase()} (${dominantFactor?.raw_value.toFixed(0)}/100). ${bestFactor?.factor} is optimal at ${bestFactor?.raw_value.toFixed(0)}/100. ${confidencePercent >= 80 ? "Assessment is highly reliable." : confidencePercent >= 60 ? "Assessment has moderate confidence." : "Data limitations exist - verify with field assessment."}`;
  };

  // Sort factors by weighted contribution
  const sortedFactors = [...engineOutput.factor_breakdown].sort(
    (a, b) => b.weighted_value - a.weighted_value
  );

  return (
    <div className="bg-surface-dark border border-surface-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-gradient-to-r from-surface-dark to-surface-dark/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="material-icons text-primary text-xl">analytics</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {interpretation.is_ai_generated ? "AI Interpretation" : "LandRisk Engine"}
            </h2>
            <p className="text-xs text-gray-500">
              {interpretation.is_ai_generated ? "AI-Enhanced Analysis" : "Deterministic Risk Assessment"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!interpretation.is_ai_generated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-900/30 border border-amber-700/50 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Offline Mode
            </span>
          )}
          <div className={`px-3 py-1.5 rounded-lg ${riskLabel.bg}/10 border border-${riskLabel.color.replace('text-', '')}/30`}>
            <span className={`text-xs font-bold ${riskLabel.color} tracking-wider`}>
              {riskLabel.text}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Section: Score + Key Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Score Gauge */}
          <div className="lg:col-span-1">
            <div className="relative">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-surface-border"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(engineOutput.risk_score / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                    className={`${riskLabel.color} transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {engineOutput.risk_score.toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight */}
          <div className="lg:col-span-2">
            <div className="h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons text-primary text-lg">lightbulb</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Insight</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {generateKeyInsight()}
              </p>
              
              {/* Confidence Badge */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-3 rounded-sm ${
                          i < Math.round(confidencePercent / 20)
                            ? confidencePercent >= 80
                              ? "bg-forest"
                              : confidencePercent >= 60
                              ? "bg-amber"
                              : "bg-rust"
                            : "bg-surface-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Confidence</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">
                  {confidencePercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Factors Progress Bars */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-primary text-lg">bar_chart</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Risk Factors Breakdown</h3>
          </div>
          <div className="space-y-3">
            {sortedFactors.map((factor) => {
              const severity = getSeverity(factor.raw_value);
              const severityColor = getSeverityColor(severity);
              const percentage = (factor.weighted_value / engineOutput.risk_score) * 100;
              
              return (
                <div key={factor.factor}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-300">{factor.factor}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${severityColor}`}>{severity}</span>
                      <span className="text-xs font-mono text-gray-400 w-16 text-right">
                        {factor.raw_value.toFixed(0)}/100
                      </span>
                      <span className="text-xs font-mono text-white w-20 text-right">
                        +{factor.weighted_value.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          severity === "High"
                            ? "bg-rust"
                            : severity === "Moderate"
                            ? "bg-amber"
                            : "bg-forest"
                        }`}
                        style={{ width: `${factor.raw_value}%` }}
                      />
                    </div>
                    <div 
                      className="absolute top-0 left-0 h-2 w-0.5 bg-white/50"
                      style={{ left: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="material-icons text-[10px]">info</span>
            <span>Model: {engineOutput.model_version}</span>
          </div>
          <div className="text-[10px] text-gray-500">
            {interpretation.is_ai_generated ? (
              <span className="flex items-center gap-1">
                <span className="material-icons text-[10px]">auto_awesome</span>
                AI-generated
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="material-icons text-[10px]">settings</span>
                Deterministic engine
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
