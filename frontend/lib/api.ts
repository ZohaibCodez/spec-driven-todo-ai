import { Task, CreateTaskRequest, UpdateTaskRequest, TaskResponse, TaskErrorResponse, TaskFilters } from '@/types/task';

// Base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Function to get or create session ID
function getSessionId(): string {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('todo-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      localStorage.setItem('todo-session-id', sessionId);
    }
    return sessionId;
  }
  // For server-side rendering, return a placeholder
  return 'server-side-session';
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const sessionId = getSessionId();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData: TaskErrorResponse = await response.json();
      throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    // If it's a network error (fetch failed), provide a more descriptive error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the API server at ${API_BASE_URL}. Please make sure the backend server is running.`);
    }
    throw error;
  }
}

// Task API functions
export const taskApi = {
  // Get all tasks with optional filters
  getTasks: async (filters?: TaskFilters): Promise<TaskResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.completed !== undefined) {
        params.append('completed', filters.completed.toString());
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.tag) {
        params.append('tag', filters.tag);
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }
      if (filters.order) {
        params.append('order', filters.order);
      }
    }

    const queryString = params.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

    return apiRequest<TaskResponse>(endpoint);
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`);
  },

  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update an existing task
  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Toggle task completion status
  toggleTaskCompletion: async (id: string, completed: boolean): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },

  // Delete a task
  deleteTask: async (id: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Export tasks in JSON or CSV format
  exportTasks: async (format: 'json' | 'csv' = 'json'): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/export?format=${format}`);
  },
};

// Session management functions
export const sessionApi = {
  // Get current session ID
  getSessionId,

  // Clear session data
  clearSession: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('todo-session-id');
    }
  },
};