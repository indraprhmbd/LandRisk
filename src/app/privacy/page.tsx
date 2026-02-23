"use client";

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

export default function PrivacyPage() {
  return (
    <>
      <TopographicBackground />
      <LandingNavbar />

      <main className="pt-24 pb-20 relative">
        <PageHeader
          title="Privacy Policy"
          subtitle="Legal"
          description="How we collect, use, and protect your personal information."
        />

        <section className="max-w-4xl mx-auto px-6">
          <div className="text-sm text-gray-500 mb-8">
            Last updated: February 23, 2026
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                1. Information We Collect
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address when you create an account</li>
                  <li>Location coordinates for land assessments</li>
                  <li>Payment information for subscription plans</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                2. How We Use Your Information
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>
                    Process your transactions and send related information
                  </li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                3. Data Protection
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. This includes
                  encryption of data in transit and at rest, regular security
                  assessments, and restricted access controls.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                4. Your Rights
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  You have the right to access, correct, or delete your personal
                  information. You can also object to or restrict certain
                  processing of your data. To exercise these rights, please
                  contact us at privacy@landrisk.com.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                5. Data Retention
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We retain your personal information for as long as necessary
                  to provide our services and comply with legal obligations. You
                  can request deletion of your account and data at any time.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                6. Contact Us
              </h3>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at privacy@landrisk.com.
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
