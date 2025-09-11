import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client
export function createClient() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Check if we have valid environment variables
    if (!url || !key || url === 'placeholder' || key === 'placeholder') {
      console.warn('⚠️  Supabase environment variables not configured. Some features will be disabled.')
      // Return a mock client that won't break the app
      return {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } }
          })
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        })
      } as any
    }
    
    return createBrowserClient(url, key)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    // Return a mock client to prevent app crashes
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase initialization failed') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } }
        })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') })
      })
    } as any
  }
}
