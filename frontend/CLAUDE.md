# Frontend Guidelines - Next.js 16+

## Stack
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4 with custom design system
- **State**: React Hooks, Context API
- **Auth**: Better Auth with JWT
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Project Structure
```
frontend/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Landing page
│   ├── login/          # Authentication pages
│   ├── signup/
│   └── app/            # Main app (protected)
├── components/         # React components
│   ├── ui/            # Base UI components (Button, Input, Card, etc.)
│   ├── shared/        # Shared components (ThemeToggle, etc.)
│   ├── layout/        # Layout components (Navigation, Footer)
│   ├── landing/       # Landing page components
│   └── tasks/         # Task-related components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and API client
│   ├── api.ts        # API client with JWT handling
│   ├── utils.ts      # Helper functions
│   └── constants.ts  # App constants
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## Component Patterns

### Use Server Components by Default
```tsx
// app/page.tsx
export default function Page() {
  return <div>Server Component</div>
}
```

### Client Components Only When Needed
```tsx
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

### Component File Structure
```tsx
'use client'; // Only if needed

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props with JSDoc
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};
```

## API Client Pattern

All backend calls MUST use the centralized API client:

```tsx
// lib/api.ts usage
import { api } from '@/lib/api';

// In component or server function
const tasks = await api.getTasks();
const task = await api.createTask({ title, description });
```

The API client automatically:
- Adds JWT token to requests
- Handles errors
- Provides type-safe responses

## Styling Guidelines

### Use Tailwind CSS
```tsx
<div className="flex items-center justify-between p-4 rounded-lg bg-surface">
  <h2 className="text-2xl font-bold text-foreground">Title</h2>
</div>
```

### Use Design Tokens (CSS Variables)
- Colors: `bg-background`, `text-foreground`, `border-border`
- Primary/Secondary: `bg-primary`, `text-primary-foreground`
- States: `bg-success`, `bg-error`, `bg-warning`, `bg-info`
- Muted: `text-muted`

### No Inline Styles
❌ `<div style={{ color: 'red' }}>`
✅ `<div className="text-error">`

### Use `cn()` Helper for Conditional Classes
```tsx
import { cn } from '@/lib/utils';

<button className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  disabled && "opacity-50"
)}>
```

## Form Handling

### Use React Hook Form + Zod
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(200),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

## Authentication Pattern

### Protected Routes
```tsx
// app/app/layout.tsx
export default function AppLayout({ children }) {
  // Check auth, redirect if not logged in
  return <>{children}</>;
}
```

### Include JWT in API Calls
```tsx
// Automatically handled by api client
const tasks = await api.getTasks();
// API client adds: Authorization: Bearer <token>
```

## State Management

### Local State
```tsx
const [state, setState] = useState(initialValue);
```

### Context for Shared State
```tsx
// contexts/TaskContext.tsx
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
```

## Error Handling

```tsx
try {
  const result = await api.createTask(data);
  addToast('Success!', 'success');
} catch (error) {
  addToast(error.message || 'Failed', 'error');
}
```

## Performance Best Practices

1. **Use `loading` states for async operations**
2. **Debounce search inputs** (use `debounce` from `@/lib/utils`)
3. **Optimize images** with Next.js `<Image>`
4. **Lazy load heavy components** with `React.lazy()`

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast (WCAG AA)

## Code Style

- Use TypeScript for all files
- Export named components: `export const Component`
- Use arrow functions for components
- Prefer `const` over `let`
- Use optional chaining: `user?.name`
- Use template literals: `` `Hello ${name}` ``

## Import Order
```tsx
// 1. React and Next.js
import * as React from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { Zap } from 'lucide-react';

// 3. Internal components
import { Button } from '@/components/ui/Button';

// 4. Utilities and types
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
```

## Testing Checklist
- [ ] Component renders without errors
- [ ] Props are properly typed
- [ ] Loading states work
- [ ] Error states work
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark/light theme both work
- [ ] Keyboard navigation works
- [ ] No console errors/warnings
