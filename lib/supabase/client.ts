import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5NDc4MDAsImV4cCI6MTk2MjUyMzgwMH0.placeholder_key_for_build'
  
  // Warn if using placeholder values
  if (url.includes('placeholder') || key.includes('placeholder')) {
    console.warn('⚠️  Using placeholder Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for production.')
  }
  
  return createBrowserClient(url, key)
}
