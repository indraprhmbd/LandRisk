"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface RiskCompositionCardProps {
  pieChartData: { name: string; value: number; percentage: string }[];
  pieColors: string[];
  riskScore: number;
}

export default function RiskCompositionCard({
  pieChartData,
  pieColors,
  riskScore,
}: RiskCompositionCardProps) {
  return (
    <div className="bg-surface-dark border border-surface-border rounded-lg p-5 shadow-sm relative overflow-hidden">
      {/* Background decorative arcs */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full pointer-events-none opacity-[0.02]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] border border-gray-400 rounded-t-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[180px] border border-gray-400 rounded-t-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[160px] border border-gray-400 rounded-t-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
          <span className="material-icons text-xs text-surface-dark">donut_large</span>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Risk Composition
        </h3>
      </div>

      {/* Semi-Circle Donut Gauge Chart */}
      <div className="relative flex-grow flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm mx-auto">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={3}
                dataKey="value"
                animationDuration={0}
                stroke="none"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="bg-surface-dark border border-surface-border px-3 py-2 rounded-lg shadow-lg">
                        <div className="text-xs font-medium text-white">{payload[0].name}</div>
                        <div className="text-sm font-bold text-primary">{payload[0].value}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Score Display - Below the arc */}
        <div className="text-center -mt-8">
          <div className="text-4xl font-bold text-white">
            {riskScore.toFixed(0) || "—"}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
            Risk Score
          </div>
        </div>

        {/* Legend - Three Column Layout */}
        <div className="w-full mt-4 relative z-10">
          {pieChartData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 py-1.5"
            >
              {/* Left: Color Dot + Name */}
              <div className="flex items-center gap-2.5 w-28">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: pieColors[index % pieColors.length],
                  }}
                />
                <span className="text-xs text-gray-400 truncate">{item.name}</span>
              </div>

              {/* Center: Progress Bar Track */}
              <div className="flex-1 max-w-[140px] bg-surface-border h-1 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: pieColors[index % pieColors.length],
                  }}
                />
              </div>

              {/* Right: Percentage */}
              <div className="text-xs font-mono text-white font-medium w-12 text-right">
                {item.percentage}%
              </div>
            </div>
          ))}

          {/* Descriptive Text */}
          <div className="w-full mt-3 pt-3 border-t border-surface-border">
            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              Percentage of total risk contribution by each factor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
