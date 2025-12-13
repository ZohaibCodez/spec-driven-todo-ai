'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after client-side hydration
  useEffect(() => {
    setMounted(true);
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
    <div className="flex items-center">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
}