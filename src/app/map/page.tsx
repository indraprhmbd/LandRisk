"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the map component (Leaflet requires window)
const MapView = dynamic(() => import("@/components/map-viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-dark rounded-xl">
      <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  ),
});

interface ParcelMarker {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  classification: "Low" | "Moderate" | "High";
  zoning_category: string;
  confidence_score: number;
}

export default function MapPage() {
  const [parcels, setParcels] = useState<ParcelMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ParcelMarker | null>(null);

  useEffect(() => {
    fetch("/api/parcels")
      .then((r) => r.json())
      .then((data) => setParcels(data.parcels || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-serif font-medium text-off-white">
            Spatial Intelligence Map
          </h1>
          <p className="text-sm text-gray-400">
            {parcels.length} parcels visualized across Indonesia
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-primary transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Map + Sidebar */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div
          className="lg:col-span-3 glass-card overflow-hidden"
          style={{ height: "70vh" }}
        >
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          ) : (
            <MapView
              parcels={parcels}
              onSelect={(p: ParcelMarker) => setSelected(p)}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="glass-card p-5">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              Risk Legend
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-risk-low" />
                <span className="text-sm text-gray-300">Low (0–39)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-risk-moderate" />
                <span className="text-sm text-gray-300">Moderate (40–69)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-risk-high" />
                <span className="text-sm text-gray-300">High (70–100)</span>
              </div>
            </div>
          </div>

          {/* Selected Parcel Detail */}
          {selected && (
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-400">
                Selected Parcel
              </h3>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  {selected.location_name}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {selected.latitude.toFixed(3)},{" "}
                  {selected.longitude.toFixed(3)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Risk Score</span>
                <span className="text-lg font-bold text-white font-mono">
                  {selected.risk_score.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Classification</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    selected.classification === "Low"
                      ? "risk-low"
                      : selected.classification === "Moderate"
                        ? "risk-moderate"
                        : "risk-high"
                  }`}
                >
                  {selected.classification}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Confidence</span>
                <span className="text-xs font-mono text-primary">
                  {(selected.confidence_score * 100).toFixed(0)}%
                </span>
              </div>

              <Link
                href={`/report/${selected.id}`}
                className="block w-full py-2.5 bg-primary hover:bg-primary-light text-white text-xs uppercase tracking-widest font-semibold rounded-lg text-center transition-colors"
              >
                View Full Report →
              </Link>
            </div>
          )}

          {!selected && (
            <div className="glass-card p-5 text-center">
              <p className="text-sm text-gray-500">
                Click a marker on the map to view parcel details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
