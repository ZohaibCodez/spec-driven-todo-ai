'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * SessionChecker Component
 * This component ensures the session is refreshed when navigating to protected routes
 * Particularly useful after OAuth redirects
 */
export function SessionChecker() {
  const { refreshSession, loading } = useAuth();

  useEffect(() => {
    // Refresh session on mount to catch OAuth callbacks
    if (!loading) {
      refreshSession();
    }
  }, []);

  return null; // This component doesn't render anything
}
