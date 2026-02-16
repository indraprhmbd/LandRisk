"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner, CaretRight } from "@phosphor-icons/react";

interface ParcelSummary {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  land_area: number;
  zoning_category: string;
  risk_score: number;
  classification: "Low" | "Moderate" | "High";
  dominant_factor: string;
  confidence_score: number;
  low_integrity: boolean;
  data_source: string;
  last_updated: string;
}

function RiskBadge({ classification }: { classification: string }) {
  const cls =
    classification === "Low"
      ? "risk-low"
      : classification === "Moderate"
        ? "risk-moderate"
        : "risk-high";
  return (
    <span className={`${cls} text-xs font-semibold px-2.5 py-1 rounded`}>
      {classification}
    </span>
  );
}

export default function DashboardPage() {
  const [parcels, setParcels] = useState<ParcelSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  useEffect(() => {
    fetch("/api/parcels")
      .then((r) => r.json())
      .then((data) => setParcels(data.parcels || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = parcels.filter((p) => {
    const matchSearch =
      p.location_name.toLowerCase().includes(search.toLowerCase()) ||
      p.zoning_category.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "all" || p.classification === filterRisk;
    return matchSearch && matchRisk;
  });

  const stats = {
    total: parcels.length,
    low: parcels.filter((p) => p.classification === "Low").length,
    moderate: parcels.filter((p) => p.classification === "Moderate").length,
    high: parcels.filter((p) => p.classification === "High").length,
    avgConfidence: parcels.length
      ? (
          parcels.reduce((s, p) => s + p.confidence_score, 0) / parcels.length
        ).toFixed(2)
      : "—",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-primary">
            Live Dashboard
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif font-medium text-off-white">
          Parcel Risk Overview
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Comprehensive risk assessment across all indexed land parcels.
          Deterministic engine scores with confidence metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Total Parcels
          </p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-5 border-l-2 border-l-risk-low">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Low Risk
          </p>
          <p className="text-2xl font-bold text-risk-low">{stats.low}</p>
        </div>
        <div className="glass-card p-5 border-l-2 border-l-risk-moderate">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Moderate Risk
          </p>
          <p className="text-2xl font-bold text-risk-moderate">
            {stats.moderate}
          </p>
        </div>
        <div className="glass-card p-5 border-l-2 border-l-risk-high">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            High Risk
          </p>
          <p className="text-2xl font-bold text-risk-high">{stats.high}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Avg Confidence
          </p>
          <p className="text-2xl font-bold text-primary">
            {stats.avgConfidence}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search location or zoning..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
        />
        <div className="flex gap-2">
          {["all", "Low", "Moderate", "High"].map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterRisk === risk
                  ? "bg-primary text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
              }`}
            >
              {risk === "all" ? "All" : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card p-16 flex items-center justify-center">
          <Spinner size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Location
                  </th>
                  <th className="text-left px-4 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Zoning
                  </th>
                  <th className="text-center px-4 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Risk Score
                  </th>
                  <th className="text-center px-4 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Classification
                  </th>
                  <th className="text-left px-4 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Dominant Factor
                  </th>
                  <th className="text-center px-4 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Confidence
                  </th>
                  <th className="text-center px-4 py-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium text-sm">
                          {p.location_name}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          {p.latitude.toFixed(3)}, {p.longitude.toFixed(3)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                        {p.zoning_category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-white font-mono">
                        {p.risk_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <RiskBadge classification={p.classification} />
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-xs">
                      {p.dominant_factor}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${p.confidence_score * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-mono">
                          {(p.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link
                        href={`/report/${p.id}`}
                        className="text-xs text-primary hover:text-primary-light transition-colors font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1"
                      >
                        View <CaretRight weight="bold" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500 text-sm">
              No parcels match your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
