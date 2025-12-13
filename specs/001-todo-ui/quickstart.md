# Quickstart Guide: Frontend Foundation - Todo UI

## Prerequisites
- Node.js 18+
- npm or pnpm package manager
- Access to backend API (FastAPI server running on port 8000)

## Setup Instructions

### 1. Clone and Navigate
```bash
cd frontend/
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_SESSION_DAYS=30
```

### 4. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## Complete Feature Documentation

### Task Management Features
- **Create Tasks**: Add new tasks with title, description, due date, category, and tags using the AddTaskForm component
- **Read Tasks**: View all tasks in an organized list with proper loading states and empty states
- **Update Tasks**: Edit existing tasks inline with cancel functionality to preserve original information
- **Delete Tasks**: Remove tasks with confirmation dialog and undo functionality for accidental deletions
- **Toggle Completion**: Mark tasks as complete/incomplete with visual indicators (strikethrough, color changes)

### Organization Features
- **Categories**: Assign categories to tasks with suggestions for existing categories
- **Tags**: Add multiple tags to tasks with autocomplete functionality
- **Due Dates**: Set and visualize due dates with overdue task indicators
- **Filtering**: Filter tasks by completion status (all, pending, completed), category, or tags
- **Sorting**: Sort tasks by title, creation date, due date, or completion status in ascending/descending order
- **Search**: Search across all task fields (title, description, category, tags)

### UI/UX Features
- **Dark/Light Mode**: Toggle between dark and light themes with system preference detection
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Loading States**: Skeleton screens during API calls and loading indicators
- **Error Handling**: User-friendly error messages with clear action messaging
- **Optimistic Updates**: Immediate UI feedback with background API synchronization
- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Accessibility**: WCAG 2.1 AA compliant with ARIA labels and semantic HTML

### Data Management Features
- **Anonymous Sessions**: Automatic session creation with unique session IDs stored in localStorage
- **Session Cleanup**: Automatic cleanup of sessions after 30 days of inactivity
- **Export Functionality**: Export tasks in JSON or CSV formats with large dataset warnings
- **Data Persistence**: Tasks persist in browser storage tied to session ID

### Advanced Features
- **Inline Editing**: Edit task details directly in the task list without modal overlays
- **Undo Functionality**: Undo capability for task deletions within a timeout period
- **Task Statistics**: Real-time statistics showing total, completed, pending, and overdue tasks
- **Performance Optimizations**: React.memo for component optimization and efficient rendering

## Project Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading component
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main todo page with all functionality
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── AddTaskForm.tsx    # Task creation form with validation
│   ├── ExportButton.tsx   # Export functionality component
│   ├── TaskFilters.tsx    # Task filtering UI
│   ├── TaskItem.tsx       # Individual task with inline editing
│   ├── TaskList.tsx       # Task list with loading/error states
│   ├── TaskStats.tsx      # Task statistics display
│   └── ThemeToggle.tsx    # Dark/light mode toggle
├── lib/                   # Utilities and API client
│   ├── api.ts             # API communication layer with session management
│   └── utils.ts           # Helper functions (formatting, validation, etc.)
├── types/                 # TypeScript definitions
│   └── task.ts            # Task interfaces and type definitions
├── hooks/                 # Custom React hooks
│   ├── useTaskManager.ts  # Centralized task state management
│   └── useLocalStorage.ts # Session persistence utilities
├── services/              # Business logic
│   └── taskService.ts     # Task operations and data processing
└── public/                # Static assets
    └── sw.js              # Service worker for offline capability
```

## API Integration
The frontend communicates with the backend through the REST API at the configured endpoint. All requests include a session ID in the header for task isolation between anonymous users. The application implements proper error handling, request/response validation, and optimistic update patterns.

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npm run test         # Run tests
```

## Troubleshooting
- If API calls fail, verify the backend server is running on the configured URL
- For session issues, check that localStorage is enabled in the browser
- Large datasets (>10,000 tasks) will show warnings before export operations
- Clear browser cache if UI doesn't update after changes