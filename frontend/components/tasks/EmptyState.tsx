import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  onAddTask?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-8 shadow-2xl shadow-blue-500/30">
          <CheckCircle2 className="h-16 w-16 text-white" />
        </div>
      </div>
      
      <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
        No tasks yet!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mb-8">
        Get started by creating your first task. Stay organized and boost your productivity.
      </p>
      
      {onAddTask && (
        <Button 
          onClick={onAddTask} 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 border-0"
        >
          Create Your First Task
        </Button>
      )}
    </div>
  );
};
