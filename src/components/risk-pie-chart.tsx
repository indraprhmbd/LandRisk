interface RiskComposition {
  name: string;
  percentage: number;
  color: string;
}

interface RiskPieChartProps {
  compositions?: RiskComposition[];
  dominantFactor?: string;
  dominantPercentage?: number;
}

export default function RiskPieChart({
  compositions,
  dominantFactor = "Soil",
  dominantPercentage = 32,
}: RiskPieChartProps) {
  const defaultCompositions: RiskComposition[] = [
    { name: "Soil Stability", percentage: 32, color: "bg-primary" },
    { name: "Flood Plain", percentage: 18, color: "bg-blue-400" },
    { name: "Seismic Activity", percentage: 15, color: "bg-amber-600" },
    { name: "Vegetation", percentage: 12, color: "bg-forest" },
    { name: "Others", percentage: 23, color: "bg-surface-border" },
  ];

  const data = compositions || defaultCompositions;

  // Calculate cumulative percentages for conic gradient
  let cumulative = 0;
  const gradientParts = data.map((item) => {
    const start = cumulative;
    cumulative += item.percentage;
    return `${item.color.replace("bg-", "")} ${start}% ${cumulative}%`;
  });

  // Map tailwind color classes to actual hex values for gradient
  const colorMap: Record<string, string> = {
    primary: "#b08969",
    "blue-400": "#60a5fa",
    "amber-600": "#d97706",
    forest: "#3A5A40",
    "surface-border": "#2d2d2d",
  };

  const gradientString = data.reduce((acc, item, index) => {
    const start = data.slice(0, index).reduce((sum, d) => sum + d.percentage, 0);
    const end = start + item.percentage;
    const color = colorMap[item.color.replace("bg-", "")] || "#b08969";
    if (index === 0) {
      return `${color} 0% ${end}%`;
    }
    return `${acc}, ${color} ${start}% ${end}%`;
  }, "");

  return (
    <div className="bg-surface-dark border border-surface-border rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-icons text-primary text-sm">
            pie_chart
          </span>
          Risk Composition
        </h3>
      </div>
      <div className="flex-grow flex flex-col justify-center">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div
            className="w-full h-full rounded-full relative"
            style={{
              background: `conic-gradient(${gradientString})`,
            }}
          >
            <div className="absolute inset-2 bg-surface-dark rounded-full flex flex-col items-center justify-center z-10">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Dominant
              </span>
              <span className="text-2xl font-bold text-white mt-1">
                {dominantFactor}
              </span>
              <span className="text-sm text-primary font-mono">
                {dominantPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center text-sm"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                <span className="text-gray-300">{item.name}</span>
              </div>
              <span className="font-mono text-white font-medium">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
