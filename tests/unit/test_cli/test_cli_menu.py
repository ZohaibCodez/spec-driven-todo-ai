"""Unit tests for the CLI menu functionality."""

import unittest
from unittest.mock import patch, MagicMock
from src.cli.main import TodoCLI


class TestCLIMenu(unittest.TestCase):
    """Test cases for the CLI menu functionality."""

    def setUp(self) -> None:
        """Set up a TodoCLI instance for testing."""
        self.cli = TodoCLI()

    @patch('builtins.input', side_effect=['1', 'Test task', 'Test description', '6'])
    @patch('builtins.print')
    def test_menu_option_1_add_task(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test that menu option 1 calls the add task function."""
        # Call the run method to simulate the menu loop
        with self.assertRaises(SystemExit):  # Option 6 exits the program
            self.cli.run()

        # Verify that the add task functionality was triggered
        tasks = self.cli.storage.list_tasks()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].title, 'Test task')
        self.assertEqual(tasks[0].description, 'Test description')

    @patch('builtins.input', side_effect=['2', '6'])
    @patch('builtins.print')
    def test_menu_option_2_view_tasks(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test that menu option 2 calls the view tasks function."""
        # Add a task first
        self.cli.storage.add_task("Test task")

        # Call the run method to simulate the menu loop
        with self.assertRaises(SystemExit):  # Option 6 exits the program
            self.cli.run()

        # Verify that the view tasks functionality was triggered
        # Check if the task display was called in the print function
        print_calls = [call[0][0] for call in mock_print.call_args_list if len(call) > 0 and isinstance(call[0], tuple)]
        task_display_found = any("Test task" in str(call) for call in print_calls if isinstance(call, str))
        self.assertTrue(task_display_found)

    @patch('builtins.input', side_effect=['6'])
    @patch('builtins.print')
    def test_menu_option_6_exit(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test that menu option 6 exits the program."""
        # Call the run method to simulate the menu loop
        with self.assertRaises(SystemExit):
            self.cli.run()

    @patch('builtins.input', side_effect=['99', '6'])  # Invalid option then exit
    @patch('builtins.print')
    def test_invalid_menu_option(self, mock_print: MagicMock, mock_input: MagicMock) -> None:
        """Test that invalid menu options show an error message."""
        # Call the run method to simulate the menu loop
        with self.assertRaises(SystemExit):  # Option 6 exits the program
            self.cli.run()

        # Verify that the invalid option error message was printed
        error_message_found = False
        for call in mock_print.call_args_list:
            if len(call[0]) > 0 and "Invalid option" in str(call[0][0]):
                error_message_found = True
                break

        self.assertTrue(error_message_found, "Invalid option error message not found")

    @patch('builtins.print')
    def test_display_menu_shows_correct_options(self, mock_print: MagicMock) -> None:
        """Test that the display_menu method shows all required options."""
        self.cli.display_menu()

        # Check if the print calls contain the menu options
        print_output = ' '.join([str(call[0][0]) if call[0] else '' for call in mock_print.call_args_list])

        # Verify that all menu options are present in the output
        self.assertIn("1. Add Task", print_output)
        self.assertIn("2. View Tasks", print_output)
        self.assertIn("3. Update Task", print_output)
        self.assertIn("4. Delete Task", print_output)
        self.assertIn("5. Toggle Task Status", print_output)
        self.assertIn("6. Exit", print_output)


if __name__ == '__main__':
    unittest.main()