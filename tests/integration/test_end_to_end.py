"""Integration tests for complete user workflows."""

import unittest
from src.cli.main import TodoCLI
from src.storage.task_storage import TaskStorage


class TestEndToEndWorkflows(unittest.TestCase):
    """Integration tests for complete user workflows."""

    def setUp(self) -> None:
        """Set up a fresh TodoCLI instance for each test."""
        self.cli = TodoCLI()

    def test_complete_workflow_add_view_toggle_delete(self) -> None:
        """Test a complete workflow: add task, view tasks, toggle status, delete task."""
        # Add a task
        task = self.cli.storage.add_task("Test task", "Test description")
        self.assertEqual(len(self.cli.storage.list_tasks()), 1)

        # Verify the task was added correctly
        stored_task = self.cli.storage.get_task(task.id)
        self.assertIsNotNone(stored_task)
        self.assertEqual(stored_task.title, "Test task")
        self.assertEqual(stored_task.description, "Test description")
        self.assertFalse(stored_task.completed)

        # Toggle the task status
        result = self.cli.storage.toggle_task_status(task.id)
        self.assertTrue(result)

        # Verify the status was toggled
        toggled_task = self.cli.storage.get_task(task.id)
        self.assertTrue(toggled_task.completed)

        # Delete the task
        delete_result = self.cli.storage.delete_task(task.id)
        self.assertTrue(delete_result)

        # Verify the task was deleted
        self.assertEqual(len(self.cli.storage.list_tasks()), 0)
        self.assertIsNone(self.cli.storage.get_task(task.id))

    def test_multiple_tasks_workflow(self) -> None:
        """Test workflow with multiple tasks."""
        # Add multiple tasks
        task1 = self.cli.storage.add_task("Task 1", "Description 1")
        task2 = self.cli.storage.add_task("Task 2", "Description 2")
        task3 = self.cli.storage.add_task("Task 3")

        # Verify all tasks exist
        all_tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(all_tasks), 3)

        # Update one task
        update_result = self.cli.storage.update_task(task2.id, "Updated Task 2", "Updated Description 2")
        self.assertTrue(update_result)

        # Verify the update
        updated_task = self.cli.storage.get_task(task2.id)
        self.assertEqual(updated_task.title, "Updated Task 2")
        self.assertEqual(updated_task.description, "Updated Description 2")

        # Toggle status of another task
        toggle_result = self.cli.storage.toggle_task_status(task3.id)
        self.assertTrue(toggle_result)

        # Verify the status change
        toggled_task = self.cli.storage.get_task(task3.id)
        self.assertTrue(toggled_task.completed)

        # Verify other tasks remain unchanged
        task1_check = self.cli.storage.get_task(task1.id)
        self.assertEqual(task1_check.title, "Task 1")
        self.assertFalse(task1_check.completed)

    def test_task_lifecycle_with_validation(self) -> None:
        """Test the complete lifecycle with validation checks."""
        # Add a valid task
        task = self.cli.storage.add_task("Valid task title", "Valid description")
        self.assertIsNotNone(task)
        self.assertEqual(task.title, "Valid task title")
        self.assertEqual(task.description, "Valid description")
        self.assertFalse(task.completed)

        # Try to update with invalid title (should fail at validation level)
        # This test is more for the model validation
        from src.models.task import Task
        with self.assertRaises(ValueError):
            Task(id=task.id, title="a" * 101)  # Title too long

        # Update with valid data
        result = self.cli.storage.update_task(task.id, "Updated title")
        self.assertTrue(result)

        # Toggle status
        result = self.cli.storage.toggle_task_status(task.id)
        self.assertTrue(result)

        # Verify final state
        final_task = self.cli.storage.get_task(task.id)
        self.assertEqual(final_task.title, "Updated title")
        self.assertTrue(final_task.completed)

        # Delete the task
        result = self.cli.storage.delete_task(task.id)
        self.assertTrue(result)
        self.assertIsNone(self.cli.storage.get_task(task.id))

    def test_menu_flow_simulation(self) -> None:
        """Simulate a typical menu flow to ensure all components work together."""
        # Add several tasks
        task1 = self.cli.storage.add_task("Buy groceries", "Milk, bread, eggs")
        task2 = self.cli.storage.add_task("Finish report", "Complete the quarterly report")
        task3 = self.cli.storage.add_task("Call dentist")

        # Verify tasks exist
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 3)

        # Toggle one task
        self.cli.storage.toggle_task_status(task2.id)
        toggled_task = self.cli.storage.get_task(task2.id)
        self.assertTrue(toggled_task.completed)

        # Update another task
        self.cli.storage.update_task(task1.id, "Buy groceries", "Milk, bread, eggs, fruits")
        updated_task = self.cli.storage.get_task(task1.id)
        self.assertEqual(updated_task.description, "Milk, bread, eggs, fruits")

        # Delete one task
        self.cli.storage.delete_task(task3.id)
        remaining_tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(remaining_tasks), 2)

        # Verify the correct tasks remain
        task_ids = [task.id for task in remaining_tasks]
        self.assertIn(task1.id, task_ids)
        self.assertIn(task2.id, task_ids)
        self.assertNotIn(task3.id, task_ids)


if __name__ == '__main__':
    unittest.main()