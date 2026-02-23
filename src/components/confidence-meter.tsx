interface ConfidenceMeterProps {
  confidence: number;
  label?: string;
  icon?: string;
  dataSources?: number;
  showBars?: boolean;
}

export default function ConfidenceMeter({
  confidence,
  label = "Confidence Level",
  icon = "verified",
  dataSources,
  showBars = false,
}: ConfidenceMeterProps) {
  return (
    <div className="bg-surface-dark border border-surface-border p-5 rounded-lg shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
          {label}
        </h3>
        <span className="material-icons text-primary text-lg">{icon}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{confidence}%</span>
        </div>

        {showBars ? (
          <div className="flex items-end gap-0.5 h-6 mt-2 opacity-50">
            {[40, 60, 50, 80, 70, 90, confidence, 75].map((h, i) => (
              <div
                key={i}
                className={`w-1 ${
                  i === 6 ? "bg-white opacity-100" : "bg-primary"
                } h-[${h}%]`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        ) : null}

        <p className="text-xs text-gray-400 mt-1">
          {dataSources ? `Based on ${dataSources} data sources` : ""}
        </p>
      </div>
    </div>
  );
}
