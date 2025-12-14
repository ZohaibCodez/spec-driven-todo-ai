'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          'relative p-2.5 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800',
          className
        )}
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group',
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-white animate-spin-slow" />
        ) : (
          <Moon className="h-5 w-5 text-white" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
      <div className="absolute inset-0 rounded-xl bg-white/20 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
