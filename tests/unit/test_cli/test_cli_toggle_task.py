"""Unit tests for the CLI toggle task functionality."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI


class TestCLIToggleTask(unittest.TestCase):
    """Test cases for the CLI toggle task functionality."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.input', side_effect=['1'])
    @patch('builtins.print')
    def test_handle_toggle_task_success(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test toggling a task status successfully."""
        # Add a task first
        task = self.cli.storage.add_task("Test task")

        # Call the method
        self.cli.handle_toggle_task()

        # Verify the task status was toggled
        updated_task = self.cli.storage.get_task(task.id)
        self.assertTrue(updated_task.completed)

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} marked as complete" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message not found")

    @patch('builtins.input', side_effect=['1'])
    @patch('builtins.print')
    def test_handle_toggle_task_twice(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test toggling a task status twice returns it to original state."""
        # Add a task and toggle it once to make it complete
        task = self.cli.storage.add_task("Test task")
        self.cli.storage.toggle_task_status(task.id)  # Make it complete first
        self.assertTrue(self.cli.storage.get_task(task.id).completed)

        # Call the method to toggle it back to incomplete
        self.cli.handle_toggle_task()

        # Verify the task status was toggled back
        updated_task = self.cli.storage.get_task(task.id)
        self.assertFalse(updated_task.completed)

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} marked as incomplete" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message for incomplete not found")

    @patch('builtins.input', side_effect=['999'])
    @patch('builtins.print')
    def test_handle_toggle_task_nonexistent(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test toggling a non-existent task shows an error."""
        # Call the method with a non-existent task ID
        self.cli.handle_toggle_task()

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "not found" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for non-existent task not found")

    @patch('builtins.input', side_effect=['abc'])
    @patch('builtins.print')
    def test_handle_toggle_task_invalid_id(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test toggling with an invalid (non-numeric) task ID."""
        # Call the method with an invalid task ID
        self.cli.handle_toggle_task()

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "must be a number" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for invalid ID not found")


if __name__ == '__main__':
    unittest.main()