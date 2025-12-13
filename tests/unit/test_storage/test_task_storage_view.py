"""Unit tests for the TaskStorage view methods."""

import unittest
from src.storage.task_storage import TaskStorage


class TestTaskStorageView(unittest.TestCase):
    """Test cases for the TaskStorage view methods."""

    def setUp(self) -> None:
        """Set up a fresh TaskStorage instance for each test."""
        self.storage = TaskStorage()

    def test_get_task_returns_correct_task(self) -> None:
        """Test that get_task returns the correct task by ID."""
        # Add a task
        task = self.storage.add_task("Test task", "Test description")

        # Retrieve the task
        retrieved_task = self.storage.get_task(task.id)

        # Verify the task is correct
        self.assertIsNotNone(retrieved_task)
        self.assertEqual(retrieved_task.id, task.id)
        self.assertEqual(retrieved_task.title, task.title)
        self.assertEqual(retrieved_task.description, task.description)
        self.assertEqual(retrieved_task.completed, task.completed)

    def test_get_task_returns_none_for_nonexistent_task(self) -> None:
        """Test that get_task returns None for a task that doesn't exist."""
        task = self.storage.get_task(999)
        self.assertIsNone(task)

    def test_list_tasks_returns_empty_list_when_no_tasks(self) -> None:
        """Test that list_tasks returns an empty list when there are no tasks."""
        tasks = self.storage.list_tasks()
        self.assertEqual(len(tasks), 0)
        self.assertEqual(tasks, [])

    def test_list_tasks_returns_all_tasks(self) -> None:
        """Test that list_tasks returns all stored tasks."""
        # Add multiple tasks
        task1 = self.storage.add_task("First task", "First description")
        task2 = self.storage.add_task("Second task", "Second description")
        task3 = self.storage.add_task("Third task")

        # List all tasks
        tasks = self.storage.list_tasks()

        # Verify all tasks are returned
        self.assertEqual(len(tasks), 3)

        # Verify the tasks contain the expected data
        task_dict = {task.id: task for task in tasks}
        self.assertIn(task1.id, task_dict)
        self.assertIn(task2.id, task_dict)
        self.assertIn(task3.id, task_dict)

        self.assertEqual(task_dict[task1.id].title, "First task")
        self.assertEqual(task_dict[task1.id].description, "First description")
        self.assertEqual(task_dict[task2.id].title, "Second task")
        self.assertEqual(task_dict[task2.id].description, "Second description")
        self.assertEqual(task_dict[task3.id].title, "Third task")
        self.assertIsNone(task_dict[task3.id].description)

    def test_list_tasks_after_deletion(self) -> None:
        """Test that list_tasks returns correct tasks after a task is deleted."""
        # Add multiple tasks
        task1 = self.storage.add_task("First task")
        task2 = self.storage.add_task("Second task")
        task3 = self.storage.add_task("Third task")

        # Delete one task
        self.storage.delete_task(task2.id)

        # List all tasks
        tasks = self.storage.list_tasks()

        # Verify only the remaining tasks are returned
        self.assertEqual(len(tasks), 2)

        task_ids = [task.id for task in tasks]
        self.assertIn(task1.id, task_ids)
        self.assertNotIn(task2.id, task_ids)
        self.assertIn(task3.id, task_ids)

    def test_list_tasks_preserves_task_attributes(self) -> None:
        """Test that list_tasks preserves all task attributes."""
        # Add a task and toggle its status
        task = self.storage.add_task("Test task", "Test description")
        self.storage.toggle_task_status(task.id)  # Mark as complete

        # List tasks
        tasks = self.storage.list_tasks()

        # Verify the task attributes are preserved
        self.assertEqual(len(tasks), 1)
        listed_task = tasks[0]
        self.assertEqual(listed_task.id, task.id)
        self.assertEqual(listed_task.title, task.title)
        self.assertEqual(listed_task.description, task.description)
        self.assertTrue(listed_task.completed)  # Should be True after toggle


if __name__ == '__main__':
    unittest.main()