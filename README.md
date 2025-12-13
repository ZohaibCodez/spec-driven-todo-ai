# Spec-Driven Todo Application - Command Line Task Manager

A lightweight, efficient command-line todo application built with Python 3.12+ (compatible with Python 3.13+) that allows users to manage their tasks efficiently without any external dependencies. Perfect for developers, students, and anyone who prefers terminal-based productivity tools. This project demonstrates spec-driven development methodology.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Menu Options](#menu-options)
- [Task Status Indicators](#task-status-indicators)
- [Validation Rules](#validation-rules)
- [Development](#development)
- [Architecture](#architecture)
- [Error Handling](#error-handling)
- [Performance](#performance)

## Features

- ✅ Add tasks with required title and optional description
- ✅ View all tasks with ID, status, title, and description
- ✅ Update task title or description
- ✅ Delete tasks with confirmation
- ✅ Toggle task completion status
- ✅ Menu-driven interface with options 1-6
- ✅ Clear error messages for invalid inputs
- ✅ Tasks stored in memory (no persistence)
- ✅ Fast response times for all operations
- ✅ No external dependencies - uses only Python standard library

## Requirements

- Python 3.12+ (compatible with Python 3.13+)
- UV package manager (optional, for dependency management)

## Installation

### Method 1: Direct Clone and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ZohaibCodez/spec-driven-todo-ai
   cd spec-driven-todo-ai
   ```

2. Install dependencies using UV (recommended):
   ```bash
   uv sync
   ```

3. Or install using pip:
   ```bash
   pip install -e .
   ```

### Method 2: Using pip directly

```bash
pip install git+https://github.com/ZohaibCodez/spec-driven-todo-ai.git
```

## Quick Start

Get up and running in seconds:

```bash
# Run the application directly
python -m src.cli.main

# Or if installed as a package
todo
```

## Usage Examples

### Example 1: Adding Your First Task
```
=== CLI Todo Application ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Task Status
6. Exit
============================
Select an option (1-6): 1

--- Add New Task ---
Enter task title (required): Complete project proposal
Enter task description (optional, press Enter to skip): Write and submit the Q4 project proposal to stakeholders
Task added successfully with ID: 1
```

### Example 2: Viewing All Tasks
```
Select an option (1-6): 2

--- All Tasks ---
[ ] ID: 1 - Complete project proposal - Write and submit the Q4 project proposal to stakeholders
[ ] ID: 2 - Buy groceries - Milk, bread, eggs, fruits
```

### Example 3: Updating a Task
```
Select an option (1-6): 3

--- Update Task ---
Enter task ID to update: 1
Current task: [ ] Complete project proposal
Description: Write and submit the Q4 project proposal to stakeholders
Enter new title (current: 'Complete project proposal', press Enter to keep current): Complete Q4 project proposal
Enter new description (current: 'Write and submit the Q4 project proposal to stakeholders', press Enter to keep current): Write, review, and submit the Q4 project proposal to stakeholders by Friday
Task 1 updated successfully.
```

### Example 4: Toggling Task Status
```
Select an option (1-6): 5

--- Toggle Task Status ---
Enter task ID to toggle: 2
Task 2 marked as complete.
```

### Example 5: Deleting a Task
```
Select an option (1-6): 4

--- Delete Task ---
Enter task ID to delete: 1
Task to delete: [✓] Complete Q4 project proposal
Description: Write, review, and submit the Q4 project proposal to stakeholders by Friday
Are you sure you want to delete this task? (yes/no): yes
Task 1 deleted successfully.
```

## Menu Options

1. **Add Task** - Create a new task with a required title and optional description
2. **View Tasks** - Display all tasks with their ID, status, title, and description
3. **Update Task** - Modify an existing task's title or description
4. **Delete Task** - Remove a task with confirmation
5. **Toggle Task Status** - Mark a task as complete/incomplete
6. **Exit** - Quit the application

## Task Status Indicators

- `[ ]` - Incomplete task
- `[✓]` - Complete task

## Validation Rules

- **Task titles**: 1-100 characters (enforced to maintain readability)
- **Task descriptions**: 0-500 characters (optional but detailed when provided)
- **Task IDs**: Sequential integers starting from 1 (automatically assigned)
- **Input validation**: Clear error messages for invalid inputs

## Development

### Running Tests

```bash
# Run all tests with coverage
PYTHONPATH=. python3 -m unittest discover tests/ -v

# Run specific test modules
PYTHONPATH=. python3 -m unittest tests.unit.test_storage.test_task_storage -v
PYTHONPATH=. python3 -m unittest tests.unit.test_cli.test_cli_add_task -v
PYTHONPATH=. python3 -m unittest tests.integration.test_end_to_end -v
```

### Code Quality Checks

```bash
# Run linting (if flake8 is installed)
python -m flake8 src/

# Run type checking (if mypy is installed)
python -m mypy src/
```

### Performance Testing

```bash
# Run performance tests
PYTHONPATH=. python3 -c "
import time
from src.storage.task_storage import TaskStorage

# Performance test
storage = TaskStorage()
start_time = time.time()
for i in range(1000):
    storage.add_task(f'Task {i}')
end_time = time.time()
print(f'Added 1000 tasks in {end_time - start_time:.4f} seconds')
"
```

## Architecture

The application follows a clean three-layer architecture ensuring separation of concerns:

- **Models Layer**: Data classes for task representation (`src/models/task.py`)
  - Uses Python dataclass for clean, efficient data structures
  - Built-in validation for data integrity

- **Storage Layer**: In-memory storage implementation (`src/storage/task_storage.py`)
  - Dictionary-based for O(1) average lookup time
  - No external dependencies
  - Thread-safe operations

- **CLI Layer**: User interface and menu system (`src/cli/main.py`)
  - Interactive menu-driven interface
  - Input validation and error handling
  - Clean separation from business logic

## Error Handling

The application provides comprehensive error handling with user-friendly messages:

- **Invalid task IDs**: "Error: Task ID must be a number" or "Error: Task with ID X not found"
- **Validation errors**: Specific messages for title/description length requirements
- **Input errors**: Clear guidance on correct input formats
- **Menu errors**: "Invalid option. Please select a number between 1 and 6."

## Performance

- **Fast operations**: O(1) average time complexity for all core operations
- **Minimal memory footprint**: Efficient dictionary-based storage
- **Quick startup**: No initialization delays
- **Responsive interface**: Immediate feedback for all user actions

## Keywords

spec driven development, command line todo app, python todo application, terminal task manager, cli productivity tool, python task manager, console todo list, command line application, python 3.12, python 3.13, task management, productivity software, spec driven todo, ai driven development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.