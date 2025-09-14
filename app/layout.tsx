import './globals.css'
import React from 'react'

export const metadata = { 
  title: 'Genesis Reloop', 
  description: 'Build Homes. Close Loops. Replace Babylon.' 
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen">
        <nav className="border-b border-white/10 p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Genesis Reloop</h1>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
