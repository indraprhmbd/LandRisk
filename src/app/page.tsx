import LandingNavbar from "@/components/landing-navbar";
import Footer from "@/components/footer";
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

export default function LandingPage() {
  return (
    <>
      <TopographicBackground />
      <LandingNavbar />
      <main className="pt-24 pb-20 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
                Methodology & Intelligence
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                From Raw Coordinates to <br className="hidden md:block" />
                <span className="text-gradient">Spatial Certainty</span>
              </h1>
              <p className="max-w-md text-gray-400 text-sm leading-relaxed mt-4 md:mt-6">
                Our proprietary engine ingests millions of data points to
                generate actionable feasibility outputs, reducing acquisition
                risk by up to 40%.
              </p>
            </div>
            <p className="max-w-md text-gray-400 text-sm leading-relaxed border-l-2 border-primary/20 pl-4 hidden md:block">
              Evaluate land feasibility with AI-powered insights. Get
              comprehensive risk analysis for informed investment decisions.
            </p>
          </div>
        </section>

        {/* Output Preview Section */}
        <section className="max-w-5xl mx-auto px-6 relative z-10 mb-24">
          <div className="flex items-center justify-center mb-10">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest border border-surface-border-alt rounded-full px-4 py-1 bg-surface-dark-alt">
              Output Preview
            </h2>
          </div>
          <div className="bg-surface-dark-alt border border-surface-border-alt rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Score & Stats */}
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    Overall Feasibility
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold text-white tracking-tighter">
                      72
                    </span>
                    <span className="text-xl text-gray-500 font-light">
                      / 100
                    </span>
                  </div>
                  <p className="text-primary text-sm font-semibold mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Moderate Feasibility
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <span>High Risk</span>
                    <span>Optimal</span>
                  </div>
                  <div className="h-3 w-full rounded-full relative overflow-hidden bg-surface-border-alt/30">
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #9E2A2B 0%, #b08969 50%, #3A5A40 100%)",
                        opacity: 0.8,
                      }}
                    ></div>
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10"
                      style={{ left: "72%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    Score Position:{" "}
                    <span className="text-white font-mono">
                      72nd Percentile
                    </span>
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-background-dark-alt/50 border border-surface-border-alt rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons text-gray-400 text-sm">
                        verified_user
                      </span>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Confidence
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white">84%</span>
                  </div>
                  <div className="bg-background-dark-alt/50 border border-surface-border-alt rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons text-gray-400 text-sm">
                        timelapse
                      </span>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Processing
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white">1.2s</span>
                  </div>
                </div>
              </div>

              {/* Right: Map Visualization */}
              <div className="relative h-full min-h-[300px] w-full bg-background-dark-alt rounded-xl border border-surface-border-alt overflow-hidden group">
                <img
                  alt="Satellite view of land parcel with overlay data visualization"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700"
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top badges */}
                  <div className="flex justify-between items-start">
                    <div className="bg-background-dark-alt/80 backdrop-blur-sm border border-surface-border-alt px-3 py-1 rounded text-[10px] text-white font-mono">
                      LAT: 34.0522 N <br /> LNG: 118.2437 W
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 animate-pulse">
                      <span className="material-icons text-primary text-xs">
                        radar
                      </span>
                    </div>
                  </div>

                  {/* Site marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 border-2 border-primary/60 bg-primary/10 rounded-sm transform skew-x-12">
                    <div className="absolute -top-6 -right-6 text-xs text-white bg-primary px-2 py-0.5 rounded shadow-lg">
                      Site A
                    </div>
                  </div>

                  {/* Bottom overlays */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-300 bg-background-dark-alt/80 backdrop-blur-sm p-2 rounded w-fit border border-surface-border-alt">
                      <span className="w-2 h-2 rounded-full bg-rust"></span>
                      <span>Seismic Hazard: Moderate</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300 bg-background-dark-alt/80 backdrop-blur-sm p-2 rounded w-fit border border-surface-border-alt">
                      <span className="w-2 h-2 rounded-full bg-forest"></span>
                      <span>Flood Zone: Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="w-full relative z-10 overflow-hidden mb-16">
          <div className="flex items-center justify-center mb-10">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest border border-surface-border-alt rounded-full px-4 py-1 bg-surface-dark-alt">
              The Process
            </h2>
          </div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-surface-border-alt -translate-y-1/2 hidden md:block"></div>
          <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar pb-8">
            <div className="flex gap-4 md:gap-0 min-w-[800px] md:min-w-0 md:justify-between relative">
              {/* Step 1 */}
              <div className="relative group w-64 md:w-1/4 pr-4">
                <div className="h-full p-6 bg-surface-dark-alt border border-surface-border-alt rounded-xl hover:border-primary/50 transition-all duration-300 relative z-10 flex flex-col gap-4 group-hover:shadow-[0_0_20px_rgba(176,137,105,0.1)]">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mb-2">
                    <span className="material-icons text-xl">
                      add_location_alt
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      01. Input Location
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Coordinate geometry ingestion via API or manual plot
                      entry.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent -z-0 translate-x-1/2 opacity-20"></div>
              </div>

              {/* Step 2 */}
              <div className="relative group w-64 md:w-1/4 px-2">
                <div className="h-full p-6 bg-surface-dark-alt border border-surface-border-alt rounded-xl hover:border-primary/50 transition-all duration-300 relative z-10 flex flex-col gap-4 group-hover:shadow-[0_0_20px_rgba(176,137,105,0.1)]">
                  <div className="w-10 h-10 rounded-lg bg-surface-border-alt/50 flex items-center justify-center border border-surface-border-alt text-gray-300 mb-2 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                    <span className="material-icons text-xl">layers</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      02. Data Assembly
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Multi-layer environmental constraints & zoning
                      aggregation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group w-64 md:w-1/4 px-2">
                <div className="h-full p-6 bg-surface-dark-alt border border-surface-border-alt rounded-xl hover:border-primary/50 transition-all duration-300 relative z-10 flex flex-col gap-4 group-hover:shadow-[0_0_20px_rgba(176,137,105,0.1)]">
                  <div className="w-10 h-10 rounded-lg bg-surface-border-alt/50 flex items-center justify-center border border-surface-border-alt text-gray-300 mb-2 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                    <span className="material-icons text-xl">schema</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      03. Risk Modeling
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Probabilistic hazard analysis using historical ML models.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative group w-64 md:w-1/4 pl-4">
                <div className="h-full p-6 bg-primary/10 border border-primary/30 rounded-xl relative z-10 flex flex-col gap-4 shadow-[0_0_30px_rgba(176,137,105,0.15)]">
                  <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-icons text-xl">analytics</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      04. Risk Brief
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Actionable feasibility output structured for investment
                      committees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="landing" />
      <PageFooter />
    </>
  );
}
