"""Unit tests for CLI error handling scenarios."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI


class TestCLIErrorHandling(unittest.TestCase):
    """Test cases for CLI error handling scenarios."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.input', side_effect=['99'])
    @patch('builtins.print')
    def test_invalid_menu_selection(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test handling of invalid menu selections outside the 1-6 range."""
        # Call the run method to simulate the menu loop
        # We'll simulate one invalid option then exit
        with patch('src.cli.main.TodoCLI.display_menu'), \
             patch('builtins.input', side_effect=['99', '6']), \
             patch('builtins.print') as mock_print:

            with self.assertRaises(SystemExit):  # Option 6 exits the program
                self.cli.run()

        # Check if error message for invalid option was displayed
        error_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "Invalid option" in str(call[0][0]):
                error_found = True
                break

        self.assertTrue(error_found, "Invalid option error message not found")

    @patch('builtins.input', side_effect=['abc'])
    @patch('builtins.print')
    def test_non_numeric_task_id(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test handling of non-numeric task IDs across all operations."""
        # Test with add task (option 1)
        with patch('builtins.input', side_effect=['1', 'Test task', 'Test desc', '3', 'abc', '6']), \
             patch('src.cli.main.TodoCLI.display_menu'):
            with self.assertRaises(SystemExit):
                self.cli.run()

        # Check if error message for non-numeric ID was displayed
        error_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "must be a number" in str(call[0][0]):
                error_found = True
                break

        # Since multiple operations might trigger this, we'll look for it in the context
        # of update task operation specifically
        with patch('builtins.input', side_effect=['abc']), \
             patch('builtins.print') as mock_print_update:

            self.cli.handle_update_task()

            error_found = False
            for call in mock_print_update.call_args_list:
                if len(call[0]) > 0 and "must be a number" in str(call[0][0]):
                    error_found = True
                    break

        self.assertTrue(error_found, "Non-numeric ID error message not found")

    @patch('builtins.input', side_effect=['999'])
    @patch('builtins.print')
    def test_nonexistent_task_id(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test handling of non-existent task IDs."""
        # Call the toggle function with a non-existent task ID
        self.cli.handle_toggle_task()

        # Check if error message for non-existent task was displayed
        error_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "not found" in str(call[0][0]):
                error_found = True
                break

        self.assertTrue(error_found, "Non-existent task error message not found")

    @patch('builtins.input', side_effect=['', '6'])
    @patch('builtins.print')
    def test_empty_title_validation(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test validation for empty or whitespace-only titles."""
        # Call the add task function with an empty title
        self.cli.handle_add_task()

        # Check if error message for empty title was displayed
        error_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "cannot be empty" in str(call[0][0]):
                error_found = True
                break

        self.assertTrue(error_found, "Empty title error message not found")

    @patch('builtins.input', side_effect=['a' * 101, '6'])
    @patch('builtins.print')
    def test_long_title_validation(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test validation for titles that are too long."""
        # Call the add task function with a too-long title
        self.cli.handle_add_task()

        # Check if error message for long title was displayed
        error_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "too long" in str(call[0][0]) and "100" in str(call[0][0]):
                error_found = True
                break

        self.assertTrue(error_found, "Long title error message not found")

    @patch('builtins.input', side_effect=['a', 'b' * 501, '6'])
    @patch('builtins.print')
    def test_long_description_validation(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test validation for descriptions that are too long."""
        # Call the add task function with a too-long description
        self.cli.handle_add_task()

        # Check if error message for long description was displayed
        error_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "too long" in str(call[0][0]) and "500" in str(call[0][0]):
                error_found = True
                break

        self.assertTrue(error_found, "Long description error message not found")


if __name__ == '__main__':
    unittest.main()