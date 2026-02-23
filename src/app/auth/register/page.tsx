"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner, CheckCircle } from "@phosphor-icons/react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    // Redirect to Kinde register
    window.location.href = "/api/auth/register";
  };

  return (
    <div className="min-h-screen flex items-center my-5 justify-center bg-background-dark">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background-dark to-background-dark" />
      </div>

      {/* Register Card */}
      <div className="relative z-10 max-w-md w-full mx-6">
        <div className="bg-surface-dark border border-surface-border rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/assets/logo.webp"
              alt="LandRisk"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm">
              Start evaluating land risks with confidence
            </p>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Spinner size={24} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <span className="material-icons text-lg">person_add</span>
                Create Account with Kinde
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-dark px-4 text-gray-400">
                Free to Get Started
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={12} className="text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-white font-medium">
                  Access to all risk assessment tools
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Evaluate land feasibility with AI-powered insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={12} className="text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-white font-medium">
                  Save and track your evaluations
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Build a portfolio of assessed properties
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={12} className="text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-white font-medium">
                  Download detailed reports
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Export comprehensive risk analysis for stakeholders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={12} className="text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-xs text-white font-medium">
                  Historical risk analysis
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Track changes in risk factors over time
                </p>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-primary hover:text-primary-light transition-colors font-semibold"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-icons text-sm">arrow_back</span>
              Back to Home
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
