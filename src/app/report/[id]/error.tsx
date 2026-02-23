"use client";

import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Report error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-risk-high/10 rounded-full flex items-center justify-center">
            <WarningCircle size={32} className="text-risk-high" weight="fill" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-medium text-off-white">
            Failed to load report
          </h2>
          <p className="text-gray-400 text-sm">
            {error.message || "Unable to fetch parcel report."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
