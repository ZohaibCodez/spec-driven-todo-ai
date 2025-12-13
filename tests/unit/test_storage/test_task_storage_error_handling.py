"""Unit tests for TaskStorage error handling scenarios."""

import unittest
from src.storage.task_storage import TaskStorage
from src.models.task import Task


class TestTaskStorageErrorHandling(unittest.TestCase):
    """Test cases for TaskStorage error handling scenarios."""

    def setUp(self) -> None:
        """Set up a fresh TaskStorage instance for each test."""
        self.storage = TaskStorage()

    def test_task_creation_with_invalid_data(self) -> None:
        """Test Task dataclass validation with invalid data."""
        # Test with negative ID
        with self.assertRaises(ValueError) as context:
            Task(id=-1, title="Test title")
        self.assertIn("positive integer", str(context.exception))

        # Test with zero ID
        with self.assertRaises(ValueError) as context:
            Task(id=0, title="Test title")
        self.assertIn("positive integer", str(context.exception))

        # Test with empty title
        with self.assertRaises(ValueError) as context:
            Task(id=1, title="")
        self.assertIn("1-100 characters", str(context.exception))

        # Test with title too long
        with self.assertRaises(ValueError) as context:
            Task(id=1, title="a" * 101)
        self.assertIn("1-100 characters", str(context.exception))

        # Test with description too long
        with self.assertRaises(ValueError) as context:
            Task(id=1, title="Test title", description="a" * 501)
        self.assertIn("0-500 characters", str(context.exception))

        # Test with non-boolean completion status
        with self.assertRaises(ValueError) as context:
            Task(id=1, title="Test title", completed="true")  # type: ignore
        self.assertIn("boolean", str(context.exception))

    def test_get_nonexistent_task(self) -> None:
        """Test getting a task that doesn't exist."""
        task = self.storage.get_task(999)
        self.assertIsNone(task)

    def test_update_nonexistent_task(self) -> None:
        """Test updating a task that doesn't exist."""
        result = self.storage.update_task(999, "New title")
        self.assertFalse(result)

    def test_delete_nonexistent_task(self) -> None:
        """Test deleting a task that doesn't exist."""
        result = self.storage.delete_task(999)
        self.assertFalse(result)

    def test_toggle_nonexistent_task(self) -> None:
        """Test toggling a task that doesn't exist."""
        result = self.storage.toggle_task_status(999)
        self.assertFalse(result)

    def test_empty_title_validation_in_add_task(self) -> None:
        """Test that adding a task with an empty title raises an error."""
        with self.assertRaises(ValueError):
            self.storage.add_task("")

    def test_long_title_validation_in_add_task(self) -> None:
        """Test that adding a task with a too-long title raises an error."""
        with self.assertRaises(ValueError):
            self.storage.add_task("a" * 101)

    def test_long_description_validation_in_add_task(self) -> None:
        """Test that adding a task with a too-long description raises an error."""
        with self.assertRaises(ValueError):
            self.storage.add_task("Valid title", "a" * 501)


if __name__ == '__main__':
    unittest.main()