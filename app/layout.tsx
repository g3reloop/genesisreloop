import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Web3Provider } from "@/hooks/useWeb3";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Genesis Reloop — Community Loops for Energy & Food",
  description: "Waste to Fuel. Fuel to Food. Loops that Pay Communities. Turn local waste into local fuel with modular biogas and biodiesel loops. GIRM credits lower costs. DAO funds the next loop.",
  keywords: "Genesis Reloop, SRL, stabilized recursive loop, food waste biogas, UCO biodiesel, modular processing, heat cascading, GIRM credits, DAO governance, community energy, waste to fuel, circular economy",
  authors: [{ name: "Genesis Reloop DAO" }],
  creator: "Genesis Protocol",
  publisher: "Genesis Reloop Community",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Genesis Reloop — Turn Local Waste into Local Fuel",
    description: "Waste to Fuel. Fuel to Food. Loops that Pay Communities. Modular biogas and biodiesel loops that turn waste into local fuel and fertilizer. GIRM credits lower costs. DAO funds the next loop.",
    type: "website",
    siteName: "Genesis Reloop",
    locale: "en_US",
    images: [
      {
        url: "/genesis_triple_circle_hero.png",
        width: 1200,
        height: 630,
        alt: "Genesis Reloop - Community Loops for Energy & Food",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis Reloop — Turn Local Waste into Local Fuel",
    description: "Waste to Fuel. Fuel to Food. Loops that Pay Communities.",
    images: ["/genesis_triple_circle_hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased bg-black text-mythic-text-primary min-h-screen flex flex-col">
        {/* Skip Links for Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-mythic-primary-500 text-mythic-dark-900 px-4 py-2 rounded-md font-semibold z-50 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black">
          Skip to main content
        </a>
        <a href="#footer-navigation" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 bg-mythic-primary-500 text-mythic-dark-900 px-4 py-2 rounded-md font-semibold z-50 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black">
          Skip to footer
        </a>
        
        <Web3Provider>
          <Header />
          <main id="main-content" className="flex-1" role="main" aria-label="Main content">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="top-right" theme="dark" />
        </Web3Provider>
      </body>
    </html>
  );
}
