'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Safely creates a Supabase client that handles missing environment variables
 * during build time. This prevents build errors when Next.js tries to pre-render
 * pages that use Supabase.
 */
export function createSafeClientComponentClient(): SupabaseClient | null {
  // During build time, environment variables might not be available
  if (typeof window === 'undefined' && 
      (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return null
  }
  
  try {
    return createClientComponentClient()
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    return null
  }
}
