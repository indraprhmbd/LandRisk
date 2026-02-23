"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import Footer from "@/components/footer";
import ReportPrintView from "@/components/report-print-view";
import RiskInsightCard from "@/components/risk-insight-card";
import StatsGrid from "@/components/dashboard/stats-grid";
import RightColumn from "@/components/dashboard/right-column";
import BottomRow from "@/components/dashboard/bottom-row";
import {
  ArrowsClockwiseIcon as Refresh,
  DownloadIcon,
  ShareNetworkIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ParcelData {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  land_area: number;
  zoning_category: string;
  risk_score: number;
  classification: "Low" | "Moderate" | "High";
  dominant_factor: string;
  confidence_score: number;
  low_integrity: boolean;
  data_source: string;
  last_updated: string;
}

interface FactorBreakdown {
  factor: string;
  raw_value: number;
  weight: number;
  weighted_value: number;
}

const COLORS = {
  rust: "#9E2A2B",
  amber: "#d97706",
  forest: "#3A5A40",
  primary: "#b08969",
  blue: "#60a5fa",
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [parcels, setParcels] = useState<ParcelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [parcelDetails, setParcelDetails] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [navbarRefreshKey, setNavbarRefreshKey] = useState(0);

  const fetchParcels = async () => {
    try {
      const res = await fetch("/api/parcels");
      const data = await res.json();
      setParcels(data.parcels || []);
      if (data.parcels?.length > 0 && !selectedParcelId) {
        setSelectedParcelId(data.parcels[0].id);
      }
      // Trigger navbar to refresh reports
      setNavbarRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to fetch parcels:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParcelDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/parcels/${id}`);
      const data = await res.json();
      setParcelDetails(data);
    } catch (error) {
      console.error("Failed to fetch parcel details:", error);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  // Handle parcel selection - persists via URL query param
  useEffect(() => {
    const parcelId = searchParams.get("parcel");
    
    if (parcelId && parcels.length > 0) {
      // URL has parcel - use it
      setSelectedParcelId(parcelId);
      fetchParcelDetails(parcelId);
    } else if (!parcelId && parcels.length > 0) {
      // No parcel in URL - set first one and update URL
      const firstId = parcels[0].id;
      setSelectedParcelId(firstId);
      fetchParcelDetails(firstId);
      router.replace(`?parcel=${firstId}`, { scroll: false });
    }
  }, [searchParams, parcels]);

  useEffect(() => {
    if (selectedParcelId) {
      fetchParcelDetails(selectedParcelId);
    }
  }, [selectedParcelId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchParcels();
    if (selectedParcelId) {
      await fetchParcelDetails(selectedParcelId);
    }
    setRefreshing(false);
  };

  const handleSelectParcel = (id: string) => {
    setSelectedParcelId(id);
    fetchParcelDetails(id);
    // Update URL to persist selection
    router.replace(`?parcel=${id}`, { scroll: false });
  };

  const handleExport = () => {
    setShowPrintView(true);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  // Prepare pie chart data
  const pieChartData = parcelDetails?.engine_output?.factor_breakdown
    ? parcelDetails.engine_output.factor_breakdown.map(
        (f: FactorBreakdown) => ({
          name: f.factor.split(" ")[0], // Short name
          value: f.weighted_value,
          percentage: (
            (f.weighted_value / parcelDetails.engine_output.risk_score) *
            100
          ).toFixed(0),
        }),
      )
    : [];

  const pieColors = [
    COLORS.rust,
    COLORS.blue,
    COLORS.amber,
    COLORS.forest,
    COLORS.primary,
  ];

  if (loading) {
    return (
      <>
        <DashboardNavbar refreshKey={navbarRefreshKey} />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <SpinnerIcon size={40} className="animate-spin text-primary" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
        <Footer variant="dashboard" />
      </>
    );
  }

  const selectedParcel =
    parcels.find((p) => p.id === selectedParcelId) || parcels[0];
  const details = parcelDetails;

  if (!selectedParcel) {
    return (
      <>
        <DashboardNavbar refreshKey={navbarRefreshKey} />
        <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-surface-dark border border-surface-border p-8 rounded-xl max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">
              No Parcels Found
            </h2>
            <p className="text-gray-400 mb-6">
              You haven't evaluated any locations yet. Go to the map to start
              your first analysis.
            </p>
            <a
              href="/map"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Go to Map
            </a>
          </div>
        </div>
        <Footer variant="dashboard" />
      </>
    );
  }

  return (
    <>
      <TopographicBackground />
      <DashboardNavbar refreshKey={navbarRefreshKey} />

      <main className="pt-24 pb-12 min-h-screen">
        {/* Top Bar */}
        <div className="bg-surface-dark border-b border-surface-border">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <Refresh
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExport}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <DownloadIcon size={16} />
                Export
              </button>
              <button 
                onClick={handleShare}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ShareNetworkIcon size={16} />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  Active Analysis
                </span>
                <span className="text-xs text-muted-text">
                  ID: #{selectedParcel?.id.split("-")[0].toUpperCase()}
                </span>
              </div>
              <a
                href={`/report/${selectedParcel?.id}`}
                className="text-xs text-primary hover:text-white transition-colors flex items-center gap-1 font-medium uppercase tracking-wide"
              >
                View Full Report
                <span className="material-icons text-sm">chevron_right</span>
              </a>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              {selectedParcel?.location_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="material-icons text-muted-text text-base">
                  pin_drop
                </span>
                <span>
                  {selectedParcel?.latitude.toFixed(4)},{" "}
                  {selectedParcel?.longitude.toFixed(4)}
                </span>
              </div>
              <span className="text-surface-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="material-icons text-muted-text text-base">
                  square_foot
                </span>
                <span>{selectedParcel?.land_area.toLocaleString()} m²</span>
              </div>
              <span className="text-surface-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="material-icons text-muted-text text-base">
                  schedule
                </span>
                <span>
                  Last Updated:{" "}
                  {selectedParcel?.last_updated
                    ? new Date(selectedParcel.last_updated).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <StatsGrid details={details} selectedParcel={selectedParcel} />

          {/* Main Content Grid - Row 2-3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left: Risk Factor Analysis Table */}
            <section className="lg:col-span-2">
              <div className="bg-surface-dark border border-surface-border rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center bg-surface-dark/50">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="material-icons text-primary text-sm">
                      table_chart
                    </span>
                    Risk Factor Analysis
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-background-dark/50 text-xs uppercase text-gray-500 font-semibold border-b border-surface-border">
                      <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">
                          Risk Factor
                        </th>
                        <th className="px-6 py-4 font-bold tracking-wider">
                          Severity
                        </th>
                        <th className="px-6 py-4 font-bold tracking-wider text-right">
                          Weighted Contrib.
                        </th>
                        <th className="px-6 py-4 font-bold tracking-wider text-right">
                          Raw Index
                        </th>
                        <th className="px-6 py-4 font-bold tracking-wider">
                          Data Source
                        </th>
                        <th className="px-6 py-4 font-bold tracking-wider text-right">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50 text-gray-300">
                      {details?.engine_output?.factor_breakdown ? (
                        details.engine_output.factor_breakdown.map(
                          (factor: FactorBreakdown, index: number) => {
                            const severity =
                              factor.raw_value <= 39
                                ? "Low"
                                : factor.raw_value <= 69
                                  ? "Moderate"
                                  : "High";
                            const severityClass =
                              severity === "High"
                                ? "bg-rust/10 text-rust border border-rust/20"
                                : severity === "Moderate"
                                  ? "bg-blue-900/30 text-blue-300 border border-blue-800/30"
                                  : "bg-green-900/30 text-green-300 border border-green-800/30";

                            const icons = [
                              "terrain",
                              "water",
                              "forest",
                              "waves",
                              "factory",
                            ];

                            return (
                              <tr
                                key={factor.factor}
                                className="hover:bg-white/[0.02] transition-colors group"
                              >
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                  <span className="material-icons text-gray-500 text-sm group-hover:text-rust transition-colors">
                                    {icons[index] || "analytics"}
                                  </span>
                                  {factor.factor}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityClass}`}
                                  >
                                    {severity}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono">
                                  {factor.weighted_value.toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-gray-400">
                                  {factor.raw_value.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-400">
                                  {selectedParcel?.data_source ||
                                    "Geospatial Agency"}
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-gray-500">
                                  {selectedParcel
                                    ? new Date(
                                        selectedParcel.last_updated,
                                      ).toLocaleDateString()
                                    : "2h ago"}
                                </td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No risk factor data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-surface-border bg-background-dark/30 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Showing top{" "}
                    {details?.engine_output?.factor_breakdown?.length || 0} risk
                    factors
                  </span>
                </div>
              </div>
            </section>

            {/* Right Column: Risk Composition + Data Integrity */}
            <section className="lg:col-span-1">
              <RightColumn
                pieChartData={pieChartData}
                pieColors={pieColors}
                details={details}
              />
            </section>
          </div>

          {/* Row 4: LandRisk Engine + Data Transparency */}
          <BottomRow
            details={details}
            metadata={parcelDetails?.metadata || null}
          />
        </div>
      </main>

      <Footer variant="dashboard" />

      {/* Print View Modal */}
      {showPrintView && parcelDetails && (
        <ReportPrintView 
          data={parcelDetails}
          onClose={() => setShowPrintView(false)}
        />
      )}

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-float">
          <div className="bg-surface-dark border border-surface-border text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="material-icons text-primary text-lg">check_circle</span>
            <span className="text-sm font-medium">Link copied to clipboard</span>
          </div>
        </div>
      )}
    </>
  );
}

function TopographicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="absolute w-[150%] h-[150%] -top-[20%] -left-[20%] topo-lines stroke-primary fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,200 Q200,100 400,200 T800,200 T1200,200 T1600,200"
          strokeWidth="1"
        />
        <path
          d="M0,250 Q200,150 400,250 T800,250 T1200,250 T1600,250"
          strokeWidth="1"
        />
        <path
          d="M0,300 Q200,200 400,300 T800,300 T1200,300 T1600,300"
          strokeWidth="1"
        />
        <path
          d="M0,350 Q200,250 400,350 T800,350 T1200,350 T1600,350"
          strokeWidth="1"
        />
        <path
          d="M0,400 Q200,300 400,400 T800,400 T1200,400 T1600,400"
          strokeWidth="1"
        />
        <path d="M0,600 Q300,500 600,600 T1200,600 T1800,600" strokeWidth="1" />
        <path d="M0,650 Q300,550 600,650 T1200,650 T1800,650" strokeWidth="1" />
        <path d="M0,700 Q300,600 600,700 T1200,700 T1800,700" strokeWidth="1" />
        <circle cx="800" cy="400" opacity="0.03" r="300" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.03" r="250" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.03" r="200" strokeWidth="0.5" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background-dark/10 to-background-dark/5" />
    </div>
  );
}
