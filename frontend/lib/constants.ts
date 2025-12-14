/**
 * Application Constants
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

export const TOAST_DURATION = 5000; // 5 seconds

export const MAX_CONTENT_WIDTH = '1280px';

export const TOUCH_TARGET_MIN_SIZE = 44; // px

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
