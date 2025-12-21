import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Better Auth endpoints are on the frontend server
  plugins: [
    jwtClient()
  ]
});

// Maintain the same interface as before for compatibility
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (response.error) {
      return { error: { message: response.error.message } };
    }

    // Better Auth returns { token, user } directly
    const token = response.data?.token;
    const user = response.data?.user;

    // Store token in localStorage (to maintain compatibility)
    if (typeof window !== 'undefined' && token && user) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Return in expected format with session object
    return { 
      data: {
        session: { token: token || '' },
        user: user
      }
    };
  } catch (error) {
    return { error: { message: 'Network error during signup' } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await authClient.signIn.email({
      email,
      password,
    });

    if (response.error) {
      return { error: { message: response.error.message } };
    }

    // Better Auth returns { token, user } directly
    const token = response.data?.token;
    const user = response.data?.user;

    // Store token in localStorage (to maintain compatibility)
    if (typeof window !== 'undefined' && token && user) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Return in expected format with session object
    return { 
      data: {
        session: { token: token || '' },
        user: user
      }
    };
  } catch (error) {
    return { error: { message: 'Network error during login' } };
  }
};

export const signOut = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
  return { data: null };
};

export const getSession = async () => {
  if (typeof window === 'undefined') {
    return { data: null };
  }

  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return { data: null };
  }

  try {
    const user = JSON.parse(userStr);
    return {
      data: {
        session: { token },
        user,
      },
    };
  } catch {
    return { data: null };
  }
};