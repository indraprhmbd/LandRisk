import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { AuthProvider } from "./AuthProvider";
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
  icons: {
    icon: [
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon.ico", sizes: "any" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@0..1,100..700&display=swap"
        />
        <link rel="manifest" href="/assets/site.webmanifest" />
      </head>
      <body className="font-display min-h-screen bg-background-dark text-off-white">
        <AuthProvider>
          <main className="flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
