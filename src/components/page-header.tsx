"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
}

export default function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-center">
      <div className="flex flex-col items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors mb-6"
        >
          <span className="material-icons text-base">arrow_back</span>
          Back to Home
        </Link>
        
        <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
          {subtitle}
        </h2>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          {title}
        </h1>
        
        {description && (
          <p className="max-w-2xl text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
