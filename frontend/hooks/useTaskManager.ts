import { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '@/types/task';
import { TaskService } from '@/services/taskService';
import { useAnonymousSession } from './useLocalStorage';

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useAnonymousSession();
  const [recentlyDeleted, setRecentlyDeleted] = useState<{task: Task, timeoutId: NodeJS.Timeout} | null>(null);

  // Load tasks from the API
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await TaskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      // Check if it's a network error and provide a friendlier message
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      if (errorMessage.includes('Network error')) {
        console.warn('API unavailable, continuing with empty task list:', errorMessage);
        setTasks([]); // Set empty array instead of showing error for network issues
      } else {
        setError(errorMessage);
      }
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize tasks when the hook is first used
  useEffect(() => {
    loadTasks();
  }, []);

  // Create a new task
  const createTask = async (taskData: CreateTaskRequest) => {
    try {
      // Optimistic update: add the task to the UI immediately
      const newTask: Task = {
        id: `temp-${Date.now()}`, // Temporary ID until API returns the real one
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags || [],
      };

      setTasks(prev => [newTask, ...prev]);

      // Then save to the API
      const createdTask = await TaskService.createTask(taskData);

      // Update with the real task from the API
      setTasks(prev =>
        prev.map(t =>
          t.id === newTask.id ? createdTask : t
        )
      );

      return createdTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      // If API fails, remove the optimistic update
      setTasks(prev => prev.filter(t => t.id !== `temp-${Date.now()}`));
      throw err;
    }
  };

  // Update an existing task
  const updateTask = async (id: string, taskData: UpdateTaskRequest) => {
    try {
      // Optimistic update: update the task in the UI immediately
      setTasks(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
            : t
        )
      );

      // Then save to the API
      const updatedTask = await TaskService.updateTask(id, taskData);

      // Update with the real task from the API
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? updatedTask : t
        )
      );

      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      // If API fails, reload tasks to revert the optimistic update
      loadTasks();
      throw err;
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id: string) => {
    try {
      // Find the current task to get its completion status
      const currentTask = tasks.find(t => t.id === id);
      if (!currentTask) return null;

      const newCompletedStatus = !currentTask.completed;

      // Optimistic update: toggle the completion status in the UI immediately
      setTasks(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, completed: newCompletedStatus, updatedAt: new Date().toISOString() }
            : t
        )
      );

      // Then save to the API
      const updatedTask = await TaskService.toggleTaskCompletion(id, newCompletedStatus);

      // Update with the real task from the API
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? updatedTask : t
        )
      );

      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task completion');
      // If API fails, reload tasks to revert the optimistic update
      loadTasks();
      throw err;
    }
  };

  // Delete a task with undo functionality
  const deleteTask = async (id: string) => {
    // Find the task to be deleted for potential undo
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) {
      throw new Error('Task not found');
    }

    // Cancel any existing timeout for a recently deleted task
    if (recentlyDeleted) {
      clearTimeout(recentlyDeleted.timeoutId);
    }

    // Optimistic update: remove the task from the UI immediately
    setTasks(prev => prev.filter(t => t.id !== id));

    // Set up a timeout to permanently delete the task after 5 seconds
    const timeoutId = setTimeout(async () => {
      try {
        const success = await TaskService.deleteTask(id);
        if (!success) {
          setError('Failed to delete task from server');
          loadTasks(); // Reload to sync with server state
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
        loadTasks(); // Reload to sync with server state
      } finally {
        setRecentlyDeleted(null);
      }
    }, 5000); // 5 seconds to undo

    // Store the recently deleted task and its timeout
    setRecentlyDeleted({ task: taskToDelete, timeoutId });

    return true;
  };

  // Undo the last task deletion
  const undoDeleteTask = () => {
    if (recentlyDeleted) {
      // Clear the timeout
      clearTimeout(recentlyDeleted.timeoutId);

      // Add the task back to the list
      setTasks(prev => [recentlyDeleted.task, ...prev]);

      // Clear the recently deleted state
      setRecentlyDeleted(null);
    }
  };

  // Filter tasks based on criteria
  const filterTasks = (filters: TaskFilters) => {
    return TaskService.filterTasks(tasks, filters);
  };

  // Sort tasks
  const sortTasks = (sortField: TaskFilters['sort'] = 'createdAt', order: TaskFilters['order'] = 'asc') => {
    return TaskService.sortTasks(tasks, sortField, order);
  };

  // Sort a specific array of tasks
  const sortTaskArray = (taskArray: Task[], sortField: TaskFilters['sort'] = 'createdAt', order: TaskFilters['order'] = 'asc') => {
    return TaskService.sortTasks(taskArray, sortField, order);
  };

  // Get task statistics
  const getTaskStats = () => {
    return TaskService.countTasksByStatus(tasks);
  };

  // Export tasks in specified format
  const exportTasks = (format: 'json' | 'csv') => {
    return TaskService.exportTasks(tasks, format);
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    undoDeleteTask,
    recentlyDeletedTask: recentlyDeleted?.task || null,
    hasUndo: !!recentlyDeleted,
    filterTasks,
    sortTasks,
    sortTaskArray,
    getTaskStats,
    exportTasks,
    sessionId
  };
}