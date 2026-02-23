"use client";
import { SpinnerIcon } from "@phosphor-icons/react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
      </div>

      {/* Map + Sidebar Skeleton */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Area */}
        <div
          className="lg:col-span-3 glass-card overflow-hidden"
          style={{ height: "70vh" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <SpinnerIcon size={40} className="animate-spin text-primary" />
              <p className="text-sm text-gray-400 animate-pulse">
                Loading map...
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Legend Skeleton */}
          <div className="glass-card p-5 space-y-3">
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white/5 animate-pulse" />
                <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Selected Parcel Skeleton */}
          <div className="glass-card p-5 space-y-4">
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
            <div className="h-10 w-full bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
