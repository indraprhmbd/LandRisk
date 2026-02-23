"use client";

interface DataIntegrityCardProps {
  confidenceOutput: {
    confidence_score: number;
    completeness_score: number;
    consistency_score: number;
    recency_score: number;
  } | null;
}

export default function DataIntegrityCard({ confidenceOutput }: DataIntegrityCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-forest";
    if (score >= 0.6) return "text-amber";
    return "text-rust";
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 0.8) return "bg-forest";
    if (score >= 0.6) return "bg-amber";
    return "bg-rust";
  };

  const score = confidenceOutput?.confidence_score || 0;

  return (
    <div className="bg-surface-dark border border-surface-border rounded-lg p-4 shadow-sm relative overflow-hidden">
      {/* Background decorative arcs */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full pointer-events-none opacity-[0.02]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[120px] border border-gray-400 rounded-t-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[108px] border border-gray-400 rounded-t-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className={`w-5 h-5 rounded flex items-center justify-center ${getConfidenceBg(score)}`}>
          <div className="w-2.5 h-2.5 border-2 border-surface-dark rounded-full"></div>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Data Integrity
        </h3>
      </div>

      {/* Confidence Score Display */}
      <div className="relative flex-grow flex flex-col items-center justify-center pb-2">
        <div className="text-center mb-3">
          <div className={`text-3xl font-bold ${getConfidenceColor(score)}`}>
            {confidenceOutput?.confidence_score
              ? `${(confidenceOutput.confidence_score * 100).toFixed(0)}%`
              : "—"}
          </div>
          <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
            Confidence Score
          </div>
        </div>

        {/* Metric Progress Bars */}
        <div className="w-full space-y-1.5 relative z-10">
          {/* Data Completeness */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-28">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-[10px] text-gray-400 truncate">Completeness</span>
            </div>
            <div className="flex-1 max-w-[100px] bg-surface-border h-0.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(confidenceOutput?.completeness_score || 0) * 100}%`,
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-white w-8 text-right">
              {confidenceOutput?.completeness_score
                ? `${(confidenceOutput.completeness_score * 100).toFixed(0)}%`
                : "—"}
            </div>
          </div>

          {/* Model Consistency */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-28">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-[10px] text-gray-400 truncate">Consistency</span>
            </div>
            <div className="flex-1 max-w-[100px] bg-surface-border h-0.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(confidenceOutput?.consistency_score || 0) * 100}%`,
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-white w-8 text-right">
              {confidenceOutput?.consistency_score
                ? `${(confidenceOutput.consistency_score * 100).toFixed(0)}%`
                : "—"}
            </div>
          </div>

          {/* Data Recency */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-28">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-[10px] text-gray-400 truncate">Recency</span>
            </div>
            <div className="flex-1 max-w-[100px] bg-surface-border h-0.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(confidenceOutput?.recency_score || 0) * 100}%`,
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-white w-8 text-right">
              {confidenceOutput?.recency_score
                ? `${(confidenceOutput.recency_score * 100).toFixed(0)}%`
                : "—"}
            </div>
          </div>
        </div>

        {/* Descriptive Text */}
        <div className="w-full mt-2 pt-2 border-t border-surface-border relative z-10">
          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
            Data reliability assessment based on completeness, consistency, and recency metrics
          </p>
        </div>
      </div>
    </div>
  );
}
