"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Redirect to Kinde login
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="min-h-screen my-5 flex items-center justify-center bg-background-dark">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background-dark to-background-dark" />
      </div>

      {/* Login Card */}
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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">
              Sign in to access your land risk assessments
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Spinner size={24} className="animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <span className="material-icons text-lg">login</span>
                Continue with Kinde
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
                Secure Authentication
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="material-icons text-primary text-sm">
                security
              </span>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="material-icons text-primary text-sm">speed</span>
              <span>Fast and seamless login</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="material-icons text-primary text-sm">
                cloud_sync
              </span>
              <span>Access your data anywhere</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/register"
                className="text-primary hover:text-primary-light transition-colors font-semibold"
              >
                Register now
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
          Powered by Kinde Authentication
        </p>
      </div>
    </div>
  );
}
