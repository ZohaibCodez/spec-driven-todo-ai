'use client';

import * as React from 'react';
import { CheckCircle2, Clock, ListChecks, TrendingUp } from 'lucide-react';
import { Task } from '@/types/task';

export interface TaskStatsProps {
  tasks: Task[];
}

const CounterAnimation: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (value === count) return;
    
    const duration = 500;
    const steps = 20;
    const stepValue = (value - count) / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(prev => Math.round(prev + stepValue));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, count]);

  return <span>{count}</span>;
};

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListChecks,
      gradient: 'from-blue-500 to-cyan-500',
      lightGradient: 'from-blue-400 to-cyan-400',
      bgGradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-500',
      lightGradient: 'from-emerald-400 to-teal-400',
      bgGradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-500',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      lightGradient: 'from-amber-400 to-orange-400',
      bgGradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
      iconBg: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          {/* Content */}
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} dark:${stat.lightGradient} bg-clip-text text-transparent`}>
                  <CounterAnimation value={stat.value} />
                </p>
              </div>
              <div className={`${stat.iconBg} rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Progress Indicator */}
            {stat.title === 'Completed' && totalTasks > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completionRate}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
