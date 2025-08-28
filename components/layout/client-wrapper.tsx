'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TourGuide } from '@/components/onboarding/tour-guide'
import { usePathname } from 'next/navigation'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [showTour, setShowTour] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (user && pathname !== '/login' && pathname !== '/register') {
      // Check if this is user's first login
      const hasSeenTour = localStorage.getItem('genesis-tour-completed')
      const isFirstLogin = localStorage.getItem('genesis-first-login') !== 'false'
      
      if (!hasSeenTour && isFirstLogin) {
        // Slight delay to ensure page is loaded
        setTimeout(() => {
          setShowTour(true)
          localStorage.setItem('genesis-first-login', 'false')
        }, 1000)
      }
    }
  }, [user, pathname])

  return (
    <>
      {children}
      <TourGuide startTour={showTour} onComplete={() => setShowTour(false)} />
    </>
  )
}
