import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "LandRisk — Land Feasibility Risk Evaluation",
  description:
    "A structured spatial intelligence layer for early-stage land feasibility decisions. Quantify uncertainty with architectural precision.",
};

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
        />
        <path
          d="M0,250 Q200,150 400,250 T800,250 T1200,250 T1600,250"
          strokeWidth="1"
        />
        <path
          d="M0,300 Q200,200 400,300 T800,300 T1200,300 T1600,300"
          strokeWidth="1"
        />
        <path
          d="M0,350 Q200,250 400,350 T800,350 T1200,350 T1600,350"
          strokeWidth="1"
        />
        <path
          d="M0,400 Q200,300 400,400 T800,400 T1200,400 T1600,400"
          strokeWidth="1"
        />
        <path d="M0,600 Q300,500 600,600 T1200,600 T1800,600" strokeWidth="1" />
        <path d="M0,650 Q300,550 600,650 T1200,650 T1800,650" strokeWidth="1" />
        <path d="M0,700 Q300,600 600,700 T1200,700 T1800,700" strokeWidth="1" />
        <circle cx="800" cy="400" opacity="0.1" r="300" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.1" r="250" strokeWidth="0.5" />
        <circle cx="800" cy="400" opacity="0.1" r="200" strokeWidth="0.5" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background-dark/50 to-background-dark" />
    </div>
  );
}

function Navbar() {
  return (
    <header className="relative z-50 w-full px-6 py-6 lg:px-12 border-b border-white/5 backdrop-blur-sm bg-background-dark/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 border border-primary/50 flex items-center justify-center rounded-lg">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            LandRisk
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
            href="/dashboard"
          >
            Dashboard
          </a>
          <a
            className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
            href="/map"
          >
            Map View
          </a>
          <a
            className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
            href="#methodology"
          >
            Methodology
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="hidden md:block text-sm font-medium text-background-dark bg-primary hover:bg-primary-light px-4 py-2 rounded-lg transition-colors"
          >
            Launch App
          </a>
          <a className="md:hidden text-white" href="/dashboard">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-background-dark py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <p>© 2024 LandRisk Intelligence. System Version LR-Engine-v1.0</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="hover:text-primary transition-colors" href="#">
            Support
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Documentation
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Legal
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} dark`}>
      <body className="font-display min-h-screen flex flex-col">
        <TopographicBackground />
        <Navbar />
        <main className="relative z-10 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
