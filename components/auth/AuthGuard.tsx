'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, ShieldAlert, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export type UserRole = 'supplier' | 'processor' | 'buyer' | 'admin'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requireVerified?: boolean
  requireOnboarded?: boolean
  fallbackUrl?: string
}

interface UserProfile {
  id: string
  email: string
  role: UserRole
  verified: boolean
  onboarding_completed: boolean
  business_name?: string
}

export function AuthGuard({
  children,
  requiredRoles = [],
  requireVerified = false,
  requireOnboarded = false,
  fallbackUrl = '/login'
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Get session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push(fallbackUrl)
        return
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        setError('Failed to load user profile')
        return
      }

      // Check role requirements
      if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
        setError(`This page requires one of the following roles: ${requiredRoles.join(', ')}`)
        return
      }

      // Check verification requirement
      if (requireVerified && !profile.verified) {
        setError('Business verification required')
        return
      }

      // Check onboarding requirement
      if (requireOnboarded && !profile.onboarding_completed) {
        router.push('/onboarding')
        return
      }

      setUser(profile)
    } catch (error) {
      console.error('Auth check error:', error)
      setError('Authentication error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mythic-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle className="text-mythic-text-primary">Access Denied</CardTitle>
            </div>
            <CardDescription className="text-mythic-text-muted">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error === 'Business verification required' ? (
              <>
                <Alert className="mb-4">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    This feature requires business verification to ensure trust and compliance
                    within the Genesis Reloop network.
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => router.push('/verify')}
                  >
                    Start Verification
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Return Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthWrappedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

// Hook for accessing current user within AuthGuard
import { createContext, useContext } from 'react'

const AuthContext = createContext<UserProfile | null>(null)

export function AuthProvider({ children, user }: { children: React.ReactNode; user: UserProfile | null }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuthUser() {
  const user = useContext(AuthContext)
  if (!user) {
    throw new Error('useAuthUser must be used within AuthGuard')
  }
  return user
}

// Updated AuthGuard to include context provider
export function AuthGuardWithContext({
  children,
  requiredRoles = [],
  requireVerified = false,
  requireOnboarded = false,
  fallbackUrl = '/login'
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push(fallbackUrl)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        setError('Failed to load user profile')
        return
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
        setError(`This page requires one of the following roles: ${requiredRoles.join(', ')}`)
        return
      }

      if (requireVerified && !profile.verified) {
        setError('Business verification required')
        return
      }

      if (requireOnboarded && !profile.onboarding_completed) {
        router.push('/onboarding')
        return
      }

      setUser(profile)
    } catch (error) {
      console.error('Auth check error:', error)
      setError('Authentication error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mythic-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle className="text-mythic-text-primary">Access Denied</CardTitle>
            </div>
            <CardDescription className="text-mythic-text-muted">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error === 'Business verification required' ? (
              <>
                <Alert className="mb-4">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    This feature requires business verification to ensure trust and compliance
                    within the Genesis Reloop network.
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => router.push('/verify')}
                  >
                    Start Verification
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Return Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AuthProvider user={user}>
      {children}
    </AuthProvider>
  )
}
