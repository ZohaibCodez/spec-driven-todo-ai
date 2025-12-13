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

## Key Features

### Task Management
- Create tasks with title, description, due date, category, and tags
- Mark tasks as complete/incomplete with visual indicators
- Edit existing tasks
- Delete tasks with confirmation

### Organization Features
- Filter tasks by completion status, category, or tags
- Sort tasks by title, creation date, or due date
- Group tasks by category

### UI Features
- Dark/light mode toggle with WCAG-compliant contrast
- Responsive design for mobile and desktop
- Loading states during API operations
- Error handling with user-friendly messages
- Optimistic updates for immediate UI feedback

### Data Persistence
- Anonymous session-based task storage
- Tasks persist for 30 days of inactivity
- Export functionality (JSON/CSV)

## Project Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main todo page
│   ├── globals.css         # Global styles
│   └── theme-provider.tsx  # Dark/light mode context
├── components/            # Reusable UI components
│   ├── TaskList.tsx       # Task list with filtering
│   ├── TaskItem.tsx       # Individual task component
│   ├── AddTaskForm.tsx    # Task creation form
│   └── ...                # Other UI components
├── lib/                   # Utilities and API client
│   ├── api.ts             # API communication layer
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript definitions
│   └── task.ts            # Task interfaces
├── hooks/                 # Custom React hooks
│   ├── useTaskManager.ts  # Task state management
│   └── useLocalStorage.ts # Session persistence
└── services/              # Business logic
    └── taskService.ts     # Task operations
```

## API Integration
The frontend communicates with the backend through the REST API defined in the contract. All requests include a session ID in the header for task isolation between anonymous users.

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npm run test         # Run tests
```