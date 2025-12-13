'use client';

import { useState } from 'react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { TaskList } from '@/components/TaskList';
import { TaskStats } from '@/components/TaskStats';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskFilters as TaskFiltersComponent } from '@/components/TaskFilters';
import { ExportButton } from '@/components/ExportButton';
import { Task, TaskFilters } from '@/types/task';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const {
    tasks,
    loading,
    error,
    createTask,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    undoDeleteTask,
    recentlyDeletedTask,
    hasUndo,
    filterTasks,
    sortTasks,
    sortTaskArray,
    exportTasks
  } = useTaskManager();

  const [activeFilters, setActiveFilters] = useState<TaskFilters>({});

  const handleEditTask = (task: Task) => {
    updateTask(task.id, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      category: task.category,
      tags: task.tags,
    });
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    await createTask({
      ...taskData,
      completed: false,
    });
  };

  const handleFilterChange = (filters: TaskFilters) => {
    setActiveFilters(filters);
  };

  // Apply filters and sorting to the tasks
  let displayedTasks = [...tasks];

  // Apply filters if any are active
  if (Object.keys(activeFilters).length > 0) {
    displayedTasks = filterTasks(activeFilters);
  }

  // Apply sorting if specified in filters
  if (activeFilters.sort) {
    displayedTasks = sortTaskArray(displayedTasks, activeFilters.sort, activeFilters.order);
  } else {
    // If no sort is specified but we have filtered tasks, we should sort the filtered results
    // (using default sort if no filter is active, otherwise keep filtered order)
    if (Object.keys(activeFilters).length > 0) {
      displayedTasks = sortTaskArray(displayedTasks, 'createdAt', 'desc');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Todo App</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <TaskFiltersComponent onFilterChange={handleFilterChange} />
            <ExportButton tasks={displayedTasks} onExport={exportTasks} />
          </div>
          <AddTaskForm
            onTaskCreate={handleCreateTask}
            categories={Array.from(new Set(tasks.map(t => t.category).filter(Boolean) as string[]))}
            tags={Array.from(new Set(tasks.flatMap(t => t.tags || [])))}
          />
          {hasUndo && recentlyDeletedTask && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200 flex items-center justify-between">
              <span>Task "{recentlyDeletedTask.title}" deleted. </span>
              <button
                onClick={undoDeleteTask}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Undo
              </button>
            </div>
          )}
          <TaskStats tasks={displayedTasks} />
          <TaskList
            tasks={displayedTasks}
            loading={loading}
            error={error}
            onToggleCompletion={toggleTaskCompletion}
            onEdit={handleEditTask}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}
