import './globals.css'
import React from 'react'
import dynamic from 'next/dynamic'
import GenesisThemeProvider from '../components/theme/GenesisThemeProvider'
import { QuintupleLayer } from '../components/theme/QuintupleLayer'
import Navigation from '../components/layout/navigation'

// Dynamically import AuthProvider to prevent SSR issues
const AuthProvider = dynamic(
  () => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })),
  { ssr: false }
)

export const metadata = { 
  title: 'Genesis Reloop', 
  description: 'Build Homes. Close Loops. Replace Babylon.' 
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <GenesisThemeProvider>
            <QuintupleLayer>
              <Navigation />
              <main className="min-h-screen relative z-10">
                {children}
              </main>
            </QuintupleLayer>
          </GenesisThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
