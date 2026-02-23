"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";
import Footer from "@/components/footer";
import HistoricalChart from "@/components/historical-chart";

function TopographicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="absolute w-[150%] h-[150%] -top-[20%] -left-[20%] topo-lines stroke-primary fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,200 Q200,100 400,200 T800,200 T1200,200 T1600,200"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,250 Q200,150 400,250 T800,250 T1200,250 T1600,250"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,300 Q200,200 400,300 T800,300 T1200,300 T1600,300"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,350 Q200,250 400,350 T800,350 T1200,350 T1600,350"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,400 Q200,300 400,400 T800,400 T1200,400 T1600,400"
          strokeWidth="1"
          opacity="0.15"
        />
        <path d="M0,600 Q300,500 600,600 T1200,600 T1800,600" strokeWidth="1" opacity="0.15" />
        <path d="M0,650 Q300,550 600,650 T1200,650 T1800,650" strokeWidth="1" opacity="0.15" />
        <path d="M0,700 Q300,600 600,700 T1200,700 T1800,700" strokeWidth="1" opacity="0.15" />
        <circle cx="800" cy="400" opacity="0.03" r="300" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.03" r="250" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.03" r="200" strokeWidth="0.5" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background-dark/10 to-background-dark/5" />
    </div>
  );
}

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
      <>
        <DashboardNavbar />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mx-auto animate-spin">
              <span className="material-icons text-xl">analytics</span>
            </div>
            <p className="text-gray-400 text-sm">Loading analysis...</p>
          </div>
        </div>
        <Footer variant="dashboard" />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <DashboardNavbar />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <span className="material-icons text-4xl text-rust">error</span>
            <h2 className="text-2xl font-serif text-white">Parcel Not Found</h2>
            <p className="text-gray-400">{error || "Unable to load parcel data."}</p>
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary-light transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer variant="dashboard" />
      </>
    );
  }

  const {
    location_summary,
    engine_output,
    confidence_output,
    interpretation,
    metadata,
  } = data;

  return (
    <>
      <TopographicBackground />
      <DashboardNavbar />
      <main className="pt-24 pb-20 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

        {/* Header */}
        <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Link
                href={`/dashboard?parcel=${id}`}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors mb-4"
              >
                <span className="material-icons text-base">arrow_back</span>
                Back to Dashboard
              </Link>
              <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
                Intelligence & Transparency
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Deep-Dive{" "}
                <br className="hidden md:block" />
                <span className="text-gradient">Analysis Engine</span>
              </h1>
            </div>
            <p className="max-w-md text-gray-400 text-sm leading-relaxed border-l-2 border-primary/20 pl-4">
              Unpack the logic behind the scores. Transparent data sourcing,
              confidence derivation, and structured interpretation for
              investment-grade decision making.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24 space-y-8">
          {/* Top Grid - Interpretation & Confidence */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Structured Interpretation */}
            <div className="lg:col-span-2 bg-surface-dark-alt border border-surface-border-alt rounded-xl p-8 shadow-lg flex flex-col relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6 border-b border-surface-border-alt pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">
                    article
                  </span>
                  {interpretation.is_ai_generated ? "AI Interpretation" : "LandRisk Engine"}
                </h3>
                <div className="flex items-center gap-2">
                  {!interpretation.is_ai_generated && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-900/30 border border-amber-700/50 text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      Offline
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-primary border border-primary/30 bg-primary/5 px-2 py-1 rounded">
                    {interpretation.is_ai_generated ? "AI-generated" : "Deterministic"}
                  </span>
                </div>
              </div>
              <div className="space-y-6 flex-grow">
                <div className="bg-background-dark-alt/50 border border-surface-border-alt rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide text-xs">
                    Primary Assessment
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {interpretation.summary}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide text-xs">
                    Key Observations
                  </h4>
                  <ul className="space-y-3">
                    {interpretation.key_observations.map((obs, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-icons text-rust text-sm mt-0.5">
                          warning
                        </span>
                        <span className="text-sm text-gray-400">
                          <strong className="text-white">
                            {obs.split(":")[0]}:
                          </strong>{" "}
                          {obs.split(":").slice(1).join(":")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Confidence Derivation */}
            <div className="bg-surface-dark-alt border border-surface-border-alt rounded-xl p-8 shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-surface-border-alt pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">
                    functions
                  </span>
                  Confidence Derivation
                </h3>
                <span className="text-2xl font-bold text-white">
                  {Math.round(confidence_output.confidence_score * 100)}%
                </span>
              </div>
              <div className="space-y-6 flex-grow font-mono text-xs">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-end text-gray-400 mb-1">
                    <span>
                      Data Completeness (C<sub>d</sub>)
                    </span>
                    <span className="text-white">
                      {confidence_output.completeness_score.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-border-alt h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${confidence_output.completeness_score * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-end text-gray-400 mb-1">
                    <span>
                      Model Stability (S<sub>m</sub>)
                    </span>
                    <span className="text-white">
                      {confidence_output.consistency_score.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-border-alt h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${confidence_output.consistency_score * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-end text-gray-400 mb-1">
                    <span>
                      Historical Correlation (H<sub>c</sub>)
                    </span>
                    <span className="text-white">
                      {confidence_output.recency_score.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-border-alt h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${confidence_output.recency_score * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-surface-border-alt/50">
                  <div className="bg-background-dark-alt p-3 rounded border border-surface-border-alt">
                    <p className="text-gray-500 mb-2">Calculation:</p>
                    <p className="text-primary tracking-wide">
                      SCORE = (C<sub>d</sub> × 0.4) + (S<sub>m</sub> × 0.4) + (H
                      <sub>c</sub> × 0.2)
                    </p>
                    <div className="flex justify-between mt-3 pt-3 border-t border-surface-border-alt border-dashed">
                      <span className="text-gray-400">Result</span>
                      <span className="text-white font-bold">
                        ≈ {Math.round(confidence_output.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid - Source Transparency & Historical Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Source Transparency Table */}
            <div className="bg-surface-dark-alt border border-surface-border-alt rounded-xl p-8 shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">dns</span>
                  Source Transparency
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 border border-blue-700/50 text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Demo Data
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-surface-border-alt">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-border-alt/30 text-gray-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">Source Registry</th>
                      <th className="px-4 py-3">Sync</th>
                      <th className="px-4 py-3 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border-alt bg-background-dark-alt/30">
                    <tr>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        National Geotech Index
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        2h ago
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block w-6 text-center rounded bg-forest/20 text-forest font-bold border border-forest/30">
                          A
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        FEMA Flood Hazard
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        1d ago
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block w-6 text-center rounded bg-forest/20 text-forest font-bold border border-forest/30">
                          A
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        Local Zoning Board
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        7d ago
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block w-6 text-center rounded bg-primary/20 text-primary font-bold border border-primary/30">
                          B
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        Sat-Img Commercial
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        12h ago
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block w-6 text-center rounded bg-primary/20 text-primary font-bold border border-primary/30">
                          B
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        Historical Tax Recs
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        30d ago
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block w-6 text-center rounded bg-rust/20 text-rust font-bold border border-rust/30">
                          C
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historical Risk Stability Chart */}
            <div className="lg:col-span-2 relative">
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 border border-blue-700/50 text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Demo Data
                </span>
              </div>
              <HistoricalChart
                currentScore={Math.round(engine_output.risk_score)}
                volatility={
                  engine_output.classification === "High"
                    ? "High"
                    : engine_output.classification === "Moderate"
                      ? "Moderate"
                      : "Low"
                }
              />
            </div>
          </div>
        </section>
      </main>
      <Footer variant="dashboard" />
    </>
  );
}
