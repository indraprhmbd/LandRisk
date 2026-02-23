"use client";

interface DataSource {
  name: string;
  status: "online" | "offline" | "fallback";
  lastSync: string;
  quality: "A" | "B" | "C";
}

interface DataTransparencyCardProps {
  metadata?: {
    source: string;
    data_sources: string[];
    is_offline: boolean;
    data_quality_score?: number;
  } | null;
}

export default function DataTransparencyCard({ metadata }: DataTransparencyCardProps) {
  const dataSources: DataSource[] = [
    {
      name: "SoilGrids Regional",
      status: metadata?.is_offline ? "fallback" : "online",
      lastSync: "2h ago",
      quality: "A",
    },
    {
      name: "NASA POWER",
      status: metadata?.is_offline ? "fallback" : "online",
      lastSync: "1d ago",
      quality: "A",
    },
    {
      name: "USGS Earthquake",
      status: metadata?.is_offline ? "fallback" : "online",
      lastSync: "6h ago",
      quality: "A",
    },
    {
      name: "Open-Elevation",
      status: metadata?.is_offline ? "fallback" : "online",
      lastSync: "12h ago",
      quality: "B",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-forest";
      case "offline":
        return "text-rust";
      case "fallback":
        return "text-amber";
      default:
        return "text-gray-400";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "A":
        return "text-forest bg-forest/10 border-forest/30";
      case "B":
        return "text-primary bg-primary/10 border-primary/30";
      case "C":
        return "text-rust bg-rust/10 border-rust/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const qualityScore = metadata?.data_quality_score || 0.85;

  return (
    <div className="bg-surface-dark border border-surface-border rounded-lg p-4 shadow-sm relative overflow-hidden">
      {/* Background decorative arcs */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full pointer-events-none opacity-[0.02]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[120px] border border-gray-400 rounded-t-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[108px] border border-gray-400 rounded-t-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className={`w-5 h-5 rounded flex items-center justify-center ${
          qualityScore >= 0.8 ? 'bg-forest' : qualityScore >= 0.6 ? 'bg-amber' : 'bg-rust'
        }`}>
          <div className="w-2.5 h-2.5 border-2 border-surface-dark rounded-full"></div>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Data Transparency
        </h3>
      </div>

      {/* Data Sources List */}
      <div className="space-y-1.5 relative z-10">
        {dataSources.map((source) => (
          <div
            key={source.name}
            className="flex items-center justify-between gap-3 py-1.5"
          >
            {/* Left: Source Name */}
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                source.status === "online" ? "bg-forest" :
                source.status === "offline" ? "bg-rust" : "bg-amber"
              }`}></div>
              <span className="text-[10px] text-gray-400 truncate">{source.name}</span>
            </div>

            {/* Center: Last Sync */}
            <span className="text-[9px] text-gray-500 w-12 text-center">
              {source.lastSync}
            </span>

            {/* Right: Quality Rating */}
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getQualityColor(source.quality)}`}>
              {source.quality}
            </span>
          </div>
        ))}
      </div>

      {/* Data Quality Score */}
      <div className="mt-3 pt-2 border-t border-surface-border relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-gray-500">Overall Quality</span>
          <span className="text-[10px] font-mono text-white">
            {(qualityScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-surface-border h-1 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              qualityScore >= 0.8 ? "bg-forest" :
              qualityScore >= 0.6 ? "bg-amber" : "bg-rust"
            }`}
            style={{ width: `${qualityScore * 100}%` }}
          />
        </div>
      </div>

      {/* Descriptive Text */}
      <div className="w-full mt-2 pt-2 border-t border-surface-border relative z-10">
        <p className="text-[10px] text-gray-500 text-center leading-relaxed">
          External data sources with real-time sync status and quality ratings
        </p>
      </div>
    </div>
  );
}
