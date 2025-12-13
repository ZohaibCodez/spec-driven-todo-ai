"""Unit tests for the CLI delete task functionality."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI


class TestCLIDeleteTask(unittest.TestCase):
    """Test cases for the CLI delete task functionality."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.input', side_effect=['1', 'yes'])
    @patch('builtins.print')
    def test_handle_delete_task_confirmed(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test deleting a task with confirmation."""
        # Add a task first
        task = self.cli.storage.add_task("Test task", "Test description")

        # Verify the task exists before deletion
        self.assertEqual(len(self.cli.storage.list_tasks()), 1)

        # Call the method with confirmation
        self.cli.handle_delete_task()

        # Verify the task was deleted
        self.assertEqual(len(self.cli.storage.list_tasks()), 0)

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} deleted successfully" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message not found")

    @patch('builtins.input', side_effect=['1', 'no'])
    @patch('builtins.print')
    def test_handle_delete_task_cancelled(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test deleting a task but cancelling the confirmation."""
        # Add a task first
        task = self.cli.storage.add_task("Test task", "Test description")

        # Verify the task exists before deletion attempt
        self.assertEqual(len(self.cli.storage.list_tasks()), 1)

        # Call the method with cancellation
        self.cli.handle_delete_task()

        # Verify the task was NOT deleted
        self.assertEqual(len(self.cli.storage.list_tasks()), 1)
        self.assertIsNotNone(self.cli.storage.get_task(task.id))

        # Verify the cancellation message was printed
        cancellation_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "Task deletion cancelled" in str(call[0][0]):
                cancellation_message_found = True
                break

        self.assertTrue(cancellation_message_found, "Cancellation message not found")

    @patch('builtins.input', side_effect=['999', 'yes'])
    @patch('builtins.print')
    def test_handle_delete_task_nonexistent(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test deleting a non-existent task shows an error."""
        # Call the method with a non-existent task ID
        self.cli.handle_delete_task()

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "not found" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for non-existent task not found")

    @patch('builtins.input', side_effect=['abc', 'yes'])
    @patch('builtins.print')
    def test_handle_delete_task_invalid_id(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test deleting with an invalid (non-numeric) task ID."""
        # Call the method with an invalid task ID
        self.cli.handle_delete_task()

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "must be a number" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for invalid ID not found")

    @patch('builtins.input', side_effect=['1', 'y'])
    @patch('builtins.print')
    def test_handle_delete_task_confirmed_with_short_yes(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test deleting a task with short 'y' confirmation."""
        # Add a task first
        task = self.cli.storage.add_task("Test task", "Test description")

        # Verify the task exists before deletion
        self.assertEqual(len(self.cli.storage.list_tasks()), 1)

        # Call the method with 'y' confirmation
        self.cli.handle_delete_task()

        # Verify the task was deleted
        self.assertEqual(len(self.cli.storage.list_tasks()), 0)

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} deleted successfully" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message not found")


if __name__ == '__main__':
    unittest.main()