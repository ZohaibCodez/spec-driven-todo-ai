# CLI Interface Contract: Todo Application

## Command Line Interface

### Main Application Entry Point
- Module: `src.cli.main`
- Function: `main()` - Entry point for the application
- Input: None (reads from stdin)
- Output: Console output and interactive menu

## Core Interfaces

### Task Model Interface
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Task:
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
```

### Task Storage Interface
```python
from typing import Dict, List, Optional
from src.models.task import Task

class TaskStorage:
    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """Add a new task with the given title and optional description"""

    def get_task(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by its ID"""

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """Update a task's title or description by ID, returns True if successful"""

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID, returns True if successful"""

    def toggle_task_status(self, task_id: int) -> bool:
        """Toggle a task's completion status by ID, returns True if successful"""

    def list_tasks(self) -> List[Task]:
        """Return all tasks in the storage"""
```

### CLI Interface
```python
class TodoCLI:
    def __init__(self, storage: TaskStorage):
        """Initialize CLI with a task storage instance"""

    def run(self):
        """Start the main application loop"""

    def display_menu(self):
        """Display the main menu options"""

    def handle_add_task(self):
        """Handle the add task workflow"""

    def handle_view_tasks(self):
        """Handle the view tasks workflow"""

    def handle_update_task(self):
        """Handle the update task workflow"""

    def handle_delete_task(self):
        """Handle the delete task workflow"""

    def handle_toggle_task(self):
        """Handle the toggle task status workflow"""
```

## Input/Output Specifications

### Input Validation
- Task title: 1-100 characters
- Task description: 0-500 characters
- Task ID: Positive integer that exists in the system

### Output Format
- Task display format: `[✓] ID: Title - Description` for completed tasks
- Task display format: `[ ] ID: Title - Description` for incomplete tasks
- Error messages: Clear, human-readable messages with suggestions for correction

## Error Handling Contract
- Invalid inputs: Display appropriate error message and return to menu
- Non-existent task IDs: Display "Task not found" message
- Empty titles: Display validation error message
- Confirmation required for destructive operations (delete)