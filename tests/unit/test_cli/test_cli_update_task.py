"""Unit tests for the CLI update task functionality."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI


class TestCLIUpdateTask(unittest.TestCase):
    """Test cases for the CLI update task functionality."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.input', side_effect=['1', 'New title', ''])
    @patch('builtins.print')
    def test_handle_update_task_title_only(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test updating a task's title only."""
        # Add a task first
        task = self.cli.storage.add_task("Original title", "Original description")

        # Call the method
        self.cli.handle_update_task()

        # Verify the task was updated
        updated_task = self.cli.storage.get_task(task.id)
        self.assertEqual(updated_task.title, "New title")
        self.assertEqual(updated_task.description, "Original description")  # Should remain unchanged

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} updated successfully" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message not found")

    @patch('builtins.input', side_effect=['1', '', 'New description'])
    @patch('builtins.print')
    def test_handle_update_task_description_only(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test updating a task's description only."""
        # Add a task first
        task = self.cli.storage.add_task("Original title", "Original description")

        # Call the method
        self.cli.handle_update_task()

        # Verify the task was updated
        updated_task = self.cli.storage.get_task(task.id)
        self.assertEqual(updated_task.title, "Original title")  # Should remain unchanged
        self.assertEqual(updated_task.description, "New description")

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} updated successfully" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message not found")

    @patch('builtins.input', side_effect=['1', 'New title', 'New description'])
    @patch('builtins.print')
    def test_handle_update_task_both_fields(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test updating both a task's title and description."""
        # Add a task first
        task = self.cli.storage.add_task("Original title", "Original description")

        # Call the method
        self.cli.handle_update_task()

        # Verify the task was updated
        updated_task = self.cli.storage.get_task(task.id)
        self.assertEqual(updated_task.title, "New title")
        self.assertEqual(updated_task.description, "New description")

        # Verify the success message was printed
        success_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and f"Task {task.id} updated successfully" in str(call[0][0]):
                success_message_found = True
                break

        self.assertTrue(success_message_found, "Success message not found")

    @patch('builtins.input', side_effect=['999'])
    @patch('builtins.print')
    def test_handle_update_task_nonexistent(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test updating a non-existent task shows an error."""
        # Call the method with a non-existent task ID
        self.cli.handle_update_task()

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "not found" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for non-existent task not found")

    @patch('builtins.input', side_effect=['abc'])
    @patch('builtins.print')
    def test_handle_update_task_invalid_id(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test updating with an invalid (non-numeric) task ID."""
        # Call the method with an invalid task ID
        self.cli.handle_update_task()

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "must be a number" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for invalid ID not found")

    @patch('builtins.input', side_effect=['1', 'a' * 101, ''])  # Title too long
    @patch('builtins.print')
    def test_handle_update_task_invalid_title(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test updating with an invalid title (too long)."""
        # Add a task first
        task = self.cli.storage.add_task("Original title")

        # Call the method with a too-long title
        self.cli.handle_update_task()

        # Verify the task was NOT updated
        unchanged_task = self.cli.storage.get_task(task.id)
        self.assertEqual(unchanged_task.title, "Original title")  # Should remain unchanged

        # Verify the error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "too long" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Error message for invalid title not found")


if __name__ == '__main__':
    unittest.main()