interface HistoricalChartProps {
  currentScore?: number;
  volatility?: "Low" | "Moderate" | "High";
  dataPoints?: number[];
}

export default function HistoricalChart({
  currentScore = 72,
  volatility = "Low",
  dataPoints = [69, 68, 70, 71, 69, 72, 74, 73, 71, 70, 72, 72],
}: HistoricalChartProps) {
  // Generate SVG path from data points
  const width = 100;
  const height = 50;
  const points = dataPoints;
  const maxScore = 100;
  const minScore = 50;

  const pathData = points
    .map((score, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((score - minScore) / (maxScore - minScore)) * height;
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  // Area fill path
  const areaPath = `${pathData} L ${width},${height} L 0,${height} Z`;

  // Calculate start position for current score marker
  const currentX = width;
  const currentY =
    height - ((currentScore - minScore) / (maxScore - minScore)) * height;

  return (
    <div className="bg-surface-dark border border-surface-border rounded-xl p-8 shadow-lg flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-icons text-primary text-sm">
            ssid_chart
          </span>
          Historical Risk Stability (12mo)
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
              Current
            </span>
            <span className="text-white font-mono font-bold">
              {currentScore}
            </span>
          </div>
          <div className="flex flex-col items-end border-l border-surface-border pl-4">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
              Volatility
            </span>
            <span
              className={`font-mono font-bold ${
                volatility === "Low"
                  ? "text-forest"
                  : volatility === "Moderate"
                    ? "text-amber"
                    : "text-rust"
              }`}
            >
              {volatility}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-grow w-full h-full relative min-h-[200px] flex items-end px-2 pb-2">
        {/* Grid lines */}
        <div className="absolute inset-0 border-b border-l border-surface-border/50">
          <div className="h-1/4 w-full border-t border-surface-border/20 border-dashed absolute top-0"></div>
          <div className="h-1/4 w-full border-t border-surface-border/20 border-dashed absolute top-1/4"></div>
          <div className="h-1/4 w-full border-t border-surface-border/20 border-dashed absolute top-2/4"></div>
          <div className="h-1/4 w-full border-t border-surface-border/20 border-dashed absolute top-3/4"></div>
        </div>

        {/* SVG Chart */}
        <svg
          className="w-full h-full absolute inset-0 text-primary drop-shadow-[0_0_10px_rgba(176,137,105,0.2)]"
          preserveAspectRatio="none"
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "currentColor", stopOpacity: 0.5 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "currentColor", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGradient)" opacity="0.2" />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data point circles */}
          {points.map((score, index) => {
            const x = (index / (points.length - 1)) * width;
            const y =
              height - ((score - minScore) / (maxScore - minScore)) * height;
            const isLast = index === points.length - 1;
            return (
              <circle
                key={index}
                className={`${isLast ? "fill-white" : "fill-surface-dark"} stroke-primary`}
                cx={x}
                cy={y}
                r={isLast ? 2.5 : 1.5}
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* Labels */}
        <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 font-mono">
          12 Months Ago (Score: {points[0]})
        </div>
        <div className="absolute top-8 right-2 text-[10px] text-white font-mono bg-surface-dark/80 px-2 rounded border border-surface-border">
          Now (Score: {currentScore})
        </div>
      </div>
    </div>
  );
}
