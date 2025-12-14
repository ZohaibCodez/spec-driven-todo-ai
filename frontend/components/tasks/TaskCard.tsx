'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';
import { Task } from '@/types/task';

export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Status Indicator Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.completed ? 'bg-gradient-to-b from-emerald-500 to-teal-500' : 'bg-gradient-to-b from-amber-500 to-orange-500'}`} />
      
      <div className="flex items-start gap-4 p-5">
        {/* Checkbox */}
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-bold mb-1 ${
              task.completed 
                ? 'line-through text-gray-400 dark:text-gray-600' 
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {task.createdAt && (
              <span className="flex items-center text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(task.createdAt)}
              </span>
            )}
            
            {task.category && (
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                {task.category}
              </span>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-gray-500" />
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium">
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-gray-500">+{task.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
          task.completed 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
        }`}>
          {task.completed ? '✓ Completed' : '◷ Pending'}
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-1 transition-all duration-200 ${
            showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 md:opacity-0'
          }`}
        >
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
