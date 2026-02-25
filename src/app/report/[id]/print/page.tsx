"use client";

import { useEffect, useState, use } from "react";

interface ReportData {
  location_summary: {
    location_name: string;
    coordinates: string;
    land_area: number;
    zoning_category: string;
    parcel_id: string;
  };
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
  metadata: {
    data_source: string;
    last_updated: string;
  };
}

export default function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch(`/api/parcels/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Report not found");
        return r.json();
      })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isMounted && data) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMounted, data]);

  const getRiskLabel = (classification: string) => {
    switch (classification) {
      case "Low":
        return "LOW RISK";
      case "Moderate":
        return "MODERATE RISK";
      case "High":
        return "HIGH RISK";
      default:
        return "UNKNOWN";
    }
  };

  const getSeverity = (value: number) => {
    if (value <= 39) return "Low";
    if (value <= 69) return "Moderate";
    return "High";
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-lg border-2 border-gray-300 border-t-gray-600 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white text-black min-h-screen print:max-w-none print:w-full">
      {/* Header */}
      <div className="p-8 border-b-2 border-gray-800 print:border-black">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              LandRisk Assessment Report
            </h1>
            <p className="text-gray-600 text-sm">
              Generated on {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Report ID
            </div>
            <div className="font-mono font-bold text-gray-900">
              #{data.location_summary.parcel_id.split("-")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div className="p-8 border-b border-gray-200 print:border-gray-400">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Property Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase">Location</div>
            <div className="font-semibold text-gray-900">
              {data.location_summary.location_name}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">Coordinates</div>
            <div className="font-mono text-gray-900">
              {data.location_summary.coordinates}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">Land Area</div>
            <div className="font-semibold text-gray-900">
              {data.location_summary.land_area.toLocaleString()} m²
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">Zoning</div>
            <div className="font-semibold text-gray-900">
              {data.location_summary.zoning_category}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="p-8 border-b border-gray-200 print:border-gray-400">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Risk Assessment
        </h2>

        {/* Risk Score */}
        <div className="mb-6 p-4 bg-gray-50 print:bg-gray-100 rounded-lg border-2 border-gray-300 print:border-gray-400">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600 uppercase">
              Overall Risk Score
            </span>
            <span className={`text-2xl font-bold ${
              data.engine_output.classification === "High"
                ? "text-red-700"
                : data.engine_output.classification === "Moderate"
                ? "text-amber-700"
                : "text-green-700"
            }`}>
              {data.engine_output.risk_score.toFixed(0)}/100 - {getRiskLabel(data.engine_output.classification)}
            </span>
          </div>
          <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                data.engine_output.classification === "High"
                  ? "bg-red-700"
                  : data.engine_output.classification === "Moderate"
                  ? "bg-amber-700"
                  : "bg-green-700"
              }`}
              style={{ width: `${data.engine_output.risk_score}%` }}
            />
          </div>
        </div>

        {/* Risk Factors Table */}
        <div className="overflow-hidden border border-gray-300 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 print:bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Factor</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Raw Score</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Weight</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Contribution</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.engine_output.factor_breakdown.map((factor, index) => (
                <tr key={factor.factor} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{factor.factor}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{factor.raw_value.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-500">{(factor.weight * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900">{factor.weighted_value.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      getSeverity(factor.raw_value) === "High"
                        ? "bg-red-100 text-red-800"
                        : getSeverity(factor.raw_value) === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {getSeverity(factor.raw_value)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dominant Factor */}
        <div className="mt-4 p-3 bg-amber-50 print:bg-amber-100 border border-amber-200 rounded-lg">
          <div className="text-xs text-amber-800 uppercase font-semibold">Dominant Risk Factor</div>
          <div className="text-lg font-bold text-amber-900">{data.engine_output.dominant_factor}</div>
        </div>
      </div>

      {/* Confidence Metrics */}
      <div className="p-8 border-b border-gray-200 print:border-gray-400">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Confidence Metrics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 print:bg-gray-100 rounded-lg border border-gray-300">
            <div className="text-xs text-gray-500 uppercase">Overall Confidence</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {(data.confidence_output.confidence_score * 100).toFixed(0)}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 print:bg-gray-100 rounded-lg border border-gray-300">
            <div className="text-xs text-gray-500 uppercase">Data Completeness</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {(data.confidence_output.completeness_score * 100).toFixed(0)}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 print:bg-gray-100 rounded-lg border border-gray-300">
            <div className="text-xs text-gray-500 uppercase">Data Recency</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {(data.confidence_output.recency_score * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        {data.confidence_output.low_integrity && (
          <div className="mt-4 p-3 bg-red-50 print:bg-red-100 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              ⚠️ <strong>Warning:</strong> Data completeness is below acceptable threshold (60%).
              Findings are preliminary and require field verification.
            </div>
          </div>
        )}
      </div>

      {/* Assessment Summary */}
      <div className="p-8 border-b border-gray-200 print:border-gray-400">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Assessment Summary
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Analysis</h3>
            <p className="text-gray-900 text-sm leading-relaxed">
              {data.interpretation.summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Key Observations</h3>
            <ul className="space-y-1">
              {data.interpretation.key_observations.map((obs, i) => (
                <li key={i} className="text-gray-900 text-sm">
                  • {obs}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 print:bg-blue-100 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 uppercase mb-2">Recommendation</h3>
            <p className="text-blue-900 text-sm leading-relaxed font-medium">
              {data.interpretation.recommended_action}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 bg-gray-50 print:bg-gray-100">
        <div className="text-xs text-gray-500 space-y-2">
          <p>
            <strong>Model Version:</strong> {data.engine_output.model_version}
          </p>
          <p>
            <strong>Assessment Method:</strong> {data.interpretation.is_ai_generated ? "AI-Enhanced Analysis" : "LandRisk Deterministic Engine"}
          </p>
          <p className="text-gray-400 italic mt-4">
            {data.interpretation.limitations}
          </p>
          <p className="text-gray-400 text-xs mt-6 pt-4 border-t border-gray-300">
            This report is generated for demonstration purposes only. Risk indices are based on seeded data
            and should not be used for actual investment decisions. Always consult qualified professionals
            for land assessment and due diligence.
          </p>
        </div>
      </div>
    </div>
  );
}
