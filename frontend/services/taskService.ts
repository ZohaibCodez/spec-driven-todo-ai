import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TaskFilters,
  SessionData
} from '@/types/task';
import { api } from '@/lib/api';

// Helper function to get current user ID from backend
async function getCurrentUserId(): Promise<number> {
  try {
    // Fetch the current user info from backend
    // The backend will decode the JWT token and query the database for the numeric user ID
    const user = await api.getCurrentUser();
    
    if (!user || !user.id) {
      throw new Error('User data not available');
    }
    
    return user.id;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw new Error('User not authenticated or invalid user ID');
  }
}

// Task service that manages task operations, including local caching and optimistic updates
export class TaskService {
  // Get all tasks with optional filters
  static async getTasks(filters?: TaskFilters): Promise<Task[]> {
    try {
      const userId = await getCurrentUserId();
      const response = await api.getTasks(userId, {
        status: filters?.completed === true ? 'completed' : filters?.completed === false ? 'pending' : 'all',
        sort: filters?.sort,
        order: filters?.order,
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Get a single task by ID
  static async getTask(id: string): Promise<Task | null> {
    try {
      const userId = await getCurrentUserId();
      const response = await api.getTask(userId, id);
      return response || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  // Create a new task
  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const userId = await getCurrentUserId();
      const response = await api.createTask(userId, {
        title: taskData.title,
        description: taskData.description,
      });
      return response;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Update an existing task
  static async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const userId = await getCurrentUserId();
      const response = await api.updateTask(userId, id, taskData);
      return response;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  // Toggle task completion status
  static async toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
    try {
      const userId = await getCurrentUserId();
      const response = await api.toggleTaskComplete(userId, id);
      return response;
    } catch (error) {
      console.error(`Error toggling task completion ${id}:`, error);
      throw error;
    }
  }

  // Delete a task
  static async deleteTask(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      await api.deleteTask(userId, id);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  // Helper method to validate task data before creation/update
  static validateTaskData(taskData: CreateTaskRequest | UpdateTaskRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate title if provided
    if ('title' in taskData && taskData.title !== undefined) {
      if (!taskData.title || taskData.title.trim().length === 0) {
        errors.push('Title is required');
      } else if (taskData.title.length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    // Validate description if provided
    if ('description' in taskData && taskData.description !== undefined) {
      if (taskData.description && taskData.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
      }
    }

    // Validate due date if provided
    if ('dueDate' in taskData && taskData.dueDate !== undefined && taskData.dueDate) {
      const date = new Date(taskData.dueDate);
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date');
      }
    }

    // Validate category if provided
    if ('category' in taskData && taskData.category !== undefined && taskData.category) {
      if (taskData.category.length > 50) {
        errors.push('Category must be less than 50 characters');
      }
    }

    // Validate tags if provided
    if ('tags' in taskData && taskData.tags !== undefined && taskData.tags) {
      if (taskData.tags.length > 10) {
        errors.push('Task can have at most 10 tags');
      }
      for (const tag of taskData.tags) {
        if (tag.length > 30) {
          errors.push('Each tag must be less than 30 characters');
          break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to count tasks by status
  static countTasksByStatus(tasks: Task[]): { total: number; completed: number; pending: number; overdue: number } {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => !task.completed && task.dueDate && new Date(task.dueDate) < new Date()).length;

    return {
      total: tasks.length,
      completed,
      pending,
      overdue
    };
  }

  // Export tasks as JSON
  static exportTasksAsJSON(tasks: Task[]): string {
    return JSON.stringify(tasks, null, 2);
  }

  // Export tasks as CSV
  static exportTasksAsCSV(tasks: Task[]): string {
    if (tasks.length === 0) {
      return '';
    }

    // Define headers
    const headers = ['id', 'title', 'description', 'completed', 'createdAt', 'updatedAt', 'dueDate', 'category', 'tags'];

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    tasks.forEach(task => {
      const row = [
        task.id,
        `"${task.title.replace(/"/g, '""')}"`, // Escape quotes in title
        task.description ? `"${task.description.replace(/"/g, '""')}"` : '""', // Escape quotes in description
        task.completed,
        task.createdAt,
        task.updatedAt,
        task.dueDate || '',
        task.category || '',
        task.tags ? `"${task.tags.join('|')}"` : '""', // Use pipe separator for tags since comma is used for fields
      ];

      csvContent += row.join(',') + '\n';
    });

    return csvContent;
  }

  // Export tasks in specified format
  static exportTasks(tasks: Task[], format: 'json' | 'csv'): string {
    switch (format) {
      case 'json':
        return this.exportTasksAsJSON(tasks);
      case 'csv':
        return this.exportTasksAsCSV(tasks);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Helper method to filter tasks by various criteria
  static filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter(task => {
      // Filter by completion status
      if (filters.completed !== undefined) {
        if (task.completed !== filters.completed) return false;
      }

      // Filter by category
      if (filters.category && task.category !== filters.category) return false;

      // Filter by tag
      if (filters.tag && task.tags && !task.tags.includes(filters.tag)) return false;

      // Filter by search term (searches in title, description, category, and tags)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchTerm);
        const matchesDescription = task.description?.toLowerCase().includes(searchTerm) || false;
        const matchesCategory = task.category?.toLowerCase().includes(searchTerm) || false;
        const matchesTag = task.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;

        if (!matchesTitle && !matchesDescription && !matchesCategory && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }

  // Helper method to sort tasks
  static sortTasks(tasks: Task[], sortField: TaskFilters['sort'] = 'createdAt', order: TaskFilters['order'] = 'asc'): Task[] {
    return [...tasks].sort((a, b) => {
      let valueA: any = a[sortField as keyof Task];
      let valueB: any = b[sortField as keyof Task];

      // Handle date fields
      if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'dueDate') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }

      // Handle string fields
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (order === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }
}