'use client'

import { useEffect } from 'react'

export function SafeClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error handler to prevent page crashes
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error)
      
      // Log specific Supabase-related errors
      if (event.error?.message?.includes('Supabase') || 
          event.error?.message?.includes('NEXT_PUBLIC_SUPABASE')) {
        console.warn('⚠️  Supabase initialization error detected. Please configure environment variables.')
      }
      
      // Prevent the default error handling (which might cause page to disappear)
      event.preventDefault()
    }

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Log specific Supabase-related errors
      if (event.reason?.message?.includes('Supabase') || 
          event.reason?.message?.includes('NEXT_PUBLIC_SUPABASE')) {
        console.warn('⚠️  Supabase promise rejection detected. Please configure environment variables.')
      }
      
      // Prevent the default error handling
      event.preventDefault()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return <>{children}</>
}
