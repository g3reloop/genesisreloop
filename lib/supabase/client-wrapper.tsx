'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface SupabaseContextType {
  supabase: SupabaseClient | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isLoading: true,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only initialize Supabase on the client side
    if (typeof window !== 'undefined') {
      try {
        // Check if environment variables are available
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.error('Supabase environment variables are missing')
          setIsLoading(false)
          return
        }

        const client = createClientComponentClient()
        setSupabase(client)
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

// HOC for pages that require Supabase
export function withSupabase<P extends object>(
  Component: React.ComponentType<P & { supabase: SupabaseClient }>
) {
  return function WrappedComponent(props: P) {
    const { supabase, isLoading } = useSupabase()

    if (isLoading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )
    }

    if (!supabase) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-red-500">
            <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
            <p>Supabase is not configured. Please check your environment variables.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} supabase={supabase} />
  }
}
