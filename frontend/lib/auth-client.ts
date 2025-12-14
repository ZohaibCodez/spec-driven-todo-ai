const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

interface Session {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        confirm_password: password, // Backend expects confirm_password
        name 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: { message: error.detail || 'Signup failed' } };
    }

    const data: AuthResponse = await response.json();
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { data: { user: data.user, session: { token: data.access_token } } };
  } catch (error) {
    return { error: { message: 'Network error during signup' } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: { message: error.detail || 'Login failed' } };
    }

    const data: AuthResponse = await response.json();
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { data: { user: data.user, session: { token: data.access_token } } };
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
