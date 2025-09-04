'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserRole } from '@prisma/client';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push('/dashboard');
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithProvider = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await signIn(provider);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!session?.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(session.user.role);
  };

  const canAccess = (permission: string) => {
    if (!session?.user) return false;
    
    // Admin can access everything
    if (session.user.role === 'ADMIN') return true;
    
    // Check role-based permissions
    const permissions: Record<string, string[]> = {
      SUPPLIER: ['createBatch', 'viewOwnBatches', 'viewCollectors'],
      PROCESSOR: ['viewAllBatches', 'processBatches', 'createSecondaryProducts'],
      BUYER: ['viewProducts', 'purchaseProducts', 'viewCarbonCredits'],
      COLLECTOR: ['viewAssignedBatches', 'updateCollectionStatus', 'viewRoutes'],
    };

    const userPermissions = permissions[session.user.role] || [];
    return userPermissions.includes(permission);
  };

  return {
    user: session?.user,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: status === 'authenticated',
    login,
    logout,
    loginWithProvider,
    hasRole,
    canAccess,
    update,
  };
}

// WebAuthn hooks
export function useWebAuthn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPasskey = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Import browser module dynamically
      const { startRegistration } = await import('@simplewebauthn/browser');

      // Get registration options
      const optionsRes = await fetch('/api/auth/webauthn/register-options');
      if (!optionsRes.ok) throw new Error('Failed to get options');
      
      const options = await optionsRes.json();

      // Start registration
      const attResp = await startRegistration(options);

      // Verify registration
      const verifyRes = await fetch('/api/auth/webauthn/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attResp),
      });

      if (!verifyRes.ok) throw new Error('Failed to verify');

      return await verifyRes.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithPasskey = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Import browser module dynamically
      const { startAuthentication } = await import('@simplewebauthn/browser');

      // Get authentication options
      const optionsRes = await fetch('/api/auth/webauthn/auth-options');
      if (!optionsRes.ok) throw new Error('Failed to get options');
      
      const options = await optionsRes.json();

      // Start authentication
      const attResp = await startAuthentication(options);

      // Verify authentication
      const verifyRes = await fetch('/api/auth/webauthn/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attResp),
      });

      if (!verifyRes.ok) throw new Error('Failed to verify');

      const result = await verifyRes.json();
      
      // Sign in with the verified passkey
      if (result.verified && result.userId) {
        await signIn('credentials', {
          userId: result.userId,
          passkey: true,
          redirect: false,
        });
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerPasskey,
    authenticateWithPasskey,
    isLoading,
    error,
  };
}
