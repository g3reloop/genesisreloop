import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { rateLimiter } from '../redis/client';

// Get current session
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

// Get current user
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user;
}

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/signin');
  }
  return user;
}

// Require specific role
export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes(user.role)) {
    redirect('/unauthorized');
  }
  
  return user;
}

// Check if user has role
export function hasRole(user: { role: UserRole }, role: UserRole | UserRole[]) {
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}

// Require admin
export async function requireAdmin() {
  return await requireRole('ADMIN');
}

// Role-based permissions
export const permissions = {
  // Supplier permissions
  supplier: {
    canCreateBatch: true,
    canViewOwnBatches: true,
    canUpdateOwnBatches: true,
    canViewCollectors: true,
    canViewProcessors: true,
    canViewOwnAnalytics: true,
  },
  
  // Processor permissions
  processor: {
    canViewAllBatches: true,
    canProcessBatches: true,
    canCreateSecondaryProducts: true,
    canViewSuppliers: true,
    canManageCompliance: true,
  },
  
  // Buyer permissions
  buyer: {
    canViewSecondaryProducts: true,
    canPurchaseProducts: true,
    canViewCarbonCredits: true,
    canPurchaseCredits: true,
    canViewProcessors: true,
  },
  
  // Collector permissions
  collector: {
    canViewAssignedBatches: true,
    canUpdateCollectionStatus: true,
    canViewRoutes: true,
    canUpdateLocation: true,
    canViewSuppliers: true,
  },
  
  // Admin permissions (all permissions)
  admin: {
    canManageUsers: true,
    canManageAllData: true,
    canViewAnalytics: true,
    canManageAgents: true,
    canManageCompliance: true,
    canManageFinance: true,
  },
};

// Get permissions for user
export function getUserPermissions(role: UserRole) {
  const rolePermissions = permissions[role.toLowerCase() as keyof typeof permissions];
  return rolePermissions || {};
}

// Check specific permission
export function canUserPerform(user: { role: UserRole }, action: string): boolean {
  const userPermissions = getUserPermissions(user.role);
  return userPermissions[action as keyof typeof userPermissions] === true;
}

// API route authentication wrapper
export function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<Response>,
  options?: {
    roles?: UserRole[];
    rateLimit?: boolean;
  }
) {
  return async (req: NextRequest, context?: any) => {
    // Get session from request
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Check role requirements
    if (options?.roles && !hasRole(session.user, options.roles)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Apply rate limiting
    if (options?.rateLimit !== false) {
      const identifier = `user:${session.user.id}`;
      const result = await rateLimiter.api.limit(identifier);
      
      if (!result.success) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.reset).toISOString(),
          },
        });
      }
    }
    
    // Add user to request
    (req as any).user = session.user;
    
    return handler(req, context);
  };
}

// Generate secure token
export function generateSecureToken(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64url');
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}
