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

export default function PricingPage() {
  return (
    <>
      <TopographicBackground />
      <LandingNavbar />

      <main className="pt-24 pb-20 relative">
        <PageHeader
          title="Simple, Transparent Pricing"
          subtitle="Pricing Plans"
          description="Choose the plan that fits your land assessment needs. From individual evaluations to enterprise-scale analysis."
        />

        {/* Pricing Tiers */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-surface-dark border border-surface-border rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <p className="text-sm text-gray-400">
                  For individual users getting started
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <a
                href="/auth/register"
                className="block w-full bg-surface-border hover:bg-surface-border-alt text-white text-sm font-semibold py-3 px-4 rounded-lg transition-colors text-center mb-6"
              >
                Get Started
              </a>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  5 evaluations per month
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Basic risk assessment
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Deterministic interpretations
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Standard data sources
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="bg-surface-dark border-2 border-primary rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <p className="text-sm text-gray-400">
                  For professionals and small teams
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <a
                href="/auth/register"
                className="block w-full bg-primary hover:bg-primary-light text-white text-sm font-semibold py-3 px-4 rounded-lg transition-colors text-center mb-6"
              >
                Start Free Trial
              </a>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-white">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  50 evaluations per month
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  AI-powered interpretations
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  PDF report exports
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Priority data sources
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Historical risk tracking
                </li>
              </ul>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-surface-dark border border-surface-border rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Enterprise
                </h3>
                <p className="text-sm text-gray-400">For large organizations</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <a
                href="/contact"
                className="block w-full bg-surface-border hover:bg-surface-border-alt text-white text-sm font-semibold py-3 px-4 rounded-lg transition-colors text-center mb-6"
              >
                Contact Sales
              </a>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Unlimited evaluations
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Custom data integration
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  API access
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  Dedicated support
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <span className="material-icons text-primary text-sm mt-0.5">
                    check
                  </span>
                  SLA guarantees
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Feature Comparison
            </h3>
            <p className="text-gray-400">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6 text-white font-bold">
                    Free
                  </th>
                  <th className="text-center py-4 px-6 text-primary font-bold">
                    Pro
                  </th>
                  <th className="text-center py-4 px-6 text-gray-400 font-medium">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-border/50">
                  <td className="py-4 px-6 text-gray-300">
                    Evaluations per month
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">5</td>
                  <td className="py-4 px-6 text-center text-white">50</td>
                  <td className="py-4 px-6 text-center text-gray-400">
                    Unlimited
                  </td>
                </tr>
                <tr className="border-b border-surface-border/50">
                  <td className="py-4 px-6 text-gray-300">Risk assessment</td>
                  <td className="py-4 px-6 text-center text-gray-400">Basic</td>
                  <td className="py-4 px-6 text-center text-white">Advanced</td>
                  <td className="py-4 px-6 text-center text-gray-400">
                    Advanced
                  </td>
                </tr>
                <tr className="border-b border-surface-border/50">
                  <td className="py-4 px-6 text-gray-300">
                    AI interpretations
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-white">✓</td>
                  <td className="py-4 px-6 text-center text-gray-400">✓</td>
                </tr>
                <tr className="border-b border-surface-border/50">
                  <td className="py-4 px-6 text-gray-300">PDF exports</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-white">✓</td>
                  <td className="py-4 px-6 text-center text-gray-400">✓</td>
                </tr>
                <tr className="border-b border-surface-border/50">
                  <td className="py-4 px-6 text-gray-300">
                    Historical tracking
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-white">✓</td>
                  <td className="py-4 px-6 text-center text-gray-400">✓</td>
                </tr>
                <tr className="border-b border-surface-border/50">
                  <td className="py-4 px-6 text-gray-300">API access</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-white">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">
                    Custom integration
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-white">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <h4 className="text-base font-bold text-white mb-2">
                Can I change plans later?
              </h4>
              <p className="text-sm text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <h4 className="text-base font-bold text-white mb-2">
                Is there a free trial?
              </h4>
              <p className="text-sm text-gray-400">
                Yes, Pro plans come with a 14-day free trial. No credit card
                required to start.
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <h4 className="text-base font-bold text-white mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-sm text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for
                Enterprise plans.
              </p>
            </div>

            <div className="bg-surface-dark border border-surface-border rounded-lg p-6">
              <h4 className="text-base font-bold text-white mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-sm text-gray-400">
                Yes, you can cancel your subscription at any time. Your account
                will remain active until the end of the billing period.
              </p>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
