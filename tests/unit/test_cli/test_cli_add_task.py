"""Unit tests for the CLI add task functionality."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI
from src.storage.task_storage import TaskStorage


class TestCLIAddTask(unittest.TestCase):
    """Test cases for the CLI add task functionality."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.input')
    @patch('builtins.print')
    def test_add_task_with_title_only(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test adding a task with only a title."""
        # Mock user input: title only, empty description
        mock_input.side_effect = ['Test task title', '']

        # Call the method
        self.cli.handle_add_task()

        # Verify the task was added to storage
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].title, 'Test task title')
        self.assertIsNone(tasks[0].description)
        self.assertFalse(tasks[0].completed)

        # Verify the print message
        mock_print.assert_called_with(f"Task added successfully with ID: {tasks[0].id}")

    @patch('builtins.input')
    @patch('builtins.print')
    def test_add_task_with_title_and_description(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test adding a task with both title and description."""
        # Mock user input: title and description
        mock_input.side_effect = ['Test task title', 'Test task description']

        # Call the method
        self.cli.handle_add_task()

        # Verify the task was added to storage
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].title, 'Test task title')
        self.assertEqual(tasks[0].description, 'Test task description')
        self.assertFalse(tasks[0].completed)

        # Verify the print message
        mock_print.assert_called_with(f"Task added successfully with ID: {tasks[0].id}")

    @patch('builtins.input')
    @patch('builtins.print')
    def test_add_task_with_invalid_title(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test adding a task with an invalid title (empty)."""
        # Mock user input: empty title
        mock_input.side_effect = ['', '']

        # Call the method
        self.cli.handle_add_task()

        # Verify no task was added to storage
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 0)

        # Verify the error message was printed
        mock_print.assert_called_with("Error: Title cannot be empty")

    @patch('builtins.input')
    @patch('builtins.print')
    def test_add_task_with_too_long_title(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test adding a task with a title that's too long."""
        # Mock user input: title longer than 100 characters
        long_title = 'a' * 101
        mock_input.side_effect = [long_title, '']

        # Call the method
        self.cli.handle_add_task()

        # Verify no task was added to storage
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 0)

        # Verify the error message was printed
        mock_print.assert_called_with(f"Error: Title is too long ({len(long_title)} characters). Maximum is 100 characters.")

    @patch('builtins.input')
    @patch('builtins.print')
    def test_add_task_with_too_long_description(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test adding a task with a description that's too long."""
        # Mock user input: valid title and description longer than 500 characters
        valid_title = 'Valid title'
        long_description = 'a' * 501
        mock_input.side_effect = [valid_title, long_description]

        # Call the method
        self.cli.handle_add_task()

        # Verify no task was added to storage
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 0)

        # Verify the error message was printed
        mock_print.assert_called_with(f"Error: Description is too long ({len(long_description)} characters). Maximum is 500 characters.")


if __name__ == '__main__':
    unittest.main()