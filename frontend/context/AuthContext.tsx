'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, signIn as signInClient, signUp as signUpClient } from '@/lib/auth-client';
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to check Better Auth session
  const checkBetterAuthSession = async () => {
    try {
      // Use Better Auth client to get session
      const session = await authClient.getSession();
      
      if (session.data?.user) {
        const betterAuthUser = session.data.user;
        const betterAuthSession = session.data.session;

        // Map Better Auth user to our User interface
        const mappedUser: User = {
          id: betterAuthUser.id,
          email: betterAuthUser.email,
          name: betterAuthUser.name || null,
          created_at: betterAuthUser.createdAt ? new Date(betterAuthUser.createdAt).toISOString() : new Date().toISOString(),
          updated_at: betterAuthUser.updatedAt ? new Date(betterAuthUser.updatedAt).toISOString() : new Date().toISOString(),
          email_verified: betterAuthUser.emailVerified || false,
          is_active: true,
        };

        // Store in localStorage for backward compatibility
        if (betterAuthSession?.token) {
          localStorage.setItem('auth_token', betterAuthSession.token);
          localStorage.setItem('user', JSON.stringify(mappedUser));
          setToken(betterAuthSession.token);
        }
        
        setUser(mappedUser);
        return true;
      } else {
        // No session found, clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  };

  // Check session on mount and when pathname changes
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      await checkBetterAuthSession();
      setLoading(false);
    };

    initializeAuth();
  }, [pathname]); // Re-check when pathname changes (after OAuth redirect)

  const refreshSession = async () => {
    await checkBetterAuthSession();
  };

  const signin = async (email: string, password: string) => {
    try {
      const result = await signInClient(email, password);

      if (result.error) {
        throw new Error(result.error.message || 'Signin failed');
      }

      if (result.data) {
        // Convert Better Auth user format to our expected format
        const betterAuthUser = result.data.user;
        const betterAuthSession = result.data.session;

        // Check if session exists before accessing token
        if (!betterAuthSession) {
          throw new Error('Authentication session not found');
        }

        // Map Better Auth user to our User interface
        const mappedUser: User = {
          id: betterAuthUser.id,
          email: betterAuthUser.email,
          name: betterAuthUser.name || null,
          created_at: betterAuthUser.createdAt ? new Date(betterAuthUser.createdAt).toISOString() : new Date().toISOString(),
          updated_at: betterAuthUser.updatedAt ? new Date(betterAuthUser.updatedAt).toISOString() : new Date().toISOString(),
          email_verified: betterAuthUser.emailVerified || false,
          is_active: true, // Better Auth doesn't have this field, assume active
        };

        setToken(betterAuthSession.token);
        setUser(mappedUser);
      }

      // Wait for the state to update before navigating
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, confirmPassword: string) => {
    try {
      // Use name from email if no name provided (Better Auth requires a name)
      const name = email.split('@')[0];
      const result = await signUpClient(email, password, name);

      if (result.error) {
        throw new Error(result.error.message || 'Signup failed');
      }

      if (result.data) {
        // For email verification flow, redirect to verification page
        // Don't set user/token yet as they need to verify email first
        router.push('/verify-email');
        return;
      }

      // Wait for the state to update before navigating
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Use Better Auth client to sign out
      await authClient.signOut();
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Clear state
      setToken(null);
      setUser(null);
      
      // Redirect to login
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    signin,
    signup,
    logout,
    isAuthenticated,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
