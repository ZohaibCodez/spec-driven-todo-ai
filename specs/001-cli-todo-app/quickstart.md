# Quickstart Guide: CLI Todo Application

## Prerequisites
- Python 3.13+
- UV package manager

## Setup
1. Clone the repository
2. Install dependencies using UV:
   ```bash
   uv sync
   ```
3. Run the application:
   ```bash
   python -m src.cli.main
   ```

## Usage
The application provides a menu-driven interface with the following options:

1. **Add Task** - Create a new task with title and optional description
2. **View Tasks** - Display all tasks with ID, status, title, and description
3. **Update Task** - Modify an existing task's title or description
4. **Delete Task** - Remove a task with confirmation
5. **Toggle Task Status** - Mark a task as complete/incomplete
6. **Exit** - Quit the application

## Example Workflow
1. Start the application
2. Choose option 1 to add a task
3. Enter a title (required) and description (optional)
4. Choose option 2 to view all tasks
5. Choose option 5 to mark a task as complete
6. Choose option 6 to exit

## Development
- Run unit tests: `python -m pytest tests/unit/`
- Run integration tests: `python -m pytest tests/integration/`
- Check code style: `python -m flake8 src/`
- Check type hints: `python -m mypy src/`