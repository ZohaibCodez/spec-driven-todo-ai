"""Unit tests for the TaskStorage toggle functionality."""

import unittest
from src.storage.task_storage import TaskStorage


class TestTaskStorageToggle(unittest.TestCase):
    """Test cases for the TaskStorage toggle functionality."""

    def setUp(self) -> None:
        """Set up a fresh TaskStorage instance for each test."""
        self.storage = TaskStorage()

    def test_toggle_task_status_changes_status(self) -> None:
        """Test that toggling a task status changes it from incomplete to complete."""
        # Add a task (by default it's incomplete)
        task = self.storage.add_task("Test task")
        self.assertFalse(task.completed)

        # Toggle the status
        result = self.storage.toggle_task_status(task.id)

        # Verify the status changed and the operation was successful
        self.assertTrue(result)
        updated_task = self.storage.get_task(task.id)
        self.assertTrue(updated_task.completed)

    def test_toggle_task_status_toggles_back(self) -> None:
        """Test that toggling a task status twice returns it to the original state."""
        # Add a task (by default it's incomplete)
        task = self.storage.add_task("Test task")
        self.assertFalse(task.completed)

        # Toggle the status twice
        result1 = self.storage.toggle_task_status(task.id)
        result2 = self.storage.toggle_task_status(task.id)

        # Verify the status is back to incomplete and both operations were successful
        self.assertTrue(result1)
        self.assertTrue(result2)
        updated_task = self.storage.get_task(task.id)
        self.assertFalse(updated_task.completed)

    def test_toggle_task_status_returns_false_for_nonexistent_task(self) -> None:
        """Test that toggling a non-existent task returns False."""
        result = self.storage.toggle_task_status(999)
        self.assertFalse(result)

    def test_toggle_task_status_with_multiple_tasks(self) -> None:
        """Test toggling status of one task doesn't affect others."""
        # Add multiple tasks
        task1 = self.storage.add_task("Task 1")
        task2 = self.storage.add_task("Task 2", "Description")
        task3 = self.storage.add_task("Task 3")

        # Verify all tasks start as incomplete
        self.assertFalse(task1.completed)
        self.assertFalse(task2.completed)
        self.assertFalse(task3.completed)

        # Toggle only task 2
        result = self.storage.toggle_task_status(task2.id)

        # Verify only task 2's status changed
        self.assertTrue(result)
        updated_tasks = self.storage.list_tasks()
        task_dict = {task.id: task for task in updated_tasks}

        self.assertFalse(task_dict[task1.id].completed)
        self.assertTrue(task_dict[task2.id].completed)
        self.assertFalse(task_dict[task3.id].completed)


if __name__ == '__main__':
    unittest.main()