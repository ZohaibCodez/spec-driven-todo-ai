"""Unit tests for the TaskStorage delete functionality."""

import unittest
from src.storage.task_storage import TaskStorage


class TestTaskStorageDelete(unittest.TestCase):
    """Test cases for the TaskStorage delete functionality."""

    def setUp(self) -> None:
        """Set up a fresh TaskStorage instance for each test."""
        self.storage = TaskStorage()

    def test_delete_task_success(self) -> None:
        """Test deleting a task successfully."""
        # Add a task
        task = self.storage.add_task("Test task", "Test description")
        original_id = task.id

        # Verify the task exists before deletion
        self.assertIsNotNone(self.storage.get_task(original_id))
        self.assertEqual(len(self.storage.list_tasks()), 1)

        # Delete the task
        result = self.storage.delete_task(original_id)

        # Verify the deletion was successful
        self.assertTrue(result)
        self.assertIsNone(self.storage.get_task(original_id))
        self.assertEqual(len(self.storage.list_tasks()), 0)

    def test_delete_task_returns_false_for_nonexistent_task(self) -> None:
        """Test that deleting a non-existent task returns False."""
        result = self.storage.delete_task(999)
        self.assertFalse(result)

    def test_delete_task_with_multiple_tasks(self) -> None:
        """Test deleting one task doesn't affect others."""
        # Add multiple tasks
        task1 = self.storage.add_task("Task 1", "Description 1")
        task2 = self.storage.add_task("Task 2", "Description 2")
        task3 = self.storage.add_task("Task 3", "Description 3")

        # Verify all tasks exist
        self.assertEqual(len(self.storage.list_tasks()), 3)

        # Delete task 2
        result = self.storage.delete_task(task2.id)

        # Verify the deletion was successful and other tasks remain
        self.assertTrue(result)
        self.assertIsNotNone(self.storage.get_task(task1.id))
        self.assertIsNone(self.storage.get_task(task2.id))
        self.assertIsNotNone(self.storage.get_task(task3.id))
        self.assertEqual(len(self.storage.list_tasks()), 2)

    def test_delete_task_then_add_new_task_has_next_id(self) -> None:
        """Test that after deleting a task, the next added task gets the next available ID."""
        # Add tasks
        task1 = self.storage.add_task("Task 1")
        task2 = self.storage.add_task("Task 2")
        task3 = self.storage.add_task("Task 3")

        # Delete task in the middle
        self.storage.delete_task(task2.id)

        # Add a new task - it should get the next ID after the highest existing
        new_task = self.storage.add_task("New task")
        self.assertEqual(new_task.id, 4)  # Should be 4, not reusing ID 2

        # Verify the new task exists and others are as expected
        self.assertIsNotNone(self.storage.get_task(task1.id))
        self.assertIsNone(self.storage.get_task(task2.id))
        self.assertIsNotNone(self.storage.get_task(task3.id))
        self.assertIsNotNone(self.storage.get_task(new_task.id))

    def test_delete_all_tasks_then_add_new(self) -> None:
        """Test deleting all tasks and then adding a new one."""
        # Add a task
        task = self.storage.add_task("Test task")

        # Delete the task
        result = self.storage.delete_task(task.id)
        self.assertTrue(result)
        self.assertEqual(len(self.storage.list_tasks()), 0)

        # Add a new task - it should get the next ID
        new_task = self.storage.add_task("New task")
        self.assertEqual(new_task.id, 2)


if __name__ == '__main__':
    unittest.main()