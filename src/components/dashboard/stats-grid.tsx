"use client";

interface FactorBreakdown {
  factor: string;
  raw_value: number;
  weight: number;
  weighted_value: number;
}

interface StatsGridProps {
  details: {
    engine_output: {
      risk_score: number;
      classification: "Low" | "Moderate" | "High";
      dominant_factor: string;
      factor_breakdown: FactorBreakdown[];
    };
    confidence_output: {
      confidence_score: number;
    };
    interpretation: {
      recommended_action: string;
    };
  } | null;
  selectedParcel: {
    land_area: number;
    last_updated: string;
    latitude: number;
    longitude: number;
    location_name: string;
    zoning_category: string;
  } | null;
}

function getRiskColor(classification: string) {
  switch (classification) {
    case "Low":
      return "text-forest";
    case "Moderate":
      return "text-amber";
    case "High":
      return "text-rust";
    default:
      return "text-gray-400";
  }
}

export default function StatsGrid({ details, selectedParcel }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* Overall Risk Score */}
      <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Overall Risk Score
          </h3>
          <span
            className={`material-icons text-lg ${details?.engine_output?.classification === "High" ? "text-rust" : details?.engine_output?.classification === "Moderate" ? "text-amber" : "text-forest"}`}
          >
            warning_amber
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              {details?.engine_output?.risk_score?.toFixed(0) || "—"}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              / 100
            </span>
          </div>
          <div className="w-full bg-surface-border h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`${details?.engine_output?.classification === "High" ? "bg-rust" : details?.engine_output?.classification === "Moderate" ? "bg-amber" : "bg-forest"} h-full rounded-full`}
              style={{
                width: `${details?.engine_output?.risk_score || 0}%`,
              }}
            />
          </div>
          <p
            className={`text-xs mt-2 font-medium ${getRiskColor(details?.engine_output?.classification || "")}`}
          >
            {details?.engine_output?.classification || "—"} Risk
          </p>
        </div>
      </div>

      {/* Confidence Level */}
      <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Confidence Level
          </h3>
          <span className="material-icons text-lg text-primary">
            verified
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              {details?.confidence_output?.confidence_score
                ? `${(details.confidence_output.confidence_score * 100).toFixed(0)}`
                : "—"}
            </span>
            <span className="text-sm text-gray-500 font-medium">%</span>
          </div>
          <div className="flex items-end gap-0.5 h-6 mt-2 opacity-50">
            {[
              40,
              60,
              50,
              80,
              70,
              90,
              details?.confidence_output?.confidence_score
                ? details.confidence_output.confidence_score * 100
                : 50,
              75,
            ].map((h, i) => (
              <div
                key={i}
                className={`w-1 ${i === 6 ? "bg-white opacity-100" : "bg-primary"} rounded-full`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {details?.engine_output?.factor_breakdown?.length || 5} factors analyzed
          </p>
        </div>
      </div>

      {/* Primary Risk */}
      <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Primary Risk
          </h3>
          <span className="material-icons text-lg text-rust">
            terrain
          </span>
        </div>
        <div>
          <p className="text-lg font-bold text-white leading-tight mb-3">
            {details?.engine_output?.dominant_factor || "—"}
          </p>
          {(() => {
            const dominantFactor = details?.engine_output?.factor_breakdown?.find(
              (f: FactorBreakdown) => f.factor === details?.engine_output?.dominant_factor
            );
            const rawValue = dominantFactor?.raw_value || 0;
            const severity = rawValue <= 39 ? "Low" : rawValue <= 69 ? "Moderate" : "High";
            const severityColor = severity === "High" ? "text-rust" : severity === "Moderate" ? "text-amber" : "text-forest";
            const severityBg = severity === "High" ? "bg-rust/10 border-rust/30" : severity === "Moderate" ? "bg-amber/10 border-amber/30" : "bg-forest/10 border-forest/30";
            const severityDot = severity === "High" ? "bg-rust" : severity === "Moderate" ? "bg-amber" : "bg-forest";

            return (
              <div className="inline-flex items-center gap-1.5 bg-transparent border px-2 py-1 rounded">
                <span className={`w-1.5 h-1.5 rounded-full ${severityDot}`} />
                <span className={`text-xs font-bold ${severityColor} uppercase`}>
                  Severity: {severity}
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Flood Exposure */}
      <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Flood Exposure
          </h3>
          <span className="material-icons text-lg text-blue-400">
            water_drop
          </span>
        </div>
        <div>
          <span className="text-4xl font-bold text-white">
            {details?.engine_output?.factor_breakdown
              ?.find(
                (f: FactorBreakdown) => f.factor === "Flood Exposure",
              )
              ?.raw_value.toFixed(0) || "—"}
          </span>
          <div className="flex items-center gap-2 mt-3">
            {(() => {
              const floodFactor = details?.engine_output?.factor_breakdown?.find(
                (f: FactorBreakdown) => f.factor === "Flood Exposure"
              );
              const floodValue = floodFactor?.raw_value || 0;
              const floodSeverity = floodValue <= 39 ? "Low" : floodValue <= 69 ? "Moderate" : "High";
              const floodColor = floodSeverity === "High" ? "text-rust" : floodSeverity === "Moderate" ? "text-amber" : "text-forest";
              const floodBg = floodSeverity === "High" ? "bg-rust/10 border-rust/30" : floodSeverity === "Moderate" ? "bg-amber/10 border-amber/30" : "bg-forest/10 border-forest/30";

              return (
                <>
                  <span className={`text-xs font-medium ${floodColor} ${floodBg} px-2 py-0.5 rounded`}>
                    {floodSeverity}
                  </span>
                  <span className="text-[10px] text-gray-500">ARI 50yr</span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between border-l-4 border-l-primary">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Recommendation
          </h3>
          <span className="material-icons text-lg text-primary">
            arrow_forward
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-white leading-relaxed">
            {details?.interpretation?.recommended_action ||
              "Proceed with geotechnical survey."}
          </p>
        </div>
      </div>
    </div>
  );
}
