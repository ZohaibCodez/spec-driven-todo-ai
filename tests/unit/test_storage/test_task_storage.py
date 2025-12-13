"""Unit tests for the TaskStorage class."""

import unittest
from src.storage.task_storage import TaskStorage
from src.models.task import Task


class TestTaskStorage(unittest.TestCase):
    """Test cases for the TaskStorage class."""

    def setUp(self) -> None:
        """Set up a fresh TaskStorage instance for each test."""
        self.storage = TaskStorage()

    def test_add_task_with_title_only(self) -> None:
        """Test adding a task with only a title."""
        task = self.storage.add_task("Test task")

        self.assertEqual(task.id, 1)
        self.assertEqual(task.title, "Test task")
        self.assertIsNone(task.description)
        self.assertFalse(task.completed)

        # Verify the task is stored
        stored_task = self.storage.get_task(1)
        self.assertIsNotNone(stored_task)
        self.assertEqual(stored_task.id, 1)
        self.assertEqual(stored_task.title, "Test task")
        self.assertIsNone(stored_task.description)
        self.assertFalse(stored_task.completed)

    def test_add_task_with_title_and_description(self) -> None:
        """Test adding a task with both title and description."""
        task = self.storage.add_task("Test task", "Test description")

        self.assertEqual(task.id, 1)
        self.assertEqual(task.title, "Test task")
        self.assertEqual(task.description, "Test description")
        self.assertFalse(task.completed)

        # Verify the task is stored
        stored_task = self.storage.get_task(1)
        self.assertIsNotNone(stored_task)
        self.assertEqual(stored_task.id, 1)
        self.assertEqual(stored_task.title, "Test task")
        self.assertEqual(stored_task.description, "Test description")
        self.assertFalse(stored_task.completed)

    def test_add_multiple_tasks_get_sequential_ids(self) -> None:
        """Test that multiple tasks get sequential IDs starting from 1."""
        task1 = self.storage.add_task("First task")
        task2 = self.storage.add_task("Second task")
        task3 = self.storage.add_task("Third task")

        self.assertEqual(task1.id, 1)
        self.assertEqual(task2.id, 2)
        self.assertEqual(task3.id, 3)

        # Verify all tasks are stored correctly
        self.assertIsNotNone(self.storage.get_task(1))
        self.assertIsNotNone(self.storage.get_task(2))
        self.assertIsNotNone(self.storage.get_task(3))

        self.assertEqual(self.storage.get_task(1).title, "First task")
        self.assertEqual(self.storage.get_task(2).title, "Second task")
        self.assertEqual(self.storage.get_task(3).title, "Third task")

    def test_get_task_returns_none_for_nonexistent_task(self) -> None:
        """Test that get_task returns None for a task that doesn't exist."""
        task = self.storage.get_task(999)
        self.assertIsNone(task)

    def test_list_tasks_returns_all_tasks(self) -> None:
        """Test that list_tasks returns all stored tasks."""
        task1 = self.storage.add_task("First task")
        task2 = self.storage.add_task("Second task")
        task3 = self.storage.add_task("Third task")

        tasks = self.storage.list_tasks()
        self.assertEqual(len(tasks), 3)

        # Check that all tasks are present
        task_ids = [task.id for task in tasks]
        self.assertIn(1, task_ids)
        self.assertIn(2, task_ids)
        self.assertIn(3, task_ids)

    def test_get_next_id_returns_correct_next_id(self) -> None:
        """Test that get_next_id returns the next available ID."""
        self.assertEqual(self.storage.get_next_id(), 1)

        self.storage.add_task("First task")
        self.assertEqual(self.storage.get_next_id(), 2)

        self.storage.add_task("Second task")
        self.assertEqual(self.storage.get_next_id(), 3)

    def test_task_marked_as_incomplete_by_default(self) -> None:
        """Test that new tasks are marked as incomplete by default."""
        task = self.storage.add_task("Test task")
        self.assertFalse(task.completed)


if __name__ == '__main__':
    unittest.main()