interface RiskFactor {
  name: string;
  icon: string;
  severity: "High" | "Moderate" | "Low" | "Low-Mod";
  weightedContrib: number;
  rawIndex: number;
  dataSource: string;
  lastUpdated: string;
}

interface RiskFactorTableProps {
  factors?: RiskFactor[];
}

export default function RiskFactorTable({ factors }: RiskFactorTableProps) {
  const defaultFactors: RiskFactor[] = [
    {
      name: "Soil Stability",
      icon: "terrain",
      severity: "High",
      weightedContrib: 32,
      rawIndex: 0.88,
      dataSource: "Geospatial Agency",
      lastUpdated: "2h ago",
    },
    {
      name: "Flood Plain",
      icon: "water",
      severity: "Moderate",
      weightedContrib: 18,
      rawIndex: 0.61,
      dataSource: "Regional Water Board",
      lastUpdated: "1d ago",
    },
    {
      name: "Vegetation Density",
      icon: "forest",
      severity: "Low",
      weightedContrib: 12,
      rawIndex: 0.24,
      dataSource: "Satellite Imagery",
      lastUpdated: "6h ago",
    },
    {
      name: "Seismic Activity",
      icon: "waves",
      severity: "Low-Mod",
      weightedContrib: 15,
      rawIndex: 0.35,
      dataSource: "Nat. Seismic Center",
      lastUpdated: "12h ago",
    },
    {
      name: "Zoning Constraints",
      icon: "factory",
      severity: "Low",
      weightedContrib: 23,
      rawIndex: 0.12,
      dataSource: "City Planning Dept",
      lastUpdated: "2d ago",
    },
  ];

  const riskFactors = factors || defaultFactors;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-rust/10 text-rust border border-rust/20";
      case "Moderate":
        return "bg-blue-900/30 text-blue-300 border border-blue-800/30";
      case "Low":
        return "bg-green-900/30 text-green-300 border border-green-800/30";
      case "Low-Mod":
        return "bg-yellow-900/20 text-yellow-500 border border-yellow-800/30";
      default:
        return "bg-gray-900/30 text-gray-300 border border-gray-800/30";
    }
  };

  const getIconHoverColor = (icon: string) => {
    switch (icon) {
      case "terrain":
        return "group-hover:text-rust";
      case "water":
        return "group-hover:text-blue-400";
      case "forest":
        return "group-hover:text-green-500";
      case "waves":
        return "group-hover:text-yellow-500";
      case "factory":
        return "group-hover:text-purple-400";
      default:
        return "group-hover:text-gray-400";
    }
  };

  return (
    <div className="bg-surface-dark border border-surface-border rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center bg-surface-dark/50">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-icons text-primary text-sm">
            table_chart
          </span>
          Risk Factor Analysis
        </h2>
        <button className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-icons text-sm">tune</span> Customize View
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-dark/50 text-xs uppercase text-gray-500 font-semibold border-b border-surface-border">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">
                Risk Factor
              </th>
              <th className="px-6 py-4 font-bold tracking-wider">Severity</th>
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
            {riskFactors.map((factor) => (
              <tr
                key={factor.name}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  <span
                    className={`material-icons text-gray-500 text-sm ${getIconHoverColor(factor.icon)} transition-colors`}
                  >
                    {factor.icon}
                  </span>
                  {factor.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityStyles(factor.severity)}`}
                  >
                    {factor.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {factor.weightedContrib}%
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-400">
                  {factor.rawIndex.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {factor.dataSource}
                </td>
                <td className="px-6 py-4 text-right text-xs text-gray-500">
                  {factor.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-surface-border bg-background-dark/30 flex justify-between items-center text-xs text-gray-500">
        <span>Showing top 5 risk factors</span>
        <a
          className="hover:text-primary transition-colors font-medium"
          href="#"
        >
          View Full Risk Matrix
        </a>
      </div>
    </div>
  );
}
