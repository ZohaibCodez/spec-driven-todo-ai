"""Main CLI interface for the todo application."""

import sys
from typing import Optional
from src.storage.task_storage import TaskStorage
from src.storage.validation import validate_task_title, validate_task_description


class TodoCLI:
    """Command-line interface for the todo application."""

    def __init__(self) -> None:
        """Initialize the CLI with a task storage instance."""
        self.storage = TaskStorage()

    def display_menu(self) -> None:
        """Display the main menu options."""
        print("\n=== CLI Todo Application ===")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Update Task")
        print("4. Delete Task")
        print("5. Toggle Task Status")
        print("6. Exit")
        print("============================")

    def handle_add_task(self) -> None:
        """Handle the add task workflow."""
        print("\n--- Add New Task ---")
        title = input("Enter task title (required): ").strip()

        if not validate_task_title(title):
            print(f"Error: {self._get_title_error_message(title)}")
            return

        description_input = input("Enter task description (optional, press Enter to skip): ").strip()
        description = description_input if description_input else None

        if description and not validate_task_description(description):
            print(f"Error: {self._get_description_error_message(description)}")
            return

        task = self.storage.add_task(title, description)
        print(f"Task added successfully with ID: {task.id}")

    def handle_view_tasks(self) -> None:
        """Handle the view tasks workflow."""
        print("\n--- All Tasks ---")
        tasks = self.storage.list_tasks()

        if not tasks:
            print("No tasks found.")
            return

        for task in tasks:
            status = "✓" if task.completed else " "
            description = f" - {task.description}" if task.description else ""
            print(f"[{status}] ID: {task.id} - {task.title}{description}")

    def handle_update_task(self) -> None:
        """Handle the update task workflow."""
        print("\n--- Update Task ---")
        try:
            task_id_input = input("Enter task ID to update: ").strip()
            task_id = int(task_id_input)
        except ValueError:
            print("Error: Task ID must be a number.")
            return

        task = self.storage.get_task(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found.")
            return

        print(f"Current task: [{ '✓' if task.completed else ' ' }] {task.title}")
        if task.description:
            print(f"Description: {task.description}")

        new_title = input(f"Enter new title (current: '{task.title}', press Enter to keep current): ").strip()
        if new_title == "":
            new_title = None
        elif not validate_task_title(new_title):
            print(f"Error: {self._get_title_error_message(new_title)}")
            return

        new_description_input = input(f"Enter new description (current: '{task.description or 'None'}', press Enter to keep current): ").strip()
        if new_description_input == "":
            new_description = None
        elif new_description_input.lower() == "none":
            new_description = None
        else:
            new_description = new_description_input

        if new_description and not validate_task_description(new_description):
            print(f"Error: {self._get_description_error_message(new_description)}")
            return

        if self.storage.update_task(task_id, new_title, new_description):
            print(f"Task {task_id} updated successfully.")
        else:
            print(f"Error: Failed to update task {task_id}.")

    def handle_delete_task(self) -> None:
        """Handle the delete task workflow with confirmation."""
        print("\n--- Delete Task ---")
        try:
            task_id_input = input("Enter task ID to delete: ").strip()
            task_id = int(task_id_input)
        except ValueError:
            print("Error: Task ID must be a number.")
            return

        task = self.storage.get_task(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found.")
            return

        print(f"Task to delete: [{ '✓' if task.completed else ' ' }] {task.title}")
        if task.description:
            print(f"Description: {task.description}")

        confirmation = input("Are you sure you want to delete this task? (yes/no): ").strip().lower()
        if confirmation in ['yes', 'y']:
            if self.storage.delete_task(task_id):
                print(f"Task {task_id} deleted successfully.")
            else:
                print(f"Error: Failed to delete task {task_id}.")
        else:
            print("Task deletion cancelled.")

    def handle_toggle_task(self) -> None:
        """Handle the toggle task status workflow."""
        print("\n--- Toggle Task Status ---")
        try:
            task_id_input = input("Enter task ID to toggle: ").strip()
            task_id = int(task_id_input)
        except ValueError:
            print("Error: Task ID must be a number.")
            return

        task = self.storage.get_task(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found.")
            return

        if self.storage.toggle_task_status(task_id):
            new_status = "completed" if task.completed else "incomplete"
            print(f"Task {task_id} marked as {new_status}.")
        else:
            print(f"Error: Failed to toggle task {task_id} status.")

    def _get_title_error_message(self, title: str) -> str:
        """Get an error message for an invalid task title."""
        if not isinstance(title, str):
            return "Title must be a string"
        if len(title) == 0:
            return "Title cannot be empty"
        if len(title) > 100:
            return f"Title is too long ({len(title)} characters). Maximum is 100 characters."
        return "Title is invalid"

    def _get_description_error_message(self, description: str) -> str:
        """Get an error message for an invalid task description."""
        if not isinstance(description, str):
            return "Description must be a string"
        if len(description) > 500:
            return f"Description is too long ({len(description)} characters). Maximum is 500 characters."
        return "Description is invalid"

    def run(self) -> None:
        """Start the main application loop."""
        print("Welcome to the CLI Todo Application!")
        while True:
            self.display_menu()
            choice = input("Select an option (1-6): ").strip()

            if choice == "1":
                self.handle_add_task()
            elif choice == "2":
                self.handle_view_tasks()
            elif choice == "3":
                self.handle_update_task()
            elif choice == "4":
                self.handle_delete_task()
            elif choice == "5":
                self.handle_toggle_task()
            elif choice == "6":
                print("Thank you for using the CLI Todo Application. Goodbye!")
                sys.exit(0)
            else:
                print("Invalid option. Please select a number between 1 and 6.")


def main() -> None:
    """Entry point for the application."""
    cli = TodoCLI()
    cli.run()


if __name__ == "__main__":
    main()