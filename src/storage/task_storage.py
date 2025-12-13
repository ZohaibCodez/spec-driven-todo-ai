"""In-memory storage for tasks using dictionary-based implementation."""

from typing import Dict, List, Optional
from src.models.task import Task


class TaskStorage:
    """Manages in-memory storage of tasks using a dictionary mapping task IDs to Task objects."""

    def __init__(self) -> None:
        """Initialize the task storage with an empty dictionary and starting ID counter."""
        self._tasks: Dict[int, Task] = {}
        self._next_id: int = 1

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """Add a new task with the given title and optional description.

        Args:
            title: The required title for the task (1-100 characters)
            description: Optional description for the task (0-500 characters)

        Returns:
            The newly created Task object with assigned ID and marked as incomplete
        """
        new_task = Task(
            id=self._next_id,
            title=title,
            description=description,
            completed=False
        )
        self._tasks[self._next_id] = new_task
        self._next_id += 1
        return new_task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task object if found, None otherwise
        """
        return self._tasks.get(task_id)

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """Update an existing task's title or description by ID.

        Args:
            task_id: The ID of the task to update
            title: New title for the task (if provided)
            description: New description for the task (if provided)

        Returns:
            True if the task was successfully updated, False if task doesn't exist
        """
        if task_id not in self._tasks:
            return False

        task = self._tasks[task_id]
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        return True

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if the task was successfully deleted, False if task doesn't exist
        """
        if task_id not in self._tasks:
            return False

        del self._tasks[task_id]
        return True

    def toggle_task_status(self, task_id: int) -> bool:
        """Toggle a task's completion status by ID.

        Args:
            task_id: The ID of the task to toggle

        Returns:
            True if the task status was successfully toggled, False if task doesn't exist
        """
        if task_id not in self._tasks:
            return False

        task = self._tasks[task_id]
        task.completed = not task.completed
        return True

    def list_tasks(self) -> List[Task]:
        """Return all tasks in the storage.

        Returns:
            A list of all Task objects in the storage
        """
        return list(self._tasks.values())

    def get_next_id(self) -> int:
        """Get the next available ID for new tasks.

        Returns:
            The next ID that will be assigned to a new task
        """
        return self._next_id