import { NextRequest, NextResponse } from 'next/server'
import { UserRole, Permission, ROLE_PERMISSIONS } from '@/types/agents'
import jwt from 'jsonwebtoken'

interface AuthToken {
  userId: string
  role: UserRole
  iat: number
  exp: number
}

export class RBAC {
  private static instance: RBAC

  static getInstance(): RBAC {
    if (!RBAC.instance) {
      RBAC.instance = new RBAC()
    }
    return RBAC.instance
  }

  /**
   * Check if a role has permission to perform an action on a resource
   */
  hasPermission(role: UserRole, resource: string, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[role]
    if (!permissions) return false

    // Admin has wildcard access
    if (role === 'admin') return true

    return permissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource
      const actionMatch = permission.action === '*' || permission.action === action
      return resourceMatch && actionMatch
    })
  }

  /**
   * Verify JWT token and extract user information
   */
  async verifyToken(token: string): Promise<AuthToken | null> {
    try {
      const secret = process.env.JWT_SECRET || 'development-secret'
      const decoded = jwt.verify(token, secret) as AuthToken
      return decoded
    } catch (error) {
      return null
    }
  }

  /**
   * Generate a service token for agent-to-agent communication
   */
  generateServiceToken(agentName: string): string {
    const secret = process.env.JWT_SECRET || 'development-secret'
    const token = jwt.sign(
      {
        agentName,
        role: 'admin', // Service accounts have admin access
        type: 'service'
      },
      secret,
      { expiresIn: '1h' }
    )
    return token
  }

  /**
   * Middleware to check authentication and authorization
   */
  requireAuth(requiredResource: string, requiredAction: string) {
    return async (request: NextRequest) => {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authorization header missing or invalid' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const authToken = await this.verifyToken(token)

      if (!authToken) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Check permissions
      if (!this.hasPermission(authToken.role, requiredResource, requiredAction)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      // Add user info to request for downstream use
      (request as any).user = authToken

      return null // Continue to route handler
    }
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || []
  }

  /**
   * Check if a role can access a specific route
   */
  canAccessRoute(role: UserRole, route: string): boolean {
    const routePermissions: Record<string, { resource: string; action: string }> = {
      '/agents': { resource: 'agents', action: 'read' },
      '/ops/matching': { resource: 'matches', action: 'read' },
      '/collect': { resource: 'jobs', action: 'read' },
      '/compliance': { resource: 'compliance', action: 'read' },
      '/carbon': { resource: 'ledger', action: 'read' },
      '/reputation': { resource: 'reputation', action: 'read' },
      '/rfq': { resource: 'rfq', action: 'create' },
      '/marketplace': { resource: 'listings', action: 'read' },
      '/dao': { resource: 'dao', action: 'read' },
      '/treasury': { resource: 'treasury', action: 'read' },
    }

    // Admin can access all routes
    if (role === 'admin') return true

    const permission = routePermissions[route]
    if (!permission) return true // Allow access to public routes

    return this.hasPermission(role, permission.resource, permission.action)
  }

  /**
   * Filter data based on user role
   */
  filterDataByRole<T extends { entityId?: string; supplierId?: string }>(
    role: UserRole,
    userId: string,
    data: T[]
  ): T[] {
    switch (role) {
      case 'supplier':
        // Suppliers can only see their own data
        return data.filter(item => 
          item.supplierId === userId || item.entityId === userId
        )
      
      case 'collector':
        // Collectors see assigned jobs
        return data // In production, filter by assigned routes
      
      case 'processor':
        // Processors see relevant RFQs and batches
        return data // In production, filter by processor capacity/type
      
      case 'buyer':
        // Buyers see available inventory
        return data.filter(item => 
          // In production, filter by buyer requirements
          true
        )
      
      case 'verifier':
      case 'admin':
        // Full access
        return data
      
      default:
        return []
    }
  }
}

/**
 * Middleware factory for route protection
 */
export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  resource: string,
  action: string
) {
  return async (req: NextRequest) => {
    const rbac = RBAC.getInstance()
    const authError = await rbac.requireAuth(resource, action)(req)
    
    if (authError) {
      return authError
    }

    return handler(req)
  }
}

/**
 * Hook for checking permissions in components
 */
export function usePermissions(userRole: UserRole) {
  const rbac = RBAC.getInstance()

  return {
    can: (resource: string, action: string) => 
      rbac.hasPermission(userRole, resource, action),
    canAccessRoute: (route: string) => 
      rbac.canAccessRoute(userRole, route),
    permissions: rbac.getRolePermissions(userRole)
  }
}
