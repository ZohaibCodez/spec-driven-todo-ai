'use client';

import * as React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskListSkeleton } from './TaskSkeleton';
import { EmptyState } from './EmptyState';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { cn } from '@/lib/utils';

export interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error = null,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onRetry,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <TaskListSkeleton count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage 
          message={error} 
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={className}>
        <EmptyState onAddTask={onAddTask} />
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)} id="main-content">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskCard
            task={task}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        </div>
      ))}
    </div>
  );
};
