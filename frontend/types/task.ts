// Task entity based on the data model specification
export interface Task {
  id: string;                    // Unique identifier for the task (UUID or similar)
  title: string;                 // Task title (required, max 200 characters)
  description?: string;          // Task description (optional, max 1000 characters)
  completed: boolean;            // Completion status (default: false)
  createdAt: string;             // Creation timestamp in ISO string format
  updatedAt: string;             // Last update timestamp in ISO string format
  dueDate?: string | null;       // Optional due date for the task in ISO string format
  category?: string | null;      // Category for organization (optional)
  tags: string[];                // Array of tags for flexible filtering (default: [])
}

// Task creation request interface
export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;              // Optional due date in ISO string format
  category?: string;             // Optional category
  tags?: string[];               // Optional tags array
}

// Task update request interface
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  category?: string;
  tags?: string[];
  completed?: boolean;
}

// Task response interface from API
export interface TaskResponse {
  success: boolean;
  data: Task | Task[] | { id: string; deleted: boolean } | { format: string; content: any };
  timestamp: string;
}

// Task API error response interface
export interface TaskErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Session management interface
export interface SessionData {
  sessionId: string;             // Unique identifier for the anonymous session
  tasks: Task[];                 // Array of tasks associated with this session
  createdAt: string;             // Session creation timestamp
  lastAccessed: string;          // Last access timestamp (for cleanup)
}

// Filter and sort parameters interface
export interface TaskFilters {
  completed?: boolean;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'title' | 'createdAt' | 'updatedAt' | 'dueDate';
  order?: 'asc' | 'desc';
}

// Category entity interface
export interface Category {
  name: string;                  // Category name (unique per user session)
  createdAt: string;             // Creation timestamp
}

// Tag entity interface
export interface Tag {
  name: string;                  // Tag name (used across tasks)
  usageCount: number;            // Number of tasks using this tag (for suggestions)
}