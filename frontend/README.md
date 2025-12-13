# Frontend Foundation - Todo UI

This is the frontend application for the Todo UI, built with Next.js 16, TypeScript, and Tailwind CSS. A comprehensive task management application with advanced features for organizing and tracking tasks.

## Table of Contents

- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [UI/UX Features](#uiux-features)
- [Accessibility](#accessibility)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Features

- **Task Management**: Create, read, update, and delete tasks with optimistic updates
- **Advanced Organization**: Categorize tasks, add tags, set due dates
- **Filtering & Sorting**: Filter by status, category, tags, or search across all fields; sort by title, date, etc.
- **Dark/Light Mode**: Automatic theme switching with user preference
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Data Export**: Export tasks in JSON or CSV formats
- **Anonymous Sessions**: Tasks are stored in the browser with automatic cleanup after 30 days
- **Accessibility**: Full keyboard navigation and screen reader support
- **Offline Capability**: Service worker for basic offline functionality

## Setup and Installation

1. Ensure you have Node.js 18+ installed
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the required environment variables (see [Environment Variables](#environment-variables))
4. Make sure the backend API is running on http://localhost:8000/api
5. Start the development server (see [Development](#development))

## Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Development Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Building for Production

To build the application for production:

```bash
npm run build
```

This command creates an optimized production build in the `.next/` directory.

To run the production server after building:

```bash
npm start
```

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the backend API (e.g., `http://localhost:8000/api`)
- `NEXT_PUBLIC_DEFAULT_SESSION_DAYS` - Number of days before anonymous session cleanup (default: 30)

Create a `.env.local` file in the root of the frontend directory with these values:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_SESSION_DAYS=30
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages and layouts
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading component
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main application page
├── components/            # Reusable UI components
│   ├── AddTaskForm.tsx    # Form for adding new tasks
│   ├── ExportButton.tsx   # Component for exporting tasks
│   ├── TaskFilters.tsx    # Component for filtering tasks
│   ├── TaskItem.tsx       # Individual task display component
│   ├── TaskList.tsx       # List of tasks with loading states
│   ├── TaskStats.tsx      # Task statistics display
│   └── ThemeToggle.tsx    # Dark/light mode toggle
├── hooks/                 # Custom React hooks
│   └── useTaskManager.ts  # Centralized task state management
│   └── useLocalStorage.ts # Local storage utilities
├── lib/                   # Utility functions and API clients
│   └── api.ts            # API client with session management
│   └── utils.ts          # Utility functions (formatting, validation, etc.)
├── services/              # Business logic and API service layers
│   └── taskService.ts    # Task business logic and data processing
├── types/                 # TypeScript type definitions
│   └── task.ts           # Task-related type definitions
├── public/                # Static assets
│   └── sw.js             # Service worker for offline capability
└── package.json           # Dependencies and scripts
```

## API Integration

The application communicates with the backend API at the configured `NEXT_PUBLIC_API_BASE_URL`. All API calls include:

- Session ID in request headers for anonymous task persistence
- Proper error handling with user-friendly messages
- Optimistic updates for immediate UI feedback
- Automatic retry mechanisms for failed requests

Supported API endpoints:
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete a task

## Component Architecture

The application follows a modular component architecture:

- **Container Components**: Handle data fetching and state management (e.g., page.tsx)
- **Presentational Components**: Focus on UI rendering and user interactions (e.g., TaskItem.tsx)
- **Control Components**: Handle form inputs and user controls (e.g., AddTaskForm.tsx)
- **Layout Components**: Structure the UI (e.g., TaskList.tsx)

All components are optimized with React.memo to prevent unnecessary re-renders.

## State Management

State is managed through:

1. **Global State**: useTaskManager hook provides centralized task management
2. **Local State**: Individual components manage their own UI state (e.g., editing state in TaskItem)
3. **Persistent State**: Tasks are stored in the browser using localStorage with session management
4. **Theme State**: Managed by next-themes for dark/light mode

## UI/UX Features

### Task Management
- **Create**: Add tasks with title, description, due date, category, and tags
- **Read**: View tasks in a clean, organized list with filtering and sorting
- **Update**: Inline editing of task details with cancel functionality
- **Delete**: Confirmation dialog with undo option

### Organization
- **Categories**: Organize tasks into named categories with suggestions
- **Tags**: Add multiple tags to tasks with autocomplete functionality
- **Due Dates**: Visual indicators for due and overdue tasks
- **Status**: Clear visual distinction between completed and pending tasks

### Navigation
- **Keyboard Support**: Full keyboard navigation throughout the app
- **Responsive Design**: Adapts to all screen sizes
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages and recovery options

## Accessibility

The application follows WCAG 2.1 AA guidelines:

- **Semantic HTML**: Proper use of headings, lists, and landmarks
- **ARIA Labels**: Clear labels for all interactive elements
- **Keyboard Navigation**: Full functionality via keyboard
- **Screen Reader Support**: Proper announcements and navigation
- **Color Contrast**: WCAG-compliant contrast ratios
- **Focus Management**: Clear focus indicators and proper focus order

## Performance Optimizations

- **Component Memoization**: React.memo for preventing unnecessary re-renders
- **Optimistic Updates**: Immediate UI feedback with background API calls
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component for optimized images
- **Bundle Optimization**: Tree-shaking and dead code elimination

## Testing

The application includes:

- **Unit Tests**: Component-level tests for individual functionality
- **Integration Tests**: Tests for API integration and data flow
- **End-to-End Tests**: Complete user workflow testing
- **Accessibility Tests**: Automated WCAG compliance checking

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure the backend server is running on the configured API URL
2. **Session Loss**: Sessions are automatically cleaned up after 30 days of inactivity
3. **Performance Issues**: Large datasets (>10,000 tasks) will show warnings before export
4. **Theme Not Persisting**: Check browser settings for theme preference conflicts

### Development Issues

- If components don't update after changes, try clearing browser cache
- For API issues, check the browser's Network tab for detailed error messages
- If build fails, verify all environment variables are properly set

### Contact Support

For additional help, contact the development team or refer to the project documentation.
