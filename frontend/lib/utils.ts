import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names using clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to a readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date to a time string
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format date to a date-time string
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}

// Check if a date is in the past
export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

// Check if a date is overdue (in the past and not completed)
export function isOverdue(dueDate?: string | null): boolean {
  if (!dueDate) return false;
  return isPastDate(dueDate);
}

// Generate a UUID (for task IDs when needed client-side)
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments that don't support crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Debounce function to limit the rate at which a function can fire
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Capitalize the first letter of a string
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get initials from a name (for avatars)
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Truncate a string to a specified length
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
}

// Normalize a string (trim and lowercase) - useful for tags and categories
export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

// Validate title length (max 200 characters as per data model)
export function isValidTitle(title: string): boolean {
  return title && title.trim().length > 0 && title.length <= 200;
}

// Validate description length (max 1000 characters as per data model)
export function isValidDescription(description?: string): boolean {
  if (!description) return true; // Description is optional
  return description.length <= 1000;
}

// Validate category length (max 50 characters as per data model)
export function isValidCategory(category?: string): boolean {
  if (!category) return true; // Category is optional
  return category.length <= 50;
}

// Validate tag length (max 30 characters as per data model)
export function isValidTag(tag: string): boolean {
  return tag && tag.trim().length > 0 && tag.length <= 30;
}

// Validate tags array (max 10 tags per task as per data model)
export function isValidTags(tags: string[]): boolean {
  return tags.length <= 10 && tags.every(tag => isValidTag(tag));
}

// Check if a string is a valid date
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Calculate days between two dates
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = d2.getTime() - d1.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Format relative time (e.g., "2 days ago", "in 3 days")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (Math.abs(diffInSeconds) < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) !== 1 ? 's' : ''} ${diffInSeconds >= 0 ? 'from now' : 'ago'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? 's' : ''} ${diffInSeconds >= 0 ? 'from now' : 'ago'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''} ${diffInSeconds >= 0 ? 'from now' : 'ago'}`;
}

// Utility function to download content as a file
export function downloadFile(content: string, filename: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}