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

export default function MethodologyPage() {
  return (
    <>
      <TopographicBackground />
      <LandingNavbar />

      <main className="pt-24 pb-20 relative">
        <PageHeader
          title="Our Methodology"
          subtitle="Risk Assessment Engine"
          description="A comprehensive, data-driven approach to land feasibility evaluation combining multiple risk factors with AI-powered insights."
        />

        {/* Risk Calculation Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Composite Risk Scoring
            </h3>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Our deterministic risk engine calculates a composite score from
              five weighted factors, each contributing to the overall risk
              assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {/* Soil Stability */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 mb-4">
                <span className="material-icons text-primary text-2xl">
                  landscape
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Soil Stability
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Evaluates soil composition, bearing capacity, and geotechnical
                properties.
              </p>
              <div className="text-xs font-bold text-primary uppercase">
                Weight: 35%
              </div>
            </div>

            {/* Flood Exposure */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 mb-4">
                <span className="material-icons text-blue-400 text-2xl">
                  water
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Flood Exposure
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Analyzes flood risk based on precipitation data, elevation, and
                proximity to water bodies.
              </p>
              <div className="text-xs font-bold text-blue-400 uppercase">
                Weight: 25%
              </div>
            </div>

            {/* Environmental */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center border border-forest/20 mb-4">
                <span className="material-icons text-forest text-2xl">eco</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Environmental
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Assesses environmental sensitivity including seismic activity
                and ecological factors.
              </p>
              <div className="text-xs font-bold text-forest uppercase">
                Weight: 15%
              </div>
            </div>

            {/* Zoning */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="w-12 h-12 bg-amber/10 rounded-lg flex items-center justify-center border border-amber/20 mb-4">
                <span className="material-icons text-amber text-2xl">
                  business
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Zoning</h4>
              <p className="text-sm text-gray-400 mb-3">
                Evaluates zoning compliance and land use regulations for
                intended development.
              </p>
              <div className="text-xs font-bold text-amber uppercase">
                Weight: 15%
              </div>
            </div>

            {/* Topography */}
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 mb-4">
                <span className="material-icons text-purple-400 text-2xl">
                  terrain
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Topography</h4>
              <p className="text-sm text-gray-400 mb-3">
                Analyzes elevation, slope, and terrain characteristics for
                construction feasibility.
              </p>
              <div className="text-xs font-bold text-purple-400 uppercase">
                Weight: 10%
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="bg-surface-dark border border-surface-border rounded-lg p-8 max-w-3xl mx-auto">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 text-center">
              Risk Calculation Formula
            </h4>
            <code className="block bg-background-dark/50 rounded-lg p-4 text-sm text-primary font-mono overflow-x-auto">
              risk_score = (soil × 0.35) + (flood × 0.25) + (env × 0.15) +
              (zoning × 0.15) + (topo × 0.10)
            </code>
          </div>
        </section>

        {/* Confidence Scoring Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="bg-surface-dark border border-surface-border rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Confidence Scoring
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Every risk assessment includes a confidence score that indicates
                the reliability of the data and analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50%</div>
                <div className="text-sm font-bold text-white uppercase mb-2">
                  Data Completeness
                </div>
                <p className="text-xs text-gray-400">
                  Measures how much data is available from external sources.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">30%</div>
                <div className="text-sm font-bold text-white uppercase mb-2">
                  Model Consistency
                </div>
                <p className="text-xs text-gray-400">
                  Evaluates consistency across different data models.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">20%</div>
                <div className="text-sm font-bold text-white uppercase mb-2">
                  Data Recency
                </div>
                <p className="text-xs text-gray-400">
                  Assesses how recent and up-to-date the data sources are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Interpretation Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              AI-Powered Interpretation
            </h3>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Our AI layer provides contextual insights and recommendations
              based on the calculated risk scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                  <span className="material-icons text-primary text-xl">
                    psychology
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  When AI is Available
                </h4>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                LLM-powered analysis generates detailed interpretations,
                highlighting key risk factors and providing actionable
                recommendations.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">
                    check
                  </span>
                  Contextual risk summary
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">
                    check
                  </span>
                  Key observations
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">
                    check
                  </span>
                  Recommended actions
                </li>
              </ul>
            </div>

            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber/10 rounded-lg flex items-center justify-center border border-amber/20">
                  <span className="material-icons text-amber text-xl">
                    settings
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Deterministic Fallback
                </h4>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                When AI services are unavailable, our deterministic engine
                provides structured interpretations using rule-based logic.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="material-icons text-amber text-sm">
                    check
                  </span>
                  Always available
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-amber text-sm">
                    check
                  </span>
                  Consistent output
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-amber text-sm">
                    check
                  </span>
                  Transparent logic
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Risk Classification */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Risk Classification
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Risk scores are classified into three categories for easy
              interpretation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-forest mb-2">0-39</div>
              <div className="text-sm font-bold text-forest uppercase mb-2">
                Low Risk
              </div>
              <p className="text-xs text-gray-400">
                Minimal risk factors. Suitable for most development purposes
                with standard due diligence.
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-border rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-amber mb-2">40-69</div>
              <div className="text-sm font-bold text-amber uppercase mb-2">
                Moderate Risk
              </div>
              <p className="text-xs text-gray-400">
                Some risk factors present. Recommend targeted investigation
                before commitment.
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-border rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-rust mb-2">70-100</div>
              <div className="text-sm font-bold text-rust uppercase mb-2">
                High Risk
              </div>
              <p className="text-xs text-gray-400">
                Significant risk factors detected. Comprehensive assessment
                recommended before proceeding.
              </p>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
