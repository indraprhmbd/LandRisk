"use client";

import { useState, useRef, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

export default function DashboardNavbar({ refreshKey = 0 }: { refreshKey?: number }) {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowReportsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch recent reports from API
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setRecentReports(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, [refreshKey]); // Refetch when refreshKey changes

  if (isLoading) {
    return (
      <nav className="fixed top-0 w-full z-50 border-b border-surface-border bg-background-dark/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-center">
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-surface-border bg-background-dark/95 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/assets/LandRisk.webp"
            alt="LandRisk Intelligence"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-400">
          {/* Map Link */}
          <Link
            href="/map"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark border border-surface-border rounded-full hover:border-primary/50 transition-colors text-white"
          >
            <span className="material-icons text-sm text-primary">map</span>
            <span>Map</span>
          </Link>

          {/* Generated Reports Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowReportsDropdown(!showReportsDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-dark border border-surface-border rounded-full hover:border-primary/50 transition-colors"
            >
              <span className="material-icons text-sm text-primary">description</span>
              <span>Generated Reports</span>
              <span className={`material-icons text-xs transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {showReportsDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-dark border border-surface-border rounded-lg shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-surface-border">
                  <p className="text-xs font-semibold text-white uppercase tracking-wider">Recent Reports</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loadingReports ? (
                    <div className="px-4 py-8 text-center">
                      <span className="material-icons text-gray-500 animate-spin">refresh</span>
                      <p className="text-xs text-gray-500 mt-2">Loading reports...</p>
                    </div>
                  ) : recentReports.length > 0 ? (
                    recentReports.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => {
                          // Navigate to dashboard with selected parcel
                          window.location.href = `/dashboard?parcel=${report.id}`;
                        }}
                        className="w-full text-left block px-4 py-3 hover:bg-surface-border-alt transition-colors border-b border-surface-border/50 last:border-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 truncate">{report.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Generated {report.date}</p>
                          </div>
                          <span className="material-icons text-sm text-gray-500">chevron_right</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <span className="material-icons text-gray-500 text-2xl">inbox</span>
                      <p className="text-xs text-gray-500 mt-2">No reports yet</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 bg-surface-border/30">
                  <Link
                    href="/dashboard"
                    className="text-xs text-primary hover:text-primary-light transition-colors flex items-center gap-1 justify-center"
                    onClick={() => setShowReportsDropdown(false)}
                  >
                    <span className="material-icons text-sm">folder_open</span>
                    View All Reports
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors relative">
              <span className="material-icons text-lg">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                    {user.given_name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="text-xs text-gray-300">
                    {user.given_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <LogoutLink className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Logout
                </LogoutLink>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Not authenticated</span>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          <span className="material-icons text-2xl">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface-dark">
          <div className="px-6 py-4 space-y-4">
            {/* Map Link */}
            <Link
              href="/map"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-sm text-gray-300 hover:text-white py-2"
            >
              <span className="material-icons text-lg text-primary">map</span>
              <span>Map</span>
            </Link>

            {/* Reports Dropdown */}
            <div>
              <button
                onClick={() => setShowReportsDropdown(!showReportsDropdown)}
                className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="material-icons text-lg text-primary">description</span>
                  <span>Generated Reports</span>
                </div>
                <span className={`material-icons text-sm transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {showReportsDropdown && (
                <div className="mt-2 ml-8 space-y-2">
                  {loadingReports ? (
                    <p className="text-xs text-gray-500">Loading...</p>
                  ) : recentReports.length > 0 ? (
                    recentReports.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => {
                          window.location.href = `/dashboard?parcel=${report.id}`;
                          setIsMobileMenuOpen(false);
                        }}
                        className="block text-xs text-gray-400 hover:text-white py-1"
                      >
                        {report.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No reports yet</p>
                  )}
                </div>
              )}
            </div>

            {/* User Section */}
            {isAuthenticated && user ? (
              <div className="pt-4 border-t border-surface-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                    {user.given_name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="text-sm text-gray-300">
                    {user.given_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <LogoutLink
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm text-gray-400 hover:text-white block"
                >
                  Logout
                </LogoutLink>
              </div>
            ) : (
              <div className="pt-4 border-t border-surface-border space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm text-gray-400 hover:text-white py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm text-primary font-semibold py-2"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
