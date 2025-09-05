import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Web3Provider } from "@/hooks/useWeb3";
import { AuthProvider } from "@/contexts/AuthContext";
import { MythicBackgroundAnimated } from "@/components/ui/mythic-background";
import { Toaster } from "sonner";
import { ClientWrapper } from "@/components/layout/client-wrapper"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { SafeClientWrapper } from "@/components/SafeClientWrapper"
import { DebugErrorBoundary } from "@/components/DebugErrorBoundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://genesisreloop.com'),
  title: "Genesis Reloop — Decentralized Circular Economy for Waste-to-Value",
  description: "Connect feedstock suppliers, labs, and buyers. Automate deals, verify chain-of-custody, and issue GIRM Credits for measurable impact across UK/EU.",
  keywords: "circular economy, waste to value, chemical recycling, DAO marketplace, verified chain of custody, UK, EU, Genesis, GIRM credits, feedstock routing, escrow, SRL",
  authors: [{ name: "Genesis Reloop DAO" }],
  creator: "Genesis Protocol",
  publisher: "Genesis Reloop Community",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Genesis Reloop — Close loops. Build industry.",
    description: "Marketplace that turns waste into verified products with DAO governance and measurable impact.",
    type: "website",
    siteName: "Genesis Reloop",
    locale: "en_US",
    images: [
      {
        url: "/genesis_triple_circle_hero.png",
        width: 1200,
        height: 630,
        alt: "Genesis Reloop - Decentralized Circular Economy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis Reloop — Close loops. Build industry.",
    description: "Waste is stranded cashflow. Genesis Reloop routes feedstocks to labs and buyers with verifiable chain-of-custody and GIRM Credits.",
    images: ["/genesis_triple_circle_hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Genesis Reloop',
    'alternateName': 'Genesis Reloop DAO',
    'url': 'https://genesisreloop.com',
    'description': 'Genesis Reloop matches waste feedstocks with certified labs and guaranteed buyers. Verifiable chain-of-custody, automated routing, and GIRM Credits for measurable impact.',
    'founder': {
      '@type': 'Person',
      'name': 'Warren Brown',
      'jobTitle': 'Founder & Systems Designer'
    },
    'foundingDate': '2024',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Brighton',
      'addressCountry': 'United Kingdom'
    },
    'email': 'ops@genesisreloop.com',
    'sameAs': [
      'https://twitter.com/genesisreloop',
      'https://linkedin.com/company/genesisreloop',
      'https://github.com/warren-code/reloop-platform'
    ],
    'knowsAbout': [
      'Waste Management',
      'Circular Economy',
      'Biogas Production',
      'Biodiesel Production',
      'Carbon Credits',
      'DAO Governance',
      'Community Energy'
    ]
  }

  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-black text-mythic-text-primary min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Mythic Background */}
        <MythicBackgroundAnimated className="fixed inset-0 z-0" />
        
        {/* Skip Links for Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-mythic-primary-500 text-mythic-dark-900 px-4 py-2 rounded-md font-semibold z-50 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black">
          Skip to main content
        </a>
        <a href="#footer-navigation" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 bg-mythic-primary-500 text-mythic-dark-900 px-4 py-2 rounded-md font-semibold z-50 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black">
          Skip to footer
        </a>
        
        {/* Temporarily disabled SafeClientWrapper for debugging */}
        {/* <SafeClientWrapper> */}
          <ErrorBoundary>
            <DebugErrorBoundary name="AuthProvider">
              <AuthProvider>
                <DebugErrorBoundary name="Web3Provider">
                  <Web3Provider>
                    <div className="flex flex-col min-h-screen relative z-10">
                      <DebugErrorBoundary name="ClientWrapper">
                        <ClientWrapper>
                          <DebugErrorBoundary name="Header">
                            <Header />
                          </DebugErrorBoundary>
                          <main id="main-content" className="flex-1" role="main" aria-label="Main content">
                            <DebugErrorBoundary name="Main Content">
                              {children}
                            </DebugErrorBoundary>
                          </main>
                          <DebugErrorBoundary name="Footer">
                            <Footer />
                          </DebugErrorBoundary>
                          <Toaster richColors position="top-right" theme="dark" />
                        </ClientWrapper>
                      </DebugErrorBoundary>
                    </div>
                  </Web3Provider>
                </DebugErrorBoundary>
              </AuthProvider>
            </DebugErrorBoundary>
          </ErrorBoundary>
        {/* </SafeClientWrapper> */}
      </body>
    </html>
  );
}
