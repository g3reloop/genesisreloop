import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import GenesisProvider from '@/src/components/genesis/GenesisProvider'
import AnimatedBackground from '@/src/components/layout/AnimatedBackground'
import { Navigation } from '@/src/components/layout/Navigation'
import { Footer } from '@/src/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-serif' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = { 
  title: 'Genesis Parallel Protocol', 
  description: 'DAO-first circular economy. Proofs over promises.' 
}

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} ${mono.variable} font-sans`}>
        <GenesisProvider>
          <AnimatedBackground>
            <div className='flex min-h-screen flex-col'>
              <Navigation />
              <main className='flex-1'>{children}</main>
              <Footer />
            </div>
          </AnimatedBackground>
        </GenesisProvider>
      </body>
    </html>
  )
}
