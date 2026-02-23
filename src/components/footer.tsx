"use client";

import { useState } from "react";
import Link from "next/link";
import ReportPrintView from "@/components/report-print-view";
import { sampleReportData } from "@/lib/sample-report-data";

interface FooterProps {
  variant?: "dashboard" | "landing";
}

export default function Footer({ variant = "landing" }: FooterProps) {
  const [showSampleReport, setShowSampleReport] = useState(false);

  if (variant === "dashboard") {
    return (
      <footer className="w-full bg-background-dark border-t border-surface-border relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2023 LandRisk Intelligence. System Version 4.2.1-beta.</p>
          <div className="flex gap-6 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>API: Online (32ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>DB: Connected</span>
            </div>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">
              Support
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Documentation
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Legal
            </a>
          </div>
        </div>
      </footer>
    );
  }

  // Landing page variant
  return (
    <>
      <footer className="w-full bg-surface-dark-alt border-t border-surface-border-alt relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Evaluate Before You Commit.
            </h2>
            <p className="text-gray-400 max-w-lg">
              Get immediate, bank-grade risk assessments for any parcel in The
              World. Start your free trial today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/map"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              Start Assessment
              <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <button
              onClick={() => setShowSampleReport(true)}
              className="bg-transparent border border-surface-border-alt text-gray-300 hover:text-white hover:border-white/40 px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center"
            >
              View Sample Report
            </button>
          </div>
        </div>
      </footer>

      {/* Sample Report Modal */}
      {showSampleReport && (
        <ReportPrintView
          data={sampleReportData}
          onClose={() => setShowSampleReport(false)}
        />
      )}
    </>
  );
}
