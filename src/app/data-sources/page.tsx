import LandingNavbar from "@/components/landing-navbar";
import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";

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
          opacity="0.15"
        />
        <path
          d="M0,250 Q200,150 400,250 T800,250 T1200,250 T1600,250"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,300 Q200,200 400,300 T800,300 T1200,300 T1600,300"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,350 Q200,250 400,350 T800,350 T1200,350 T1600,350"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,400 Q200,300 400,400 T800,400 T1200,400 T1600,400"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,600 Q300,500 600,600 T1200,600 T1800,600"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,650 Q300,550 600,650 T1200,650 T1800,650"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M0,700 Q300,600 600,700 T1200,700 T1800,700"
          strokeWidth="1"
          opacity="0.15"
        />
        <circle cx="800" cy="400" opacity="0.03" r="300" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.03" r="250" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.03" r="200" strokeWidth="0.5" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background-dark/10 to-background-dark/5" />
    </div>
  );
}

export default function DataSourcesPage() {
  return (
    <>
      <TopographicBackground />
      <LandingNavbar />

      <main className="pt-24 pb-20 relative">
        <PageHeader
          title="Data Sources"
          subtitle="Transparency"
          description="Learn about the external data sources that power our risk assessments."
        />

        {/* Data Sources Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SoilGrids */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 flex-shrink-0">
                  <span className="material-icons text-primary text-2xl">
                    landscape
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    SoilGrids Regional
                  </h3>
                  <p className="text-xs text-gray-400">
                    ISRIC - World Soil Information
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Provides global soil property data including clay content, sand
                content, organic carbon, and pH levels at multiple soil depths.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Update: Every 2 hours</span>
                <span className="px-2 py-0.5 bg-forest/10 border border-forest/30 text-forest rounded">
                  Quality: A
                </span>
              </div>
            </div>

            {/* NASA POWER */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                  <span className="material-icons text-blue-400 text-2xl">
                    cloud
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    NASA POWER
                  </h3>
                  <p className="text-xs text-gray-400">
                    NASA Prediction of Worldwide Energy Resources
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Provides meteorological data including precipitation, humidity,
                temperature, and solar radiation for flood risk assessment.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Update: Daily</span>
                <span className="px-2 py-0.5 bg-forest/10 border border-forest/30 text-forest rounded">
                  Quality: A
                </span>
              </div>
            </div>

            {/* USGS */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-amber/10 rounded-lg flex items-center justify-center border border-amber/20 flex-shrink-0">
                  <span className="material-icons text-amber text-2xl">
                    warning
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    USGS Earthquake
                  </h3>
                  <p className="text-xs text-gray-400">
                    U.S. Geological Survey
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Provides seismic activity data including earthquake frequency,
                magnitude, and proximity for environmental risk assessment.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Update: Every 6 hours</span>
                <span className="px-2 py-0.5 bg-forest/10 border border-forest/30 text-forest rounded">
                  Quality: A
                </span>
              </div>
            </div>

            {/* Open-Elevation */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                  <span className="material-icons text-purple-400 text-2xl">
                    terrain
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Open-Elevation
                  </h3>
                  <p className="text-xs text-gray-400">
                    SRTM Digital Elevation Data
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Provides elevation and topography data for terrain analysis,
                slope calculation, and construction feasibility assessment.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Update: On-demand</span>
                <span className="px-2 py-0.5 bg-primary/10 border border-primary/30 text-primary rounded">
                  Quality: B
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Quality Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="bg-surface-dark border border-surface-border rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Data Quality Indicators
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We maintain transparency about the quality and reliability of
                our data sources.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center border border-forest/30 mx-auto mb-4">
                  <span className="text-2xl font-bold text-forest">A</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase mb-2">
                  Excellent
                </h4>
                <p className="text-xs text-gray-400">
                  High reliability, frequent updates, multiple verification
                  sources
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">B</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase mb-2">
                  Good
                </h4>
                <p className="text-xs text-gray-400">
                  Reliable data, regular updates, single primary source
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rust/10 rounded-full flex items-center justify-center border border-rust/30 mx-auto mb-4">
                  <span className="text-2xl font-bold text-rust">C</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase mb-2">
                  Fair
                </h4>
                <p className="text-xs text-gray-400">
                  Limited availability, infrequent updates, use with caution
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Developer Resources
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Access our data sources directly through our API.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://soilgrids.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-dark border border-surface-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  SoilGrids API
                </h4>
                <span className="material-icons text-gray-400 group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Access global soil property data through the ISRIC REST API
              </p>
            </a>

            <a
              href="https://power.larc.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-dark border border-surface-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  NASA POWER API
                </h4>
                <span className="material-icons text-gray-400 group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Access meteorological and solar energy data from NASA
              </p>
            </a>

            <a
              href="https://earthquake.usgs.gov/fdsnws/event/1/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-dark border border-surface-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  USGS Earthquake API
                </h4>
                <span className="material-icons text-gray-400 group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Access earthquake catalog and seismic hazard data
              </p>
            </a>

            <a
              href="https://www.open-elevation.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-dark border border-surface-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  Open-Elevation API
                </h4>
                <span className="material-icons text-gray-400 group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Access global elevation data through a simple REST API
              </p>
            </a>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
