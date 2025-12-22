'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after client-side hydration
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <div className="flex items-center">
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
          disabled
        >
          <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
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
}