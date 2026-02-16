"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  CaretRight,
  MapPin,
  Spinner,
  GlobeHemisphereWest,
  Cpu,
  ArrowRight,
} from "@phosphor-icons/react";

export default function HomePage() {
  const router = useRouter();
  const [lat, setLat] = useState("-6.307");
  const [lng, setLng] = useState("107.161");
  const [loading, setLoading] = useState(false);

  async function handleEvaluate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        }),
      });
      const data = await res.json();
      if (data.location_summary?.parcel_id) {
        router.push(`/report/${data.location_summary.parcel_id}`);
      }
    } catch {
      alert("Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 lg:gap-8 items-center py-12 lg:py-0">
        {/* Left Column: Copy */}
        <div className="flex flex-col justify-center space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide uppercase text-primary">
              Spatial Intelligence V2.0
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-serif font-medium leading-[1.1] tracking-tight text-off-white">
            Land Risk. <br />
            <span className="text-gray-400">Evaluated Before</span> <br />
            Capital Moves.
          </h1>

          <p className="text-lg lg:text-xl text-off-white/80 font-light leading-relaxed max-w-lg border-l-2 border-primary/30 pl-6">
            A structured spatial intelligence layer for early-stage land
            feasibility decisions. Quantify uncertainty with architectural
            precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-[0_0_20px_rgba(176,137,105,0.2)] flex items-center justify-center gap-2 group"
            >
              Run Site Evaluation
              <CaretRight
                size={20}
                weight="bold"
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#methodology"
              className="px-8 py-4 bg-transparent border border-primary/40 text-primary hover:bg-primary/5 hover:border-primary transition-all font-medium rounded-lg flex items-center justify-center"
            >
              Explore Methodology
            </a>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-white/5">
            <div>
              <p className="text-2xl font-display font-bold text-white">50+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Parcels Indexed
              </p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">
                99.8%
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Engine Accuracy
              </p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">v1.0</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Model Version
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Evaluate Card */}
        <div className="relative lg:h-full flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-md animate-float">
            <div className="absolute inset-0 bg-primary/5 rounded-xl transform translate-x-4 translate-y-4 blur-sm -z-10" />
            <div className="glass-card shadow-2xl overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-gray-500">
                  LR-EVALUATE
                </span>
              </div>

              {/* Card Body */}
              <form onSubmit={handleEvaluate} className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                    Quick Evaluation
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="-6.307"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="107.161"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(176,137,105,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner size={20} className="animate-spin opacity-75" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      Evaluate Risk
                      <ArrowRight size={20} weight="bold" />
                    </>
                  )}
                </button>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobeHemisphereWest
                        size={16}
                        className="text-gray-400"
                      />
                      <span className="text-xs text-gray-400 uppercase">
                        Region
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Indonesia
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-400 uppercase">
                        Engine
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Deterministic
                    </p>
                  </div>
                </div>

                <a
                  href="/dashboard"
                  className="block w-full py-3 bg-white/5 hover:bg-white/10 text-xs uppercase tracking-widest text-gray-300 border border-white/10 rounded transition-colors text-center"
                >
                  Browse All Parcels →
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div id="methodology" />
    </div>
  );
}
