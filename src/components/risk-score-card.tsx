interface RiskScoreCardProps {
  score: number;
  classification?: "Low" | "Moderate" | "High";
  label?: string;
  icon?: string;
  severity?: "low" | "moderate" | "high";
  recommendation?: string;
  showLink?: boolean;
}

export default function RiskScoreCard({
  score,
  classification = "Moderate",
  label = "Overall Risk Score",
  icon = "warning_amber",
  severity,
  recommendation,
  showLink = false,
}: RiskScoreCardProps) {
  // Determine colors based on classification/severity
  const getColors = () => {
    if (classification === "High" || severity === "high") {
      return {
        text: "text-rust",
        bg: "bg-rust",
        border: "border-rust",
      };
    }
    if (classification === "Moderate" || severity === "moderate") {
      return {
        text: "text-amber",
        bg: "bg-amber",
        border: "border-amber",
      };
    }
    return {
      text: "text-forest",
      bg: "bg-forest",
      border: "border-forest",
    };
  };

  const colors = getColors();

  return (
    <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
          {label}
        </h3>
        <span className={`material-icons ${colors.text} text-lg`}>{icon}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-sm text-gray-500 font-medium">/ 100</span>
        </div>
        <div className="w-full bg-surface-border h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`${colors.bg} h-full rounded-full`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className={`text-xs ${colors.text} mt-2 font-medium`}>
          {classification} Risk
        </p>
        {recommendation && (
          <div className="mt-3">
            <p className="text-sm font-medium text-white leading-relaxed">
              {recommendation}
            </p>
            {showLink && (
              <button className="mt-3 text-xs text-primary hover:text-white transition-colors flex items-center gap-1 font-bold uppercase tracking-wide">
                View Brief{" "}
                <span className="material-icons text-[10px]">
                  chevron_right
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
