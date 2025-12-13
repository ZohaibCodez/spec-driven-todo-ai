'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-12 w-12 text-red-500" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Something went wrong!</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We encountered an error while loading this page.
        </p>
        {error.message && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-left">Error details</summary>
            <pre className="mt-2 p-3 text-xs bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-left">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={() => reset()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}