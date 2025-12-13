"""Unit tests for the TaskStorage update functionality."""

import unittest
from src.storage.task_storage import TaskStorage


class TestTaskStorageUpdate(unittest.TestCase):
    """Test cases for the TaskStorage update functionality."""

    def setUp(self) -> None:
        """Set up a fresh TaskStorage instance for each test."""
        self.storage = TaskStorage()

    def test_update_task_title_success(self) -> None:
        """Test updating a task's title successfully."""
        # Add a task
        task = self.storage.add_task("Original title", "Original description")
        original_id = task.id

        # Update the title
        result = self.storage.update_task(task.id, "New title")

        # Verify the update was successful
        self.assertTrue(result)
        updated_task = self.storage.get_task(original_id)
        self.assertEqual(updated_task.title, "New title")
        self.assertEqual(updated_task.description, "Original description")  # Should remain unchanged
        self.assertFalse(updated_task.completed)  # Should remain unchanged

    def test_update_task_description_success(self) -> None:
        """Test updating a task's description successfully."""
        # Add a task
        task = self.storage.add_task("Original title")
        original_id = task.id

        # Update the description
        result = self.storage.update_task(task.id, description="New description")

        # Verify the update was successful
        self.assertTrue(result)
        updated_task = self.storage.get_task(original_id)
        self.assertEqual(updated_task.title, "Original title")  # Should remain unchanged
        self.assertEqual(updated_task.description, "New description")
        self.assertFalse(updated_task.completed)  # Should remain unchanged

    def test_update_task_title_and_description_success(self) -> None:
        """Test updating both a task's title and description successfully."""
        # Add a task
        task = self.storage.add_task("Original title", "Original description")
        original_id = task.id

        # Update both title and description
        result = self.storage.update_task(task.id, "New title", "New description")

        # Verify the update was successful
        self.assertTrue(result)
        updated_task = self.storage.get_task(original_id)
        self.assertEqual(updated_task.title, "New title")
        self.assertEqual(updated_task.description, "New description")
        self.assertFalse(updated_task.completed)  # Should remain unchanged

    def test_update_task_returns_false_for_nonexistent_task(self) -> None:
        """Test that updating a non-existent task returns False."""
        result = self.storage.update_task(999, "New title")
        self.assertFalse(result)

    def test_update_task_with_none_values_keeps_original_values(self) -> None:
        """Test that passing None for title or description keeps the original values."""
        # Add a task
        task = self.storage.add_task("Original title", "Original description")
        original_id = task.id

        # Update with None values (should not change anything)
        result = self.storage.update_task(task.id, None, None)

        # Verify nothing changed
        self.assertTrue(result)  # Should return True since the task exists
        updated_task = self.storage.get_task(original_id)
        self.assertEqual(updated_task.title, "Original title")
        self.assertEqual(updated_task.description, "Original description")

    def test_update_task_partial_update_title_only(self) -> None:
        """Test updating only the title while keeping the description unchanged."""
        # Add a task
        task = self.storage.add_task("Original title", "Original description")
        original_id = task.id

        # Update only the title
        result = self.storage.update_task(task.id, "New title")

        # Verify only the title changed
        self.assertTrue(result)
        updated_task = self.storage.get_task(original_id)
        self.assertEqual(updated_task.title, "New title")
        self.assertEqual(updated_task.description, "Original description")

    def test_update_task_partial_update_description_only(self) -> None:
        """Test updating only the description while keeping the title unchanged."""
        # Add a task
        task = self.storage.add_task("Original title", "Original description")
        original_id = task.id

        # Update only the description
        result = self.storage.update_task(task.id, description="New description")

        # Verify only the description changed
        self.assertTrue(result)
        updated_task = self.storage.get_task(original_id)
        self.assertEqual(updated_task.title, "Original title")
        self.assertEqual(updated_task.description, "New description")


if __name__ == '__main__':
    unittest.main()