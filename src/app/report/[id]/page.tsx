"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Spinner, Robot, WarningCircle } from "@phosphor-icons/react";

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
  };
  metadata: {
    data_source: string;
    last_updated: string;
  };
}

function RiskScoreRing({
  score,
  classification,
}: {
  score: number;
  classification: string;
}) {
  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (score / 100) * circumference;
  const color =
    classification === "Low"
      ? "#22c55e"
      : classification === "Moderate"
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="transform -rotate-90 w-36 h-36">
        <circle
          cx="72"
          cy="72"
          r="56"
          fill="transparent"
          stroke="#333"
          strokeWidth="6"
        />
        <circle
          cx="72"
          cy="72"
          r="56"
          fill="transparent"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

function ConfidenceMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-primary font-mono">
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/parcels/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Parcel not found");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 text-center min-h-[60vh]">
        <h2 className="text-2xl font-serif text-white mb-4">
          Parcel Not Found
        </h2>
        <p className="text-gray-400 mb-6">
          {error || "Unable to load parcel data."}
        </p>
        <Link
          href="/dashboard"
          className="text-primary hover:text-primary-light transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const {
    location_summary,
    engine_output,
    confidence_output,
    interpretation,
    metadata,
  } = data;
  const riskCls =
    engine_output.classification === "Low"
      ? "risk-low"
      : engine_output.classification === "Moderate"
        ? "risk-moderate"
        : "risk-high";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/dashboard"
          className="hover:text-primary transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-white">{location_summary.location_name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl font-serif font-medium text-off-white">
            {location_summary.location_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
              {location_summary.coordinates}
            </span>
            <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
              {location_summary.land_area.toLocaleString()} m²
            </span>
            <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
              {location_summary.zoning_category}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Source: {metadata.data_source} · Updated:{" "}
            {new Date(metadata.last_updated).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`${riskCls} text-sm font-semibold px-4 py-2 rounded-lg`}
          >
            {engine_output.classification} Risk
          </span>
          <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-2 rounded-lg font-mono">
            {engine_output.model_version}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column — Risk Score + Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Score Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-400">
                Overall Risk Score
              </h2>
              <span className={`${riskCls} text-xs px-2.5 py-1 rounded`}>
                {engine_output.classification}
              </span>
            </div>
            <div className="flex items-center gap-8">
              <RiskScoreRing
                score={engine_output.risk_score}
                classification={engine_output.classification}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm text-gray-400">Primary Risk Factor</p>
                <p className="text-lg font-semibold text-white">
                  {engine_output.dominant_factor}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Composite score from 5 weighted risk indices.
                </p>
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="glass-card p-6">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6">
              Risk Factor Analysis
            </h2>
            <div className="space-y-4">
              {engine_output.factor_breakdown.map((f) => {
                const barColor =
                  f.raw_value <= 39
                    ? "bg-risk-low"
                    : f.raw_value <= 69
                      ? "bg-risk-moderate"
                      : "bg-risk-high";
                return (
                  <div key={f.factor}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-white font-medium">
                          {f.factor}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          w: {(f.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-gray-300">
                          {f.raw_value.toFixed(1)}
                        </span>
                        <span className="text-xs font-mono text-primary">
                          → {f.weighted_value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-1000`}
                        style={{ width: `${f.raw_value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Table */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 uppercase tracking-wider">
                    <th className="text-left pb-2">Factor</th>
                    <th className="text-right pb-2">Raw</th>
                    <th className="text-right pb-2">Weight</th>
                    <th className="text-right pb-2">Weighted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {engine_output.factor_breakdown.map((f) => (
                    <tr key={f.factor} className="text-gray-300">
                      <td className="py-2">{f.factor}</td>
                      <td className="py-2 text-right font-mono">
                        {f.raw_value.toFixed(1)}
                      </td>
                      <td className="py-2 text-right font-mono">
                        {(f.weight * 100).toFixed(0)}%
                      </td>
                      <td className="py-2 text-right font-mono text-primary">
                        {f.weighted_value.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="text-white font-semibold">
                    <td className="pt-3">Total</td>
                    <td className="pt-3 text-right" />
                    <td className="pt-3 text-right font-mono">100%</td>
                    <td className="pt-3 text-right font-mono text-primary">
                      {engine_output.risk_score.toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column — Confidence + Interpretation */}
        <div className="space-y-6">
          {/* Confidence Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-400">
                Confidence Level
              </h2>
              {confidence_output.low_integrity && (
                <span className="text-xs text-risk-high bg-risk-high/10 px-2 py-1 rounded border border-risk-high/20">
                  Low Integrity
                </span>
              )}
            </div>

            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-primary">
                {(confidence_output.confidence_score * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Composite Confidence Score
              </p>
            </div>

            <div className="space-y-4">
              <ConfidenceMeter
                label="Data Completeness"
                value={confidence_output.completeness_score}
              />
              <ConfidenceMeter
                label="Model Consistency"
                value={confidence_output.consistency_score}
              />
              <ConfidenceMeter
                label="Data Recency"
                value={confidence_output.recency_score}
              />
            </div>
          </div>

          {/* AI Interpretation */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
                <Robot size={14} weight="fill" className="text-primary" />
              </div>
              <h2 className="text-sm uppercase tracking-widest text-gray-400">
                AI Interpretation
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Summary
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {interpretation.summary}
                </p>
              </div>

              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Key Observations
                </h3>
                <ul className="space-y-2">
                  {interpretation.key_observations.map((obs, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">▸</span>
                      {obs}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/5">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Recommendation
                </h3>
                <p className="text-sm text-primary/90 leading-relaxed">
                  {interpretation.recommended_action}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Limitations
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  {interpretation.limitations}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="pt-4">
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-primary transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
