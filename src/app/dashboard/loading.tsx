"use client";
import { SpinnerIcon } from "@phosphor-icons/react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-10 w-64 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-12 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-white/5 rounded animate-pulse" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-20 bg-white/5 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="glass-card overflow-hidden">
        <div className="p-16 flex items-center justify-center">
          <SpinnerIcon size={32} className="animate-spin text-primary" />
        </div>
      </div>
    </div>
  );
}
