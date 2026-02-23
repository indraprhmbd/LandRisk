"use client";

import Link from "next/link";

export default function PageFooter() {
  return (
    <footer className="border-t border-surface-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/LandRisk.webp"
                alt="LandRisk"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              A structured spatial intelligence layer for early-stage land feasibility decisions. Quantify uncertainty with architectural precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/methodology" className="text-gray-400 hover:text-primary transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="text-gray-400 hover:text-primary transition-colors">
                  Data Sources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LandRisk Intelligence. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with precision for informed decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
