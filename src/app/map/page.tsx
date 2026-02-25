"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Spinner,
  MapPin,
  Warning,
  CheckCircle,
  Lock,
} from "@phosphor-icons/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// Dynamically import the map component (Leaflet requires window)
const MapView = dynamic(() => import("@/components/map-viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-dark rounded-xl">
      <Spinner size={32} className="animate-spin text-primary" />
    </div>
  ),
});

interface SelectedLocation {
  lat: number;
  lng: number;
  address?: string;
}

export default function MapPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default center: Indonesia
  const defaultCenter: [number, number] = [-2.5489, 118.0149];

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setError(null);
  };

  const handleCoordinateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Parse "lat, lng" format
    const parts = value.split(",").map((s) => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setSelectedLocation({ lat: parts[0], lng: parts[1] });
      setError(null);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedLocation) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(
        `/api/auth/login?post_login_redirect_url=${encodeURIComponent("/map")}`,
      );
      return;
    }

    setEvaluating(true);
    setError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      // Redirect to dashboard to view results
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to evaluate location",
      );
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface-dark border-b border-surface-border px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-medium text-off-white">
              Select Location
            </h1>
            <p className="text-sm text-gray-400">
              Click on the map or enter coordinates to evaluate land risk
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-4 min-h-0">
        {/* Map Area */}
        <div className="lg:col-span-3 relative h-[60vh] lg:h-auto">
          <MapView
            center={defaultCenter}
            zoom={5}
            selectedLocation={selectedLocation}
            onLocationSelect={handleMapClick}
          />

          {/* Selected Location Badge */}
          {selectedLocation && (
            <div className="absolute top-4 left-4 bg-surface-dark border border-surface-border rounded-lg p-4 shadow-xl max-w-sm">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Selected Location
                  </p>
                  <p className="text-sm font-mono text-white">
                    {selectedLocation.lat.toFixed(6)},{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-xs text-gray-500 hover:text-gray-300 mt-2"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-surface-dark border-l border-surface-border p-6 flex flex-col">
          <div className="space-y-6">
            {/* Instructions */}
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                How to Select
              </h2>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">▸</span>
                  Click anywhere on the map to select a location
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">▸</span>
                  Or enter coordinates manually below
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">▸</span>
                  Click "Evaluate Location" to get risk assessment
                </li>
              </ul>
            </div>

            {/* Coordinate Input */}
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Manual Input
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                    Coordinates (lat, lng)
                  </label>
                  <input
                    type="text"
                    placeholder="-6.2088, 106.8456"
                    onChange={handleCoordinateInput}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Selected Location Info */}
            {selectedLocation && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={16} className="text-primary" />
                  <h2 className="text-sm font-semibold text-white">
                    Location Selected
                  </h2>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Latitude:</span>
                    <span className="text-white font-mono">
                      {selectedLocation.lat.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Longitude:</span>
                    <span className="text-white font-mono">
                      {selectedLocation.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-risk-high/10 border border-risk-high/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Warning size={16} className="text-risk-high" />
                  <h2 className="text-sm font-semibold text-risk-high">
                    Error
                  </h2>
                </div>
                <p className="text-xs text-gray-400">{error}</p>
              </div>
            )}

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={
                (!selectedLocation && !!isAuthenticated) ||
                !!evaluating ||
                !!isLoading
              }
              className="w-full py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(176,137,105,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {evaluating ? (
                <>
                  <Spinner size={20} className="animate-spin" />
                  Evaluating...
                </>
              ) : !isAuthenticated ? (
                <>
                  <Lock size={20} weight="bold" />
                  Login to Evaluate
                </>
              ) : (
                <>
                  Evaluate Location
                  <MapPin size={20} weight="bold" />
                </>
              )}
            </button>
            {!isAuthenticated && (
              <p className="text-xs text-center text-gray-500">
                You need to{" "}
                <a
                  href={`/api/auth/login?post_login_redirect_url=${encodeURIComponent("/map")}`}
                  className="text-primary hover:underline"
                >
                  sign in
                </a>{" "}
                to evaluate a location.
              </p>
            )}

            {/* Info Note */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">Note:</strong> This evaluation
                uses real-time data from multiple sources (SoilGrids, NASA,
                USGS). First-time evaluations may take a few seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
