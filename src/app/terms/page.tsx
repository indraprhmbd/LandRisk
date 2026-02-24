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

export default function TermsPage() {
  return (
    <>
      <TopographicBackground />
      <LandingNavbar />

      <main className="pt-24 pb-20 relative">
        <PageHeader
          title="Terms of Service"
          subtitle="Legal"
          description="Terms and conditions governing your use of LandRisk services."
        />

        <section className="max-w-4xl mx-auto px-6">
          <div className="text-sm text-gray-500 mb-8">
            Last updated: February 23, 2026
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                1. Acceptance of Terms
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  By accessing or using LandRisk services, you agree to be bound
                  by these Terms of Service. If you do not agree to these terms,
                  please do not use our services.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                2. User Obligations
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Not use the service for any illegal purpose</li>
                  <li>Not interfere with or disrupt the service</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                3. Intellectual Property
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  All content, features, and functionality of LandRisk services
                  are owned by LandRisk and are protected by international
                  copyright, trademark, and other intellectual property laws.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                4. Disclaimer of Warranties
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  LandRisk services are provided "as is" and "as available"
                  without warranties of any kind, either express or implied. We
                  do not warrant that the service will be uninterrupted, secure,
                  or error-free.
                </p>
                <p className="mt-4">
                  Risk assessments provided by LandRisk are for informational
                  purposes only and should not be used as the sole basis for
                  investment or development decisions.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                5. Limitation of Liability
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  To the maximum extent permitted by law, LandRisk shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, or any loss of profits or revenues,
                  whether incurred directly or indirectly, or any loss of data,
                  use, goodwill, or other intangible losses.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                6. Termination
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We may terminate or suspend your account and access to the
                  service immediately, without prior notice, for conduct that we
                  believe violates these terms or is harmful to other users, us,
                  or third parties.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                7. Governing Law
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  These terms shall be governed by and construed in accordance
                  with the laws of the jurisdiction where LandRisk operates,
                  without regard to its conflict of law provisions.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">8. Contact</h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  For questions about these Terms of Service, please contact us
                  at legal@landrisk.com.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
