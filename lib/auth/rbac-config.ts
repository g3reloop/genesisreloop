import { UserRole } from '@/components/auth/AuthGuard'

interface RouteConfig {
  path: string
  requiredRoles?: UserRole[]
  requireVerified?: boolean
  requireOnboarded?: boolean
  description: string
}

// Define access rules for all protected routes
export const ROUTE_ACCESS_CONFIG: RouteConfig[] = [
  // Dashboard - all authenticated users
  {
    path: '/dashboard',
    requireOnboarded: true,
    description: 'User dashboard'
  },

  // Marketplace - different rules for different actions
  {
    path: '/marketplace',
    description: 'View marketplace listings (public)'
  },
  {
    path: '/marketplace/add',
    requiredRoles: ['supplier', 'processor'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Add marketplace listings'
  },
  {
    path: '/marketplace/[id]/edit',
    requiredRoles: ['supplier', 'processor'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Edit own listings'
  },

  // Messaging - all authenticated users who completed onboarding
  {
    path: '/messages',
    requireOnboarded: true,
    description: 'In-app messaging'
  },

  // Verification
  {
    path: '/verify',
    requireOnboarded: true,
    description: 'Business verification'
  },
  {
    path: '/verify/status',
    requireOnboarded: true,
    description: 'Verification status'
  },

  // Admin routes
  {
    path: '/admin',
    requiredRoles: ['admin'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Admin dashboard'
  },
  {
    path: '/admin/verifications',
    requiredRoles: ['admin'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Admin verification queue'
  },
  {
    path: '/admin/users',
    requiredRoles: ['admin'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'User management'
  },
  {
    path: '/admin/listings',
    requiredRoles: ['admin'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Listing moderation'
  },

  // Agent routes - role-based access handled by agent service
  {
    path: '/agents',
    description: 'AI agents hub (public with role-based agent access)'
  },

  // Profile management
  {
    path: '/profile',
    requireOnboarded: true,
    description: 'User profile'
  },
  {
    path: '/profile/edit',
    requireOnboarded: true,
    description: 'Edit profile'
  },

  // Supplier-specific routes
  {
    path: '/supplier/collections',
    requiredRoles: ['supplier'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Manage waste collections'
  },
  {
    path: '/supplier/analytics',
    requiredRoles: ['supplier'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Supplier analytics'
  },

  // Processor-specific routes
  {
    path: '/processor/operations',
    requiredRoles: ['processor'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Processing operations'
  },
  {
    path: '/processor/outputs',
    requiredRoles: ['processor'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Manage processed outputs'
  },

  // Buyer-specific routes
  {
    path: '/buyer/orders',
    requiredRoles: ['buyer'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Manage orders'
  },
  {
    path: '/buyer/suppliers',
    requiredRoles: ['buyer'],
    requireVerified: true,
    requireOnboarded: true,
    description: 'Supplier relationships'
  },

  // Onboarding flow
  {
    path: '/onboarding',
    description: 'User onboarding'
  },
  {
    path: '/onboarding/confirmation',
    description: 'Onboarding confirmation'
  }
]

// Helper function to get route config
export function getRouteConfig(path: string): RouteConfig | undefined {
  // First try exact match
  let config = ROUTE_ACCESS_CONFIG.find(route => route.path === path)
  
  // If no exact match, try pattern matching for dynamic routes
  if (!config) {
    config = ROUTE_ACCESS_CONFIG.find(route => {
      const pattern = route.path.replace(/\[.*?\]/g, '.*')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(path)
    })
  }
  
  return config
}

// Helper to check if a user can access a route
export function canAccessRoute(
  path: string,
  userRole?: UserRole,
  isVerified?: boolean,
  isOnboarded?: boolean
): boolean {
  const config = getRouteConfig(path)
  
  // If no config found, assume public route
  if (!config) return true
  
  // Check role requirements
  if (config.requiredRoles && config.requiredRoles.length > 0) {
    if (!userRole || !config.requiredRoles.includes(userRole)) {
      return false
    }
  }
  
  // Check verification requirement
  if (config.requireVerified && !isVerified) {
    return false
  }
  
  // Check onboarding requirement
  if (config.requireOnboarded && !isOnboarded) {
    return false
  }
  
  return true
}

// Get accessible routes for a user
export function getAccessibleRoutes(
  userRole?: UserRole,
  isVerified?: boolean,
  isOnboarded?: boolean
): RouteConfig[] {
  return ROUTE_ACCESS_CONFIG.filter(route => 
    canAccessRoute(route.path, userRole, isVerified, isOnboarded)
  )
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  supplier: 'Supplier',
  processor: 'Processor',
  buyer: 'Buyer',
  admin: 'Administrator'
}

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  supplier: 'Supply waste materials like food waste or cooking oil',
  processor: 'Process waste into valuable outputs like biodiesel or biogas',
  buyer: 'Purchase recycled materials and byproducts',
  admin: 'Platform administrator with full access'
}
