import { memo } from 'react';
import { Task } from '@/types/task';
import { TaskService } from '@/services/taskService';
import { cn } from '@/lib/utils';

interface TaskStatsProps {
  tasks: Task[];
  className?: string;
}

export function TaskStats({ tasks, className }: TaskStatsProps) {
  const { total, completed, pending, overdue } = TaskService.countTasksByStatus(tasks);

  const stats = [
    { label: 'Total', value: total, color: 'bg-blue-500' },
    { label: 'Completed', value: completed, color: 'bg-green-500' },
    { label: 'Pending', value: pending, color: 'bg-yellow-500' },
    { label: 'Overdue', value: overdue, color: 'bg-red-500' },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4 mb-6', className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${stat.color} mr-2`}></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default memo(TaskStats);