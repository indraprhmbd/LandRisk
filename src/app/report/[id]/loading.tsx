"use client";
import { SpinnerIcon } from "@phosphor-icons/react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />

      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="h-10 w-96 bg-white/5 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-28 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-28 bg-white/5 rounded animate-pulse" />
          <div className="h-10 w-32 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Score Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-8">
              <div className="w-36 h-36 rounded-full border-4 border-gray-800 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-64 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="glass-card p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Confidence Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* AI Interpretation */}
          <div className="glass-card p-6 space-y-4">
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-20 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-16 w-full bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Centered Loading Spinner */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="glass-card p-6 flex items-center gap-4">
          <SpinnerIcon size={32} className="animate-spin text-primary" />
          <span className="text-sm text-gray-400">Loading report...</span>
        </div>
      </div>
    </div>
  );
}
