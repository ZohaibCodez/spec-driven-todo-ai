import { useState, useEffect } from 'react';

// Generic hook for managing data in localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Specific hook for managing session data
export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get value from sessionStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update sessionStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook specifically for managing anonymous session ID
export function useAnonymousSession() {
  const [sessionId, setSessionId] = useLocalStorage<string>('todo-session-id', '');
  const [sessionCreated, setSessionCreated] = useLocalStorage<string>('todo-session-created', '');
  const [lastAccessed, setLastAccessed] = useLocalStorage<string>('todo-session-last-accessed', '');

  // Generate a new session ID if one doesn't exist
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const now = new Date().toISOString();

      setSessionId(newSessionId);
      setSessionCreated(now);
      setLastAccessed(now);
    } else {
      // Update last accessed time
      setLastAccessed(new Date().toISOString());
    }
  }, [sessionId]); // Only depend on sessionId to avoid infinite loop

  // Check for session cleanup (30 days of inactivity)
  useEffect(() => {
    if (lastAccessed) {
      const lastAccessTime = new Date(lastAccessed).getTime();
      const currentTime = new Date().getTime();
      const daysSinceLastAccess = (currentTime - lastAccessTime) / (1000 * 60 * 60 * 24);

      // If 30+ days have passed since last access, reset the session
      if (daysSinceLastAccess >= 30) {
        // Clear session data
        setSessionId('');
        setSessionCreated('');
        setLastAccessed('');
      }
    }
  }, [lastAccessed, setSessionId, setSessionCreated, setLastAccessed]);

  return [sessionId, setSessionId] as const;
}