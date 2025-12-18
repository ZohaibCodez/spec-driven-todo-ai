'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn as signInClient, signUp as signUpClient } from '@/lib/auth-client';

interface User {
  id: number;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token in localStorage on initial load
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      // Verify the session and get user data
      const checkSession = async () => {
        const sessionData = await getSession();
        if (sessionData.data) {
          // Convert Better Auth user format to our expected format
          const betterAuthUser = sessionData.data.user;
          const betterAuthSession = sessionData.data.session;

          // Map Better Auth user to our User interface
          const mappedUser: User = {
            id: betterAuthUser.id as number,
            email: betterAuthUser.email,
            name: betterAuthUser.name || null,
            created_at: betterAuthUser.createdAt || new Date().toISOString(),
            updated_at: betterAuthUser.updatedAt || new Date().toISOString(),
            email_verified: betterAuthUser.emailVerified || false,
            is_active: true, // Better Auth doesn't have this field, assume active
          };

          setUser(mappedUser);
          setToken(betterAuthSession.token);
        }
      };
      checkSession();
    }
    setLoading(false);
  }, []);

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

        // Map Better Auth user to our User interface
        const mappedUser: User = {
          id: betterAuthUser.id as number,
          email: betterAuthUser.email,
          name: betterAuthUser.name || null,
          created_at: betterAuthUser.createdAt || new Date().toISOString(),
          updated_at: betterAuthUser.updatedAt || new Date().toISOString(),
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
        // Convert Better Auth user format to our expected format
        const betterAuthUser = result.data.user;
        const betterAuthSession = result.data.session;

        // Map Better Auth user to our User interface
        const mappedUser: User = {
          id: betterAuthUser.id as number,
          email: betterAuthUser.email,
          name: betterAuthUser.name || null,
          created_at: betterAuthUser.createdAt || new Date().toISOString(),
          updated_at: betterAuthUser.updatedAt || new Date().toISOString(),
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
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Use the auth client to logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/signin');
    router.refresh();
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