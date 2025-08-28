'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserRole, Permission } from '@/types/agents'
import { usePermissions } from '@/lib/auth/rbac'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  connectWallet: (address: string) => Promise<void>
  can: (resource: string, action: string) => boolean
  canAccessRoute: (route: string) => boolean
  permissions: Permission[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Feature gating configuration
const PROTECTED_ROUTES: Record<string, boolean> = {
  '/agents': false, // Public but limited functionality
  '/agents/:id': true, // Requires auth
  '/operator': true,
  '/monitor': true,
  '/monitoring': true,
  '/treasury': true,
  '/proposals': true,
  '/collection-routes': true,
  '/ops': true,
  '/micro-collection': true,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get permissions based on current user role
  const permissions = usePermissions(user?.role || 'buyer')

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          // In production, validate token with backend
          // For now, decode mock user from token
          const mockUser: User = {
            id: '1',
            name: 'Admin User',
            email: 'admin@genesisreloop.com',
            role: 'admin'
          }
          setUser(mockUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // In production, call auth API
      // For now, mock authentication
      const mockUsers: Record<string, User> = {
        'admin@genesisreloop.com': {
          id: '1',
          name: 'Admin User',
          email: 'admin@genesisreloop.com',
          role: 'admin'
        },
        'supplier@example.com': {
          id: '2',
          name: 'Supplier User',
          email: 'supplier@example.com',
          role: 'supplier'
        },
        'collector@example.com': {
          id: '3',
          name: 'Collector User',
          email: 'collector@example.com',
          role: 'collector'
        },
        'processor@example.com': {
          id: '4',
          name: 'Processor User',
          email: 'processor@example.com',
          role: 'processor'
        },
        'buyer@example.com': {
          id: '5',
          name: 'Buyer User',
          email: 'buyer@example.com',
          role: 'buyer'
        }
      }

      const user = mockUsers[email]
      if (user && password === 'password') {
        setUser(user)
        localStorage.setItem('authToken', 'mock-token')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  const connectWallet = async (address: string) => {
    if (user) {
      setUser({ ...user, walletAddress: address })
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    connectWallet,
    can: permissions.can,
    canAccessRoute: permissions.canAccessRoute,
    permissions: permissions.permissions
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
