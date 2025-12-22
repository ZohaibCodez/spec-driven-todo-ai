'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { Navigation } from '@/components/layout/Navigation';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Task } from '@/types/task';
import { getSession } from '@/lib/auth-client';

export default function TasksPage() {
  const router = useRouter();
  const {
    tasks,
    loading,
    error,
    createTask,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
  } = useTaskManager();

  const { addToast } = useToast();
  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Check authentication
  React.useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session?.data?.session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask({
        title: taskData.title || '',
        description: taskData.description,
        category: taskData.category || undefined,
        tags: taskData.tags,
        completed: false,
      });
      addToast('Task created successfully!', 'success');
      setIsAddingTask(false);
    } catch (err) {
      addToast('Failed to create task', 'error');
      throw err;
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, taskData);
      addToast('Task updated successfully!', 'success');
      setEditingTask(null);
    } catch (err) {
      addToast('Failed to update task', 'error');
      throw err;
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      addToast('Task deleted', 'success');
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await toggleTaskCompletion(id);
    } catch (err) {
      addToast('Failed to update task', 'error');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query) ||
          t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [tasks, filter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                All Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                Manage and organize your tasks
              </p>
            </div>
            <Button 
              onClick={() => setIsAddingTask(true)} 
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 border-0"
            >
              <Plus className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90 duration-300" />
              New Task
            </Button>
          </div>

          {/* Stats */}
          <TaskStats tasks={tasks} />
        </div>

        {/* Filters */}
        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          className="mb-6"
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onToggleTask={handleToggleTask}
          onEditTask={handleEditClick}
          onDeleteTask={handleDeleteTask}
          onAddTask={() => setIsAddingTask(true)}
        />

        {/* Add Task Modal */}
        {isAddingTask && (
          <AddTaskForm
            onSubmit={handleCreateTask}
            onClose={() => setIsAddingTask(false)}
          />
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <AddTaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onClose={() => setEditingTask(null)}
          />
        )}
      </main>
    </div>
  );
}
