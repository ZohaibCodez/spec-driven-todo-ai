# CLI Todo Application

A command-line todo application built with Python 3.13+ that allows users to manage their tasks efficiently.

## Features

- Add tasks with required title and optional description
- View all tasks with ID, status, title, and description
- Update task title or description
- Delete tasks with confirmation
- Toggle task completion status
- Menu-driven interface with options 1-6
- Clear error messages for invalid inputs
- Tasks stored in memory (no persistence)

## Requirements

- Python 3.13+
- UV package manager (optional, for dependency management)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cli-todo-app
   ```

2. Install dependencies using UV (recommended):
   ```bash
   uv sync
   ```

   Or install using pip:
   ```bash
   pip install -e .
   ```

## Usage

### Running the Application

```bash
python -m src.cli.main
```

Or if installed as a package:
```bash
todo
```

### Menu Options

1. **Add Task** - Create a new task with a required title and optional description
2. **View Tasks** - Display all tasks with their ID, status, title, and description
3. **Update Task** - Modify an existing task's title or description
4. **Delete Task** - Remove a task with confirmation
5. **Toggle Task Status** - Mark a task as complete/incomplete
6. **Exit** - Quit the application

### Task Status Indicators

- `[ ]` - Incomplete task
- `[✓]` - Complete task

## Development

### Running Tests

```bash
# Run all tests
python -m pytest

# Run unit tests only
python -m pytest tests/unit/

# Run integration tests only
python -m pytest tests/integration/
```

### Code Quality Checks

```bash
# Run linting
python -m flake8 src/

# Run type checking
python -m mypy src/
```

## Architecture

The application follows a three-layer architecture:

- **Models Layer**: Data classes for task representation (`src/models/task.py`)
- **Storage Layer**: In-memory storage implementation (`src/storage/task_storage.py`)
- **CLI Layer**: User interface and menu system (`src/cli/main.py`)

## Validation Rules

- Task titles: 1-100 characters
- Task descriptions: 0-500 characters
- Task IDs: Sequential integers starting from 1

## Error Handling

The application provides clear error messages for:
- Invalid task IDs
- Empty or too-long titles/descriptions
- Invalid menu selections
- Non-existent tasks