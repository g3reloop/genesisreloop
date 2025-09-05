import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side Supabase client for App Router
export async function createClient() {
  try {
    const cookieStore = await cookies()
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
          signOut: async () => ({ error: null })
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        })
      } as any
    }

    return createServerClient(
      url,
      key,
      {
        cookies: {
          async get(name: string) {
            return cookieStore.get(name)?.value
          },
          async set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          async remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    // Return a mock client to prevent app crashes
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase initialization failed') }),
        signOut: async () => ({ error: null })
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

// Admin client with service role key (use with caution!)
export function createAdminClient() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    // Check if we have valid environment variables
    if (!url || !key || url === 'placeholder' || key === 'placeholder') {
      console.warn('⚠️  Supabase admin client not configured. Admin features will be disabled.')
      // Return a mock client that won't break the app
      return {
        auth: {
          admin: {
            listUsers: async () => ({ data: { users: [] }, error: new Error('Supabase admin not configured') })
          }
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase admin not configured') }),
          update: () => Promise.resolve({ data: null, error: new Error('Supabase admin not configured') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase admin not configured') })
        })
      } as any
    }
    
    return createServerClient(
      url,
      key,
      {
        cookies: {
          async get() {
            return null
          },
          async set() {},
          async remove() {},
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase admin client:', error)
    // Return a mock client to prevent app crashes
    return {
      auth: {
        admin: {
          listUsers: async () => ({ data: { users: [] }, error: new Error('Supabase admin initialization failed') })
        }
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase admin initialization failed') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase admin initialization failed') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase admin initialization failed') })
      })
    } as any
  }
}
