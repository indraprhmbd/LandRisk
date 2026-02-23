"use client";

import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

export default function LandingNavbar() {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <nav className="fixed top-0 w-full z-50 border-b border-surface-border-alt bg-background-dark-alt/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center">
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-surface-border-alt bg-background-dark-alt/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/assets/LandRisk.webp"
            alt="LandRisk"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a className="hover:text-primary transition-colors" href="/methodology">
            Methodology
          </a>
          <a className="hover:text-primary transition-colors" href="/pricing">
            Pricing
          </a>
          <a className="hover:text-primary transition-colors" href="/data-sources">
            Data Sources
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="text-sm font-medium text-primary hover:text-white transition-colors"
              >
                Dashboard
              </a>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {user?.given_name || user?.email || "User"}
                </span>
                <LogoutLink className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Logout
                </LogoutLink>
              </div>
            </div>
          ) : (
            <>
              <a
                href="/auth/login"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </a>
              <a
                href="/auth/register"
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded text-sm font-semibold transition-all"
              >
                Get Started
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          <span className="material-icons text-2xl">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border-alt bg-surface-dark-alt">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <a
              href="/methodology"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-gray-300 hover:text-white py-2"
            >
              Methodology
            </a>
            <a
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-gray-300 hover:text-white py-2"
            >
              Pricing
            </a>
            <a
              href="/data-sources"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-gray-300 hover:text-white py-2"
            >
              Data Sources
            </a>

            {/* Auth Buttons */}
            <div className="pt-4 border-t border-surface-border">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <a
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-primary font-semibold py-2"
                  >
                    Dashboard
                  </a>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{user?.given_name || user?.email || "User"}</span>
                    <LogoutLink
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      Logout
                    </LogoutLink>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <a
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-gray-300 hover:text-white py-2"
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-primary font-semibold py-2"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
