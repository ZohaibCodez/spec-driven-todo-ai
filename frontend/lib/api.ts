import { getSession } from './auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

async function fetchWithAuth(endpoint: string, options: RequestOptions = {}) {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add JWT token if authentication is required
  if (requireAuth) {
    const session = await getSession();
    if (session?.data?.session) {
      const token = session.data.session.token;
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(fetchOptions.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Task endpoints
  async getTasks(userId: number, filters?: { status?: string; sort?: string; order?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth(`/api/${userId}/tasks${query}`);
  },

  async getTask(userId: number, taskId: string) {
    return fetchWithAuth(`/api/${userId}/tasks/${taskId}`);
  },

  async createTask(userId: number, data: { title: string; description?: string }) {
    return fetchWithAuth(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTask(userId: number, taskId: string, data: Partial<{ title: string; description?: string; completed: boolean }>) {
    return fetchWithAuth(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTask(userId: number, taskId: string) {
    return fetchWithAuth(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  async toggleTaskComplete(userId: number, taskId: string) {
    return fetchWithAuth(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  },

  // User endpoints
  async getCurrentUser() {
    return fetchWithAuth('/api/users/me');
  },
};
