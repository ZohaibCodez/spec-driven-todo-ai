"""Unit tests for the CLI view tasks functionality."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI
from src.models.task import Task


class TestCLIViewTasks(unittest.TestCase):
    """Test cases for the CLI view tasks functionality."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.print')
    def test_handle_view_tasks_with_no_tasks(self, mock_print: MagicMock) -> None:
        """Test viewing tasks when there are no tasks."""
        self.cli.handle_view_tasks()

        # Verify the "No tasks found" message was printed
        mock_print.assert_called_with("No tasks found.")

    @patch('builtins.print')
    def test_handle_view_tasks_with_single_task(self, mock_print: MagicMock) -> None:
        """Test viewing tasks with a single incomplete task."""
        # Add a task
        self.cli.storage.add_task("Test task", "Test description")

        # Call the method
        self.cli.handle_view_tasks()

        # Verify the task was printed in the correct format
        # The print calls will include the header and the task
        calls = mock_print.call_args_list
        # Look for the task display in the format "[ ] ID: 1 - Test task - Test description"
        task_display_found = False
        for call in calls:
            if call[0][0].startswith("[ ] ID: 1 - Test task"):
                self.assertIn("Test description", call[0][0])
                task_display_found = True
                break

        self.assertTrue(task_display_found, "Task display format not found in print calls")

    @patch('builtins.print')
    def test_handle_view_tasks_with_completed_task(self, mock_print: MagicMock) -> None:
        """Test viewing tasks with a completed task."""
        # Add a task and mark it as complete
        task = self.cli.storage.add_task("Test task")
        self.cli.storage.toggle_task_status(task.id)

        # Call the method
        self.cli.handle_view_tasks()

        # Verify the task was printed with the completed marker
        calls = mock_print.call_args_list
        task_display_found = False
        for call in calls:
            if call[0][0].startswith("[✓] ID: 1 - Test task"):
                task_display_found = True
                break

        self.assertTrue(task_display_found, "Completed task display format not found in print calls")

    @patch('builtins.print')
    def test_handle_view_tasks_with_multiple_tasks(self, mock_print: MagicMock) -> None:
        """Test viewing tasks with multiple tasks."""
        # Add multiple tasks with different completion states
        task1 = self.cli.storage.add_task("Incomplete task", "Description 1")
        task2 = self.cli.storage.add_task("Complete task", "Description 2")
        self.cli.storage.toggle_task_status(task2.id)

        # Call the method
        self.cli.handle_view_tasks()

        # Verify both tasks were printed
        calls = mock_print.call_args_list
        incomplete_task_found = False
        complete_task_found = False

        for call in calls:
            call_str = call[0][0]
            if "[ ] ID: 1 - Incomplete task" in call_str and "Description 1" in call_str:
                incomplete_task_found = True
            elif "[✓] ID: 2 - Complete task" in call_str and "Description 2" in call_str:
                complete_task_found = True

        self.assertTrue(incomplete_task_found, "Incomplete task display not found")
        self.assertTrue(complete_task_found, "Complete task display not found")

    @patch('builtins.print')
    def test_handle_view_tasks_with_task_without_description(self, mock_print: MagicMock) -> None:
        """Test viewing tasks with a task that has no description."""
        # Add a task without a description
        self.cli.storage.add_task("Task without description")

        # Call the method
        self.cli.handle_view_tasks()

        # Verify the task was printed without a description
        calls = mock_print.call_args_list
        task_display_found = False
        for call in calls:
            call_str = call[0][0]
            if "[ ] ID: 1 - Task without description" in call_str and call_str.count(" - ") == 1:
                # Check that there's only one " - " which would be between status and title
                task_display_found = True
                break

        self.assertTrue(task_display_found, "Task without description display format not found")


if __name__ == '__main__':
    unittest.main()