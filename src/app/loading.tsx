"use client";
import { SpinnerIcon } from "@phosphor-icons/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <SpinnerIcon size={40} className="animate-spin text-primary" />
        </div>
        <p className="text-sm text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
