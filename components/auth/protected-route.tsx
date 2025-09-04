'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@prisma/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permission?: string;
  fallback?: string;
}

export function ProtectedRoute({
  children,
  roles,
  permission,
  fallback = '/auth/signin',
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasRole, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!isAuthenticated) {
        router.push(fallback);
        return;
      }

      // Role check
      if (roles && !hasRole(roles)) {
        router.push('/unauthorized');
        return;
      }

      // Permission check
      if (permission && !canAccess(permission)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, roles, permission, hasRole, canAccess, router, fallback]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (roles && !hasRole(roles)) || (permission && !canAccess(permission))) {
    return null;
  }

  return <>{children}</>;
}
