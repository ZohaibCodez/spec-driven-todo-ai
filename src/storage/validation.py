"""Validation functions for task attributes."""


def validate_task_title(title: str) -> bool:
    """Validate that a task title is 1-100 characters.

    Args:
        title: The title to validate

    Returns:
        True if the title is valid, False otherwise
    """
    if not isinstance(title, str):
        return False
    return 1 <= len(title) <= 100


def validate_task_description(description: str) -> bool:
    """Validate that a task description is 0-500 characters.

    Args:
        description: The description to validate

    Returns:
        True if the description is valid, False otherwise
    """
    if description is None:
        return True  # Description is optional
    if not isinstance(description, str):
        return False
    return len(description) <= 500


def get_title_error_message(title: str) -> str:
    """Get an error message for an invalid task title.

    Args:
        title: The invalid title

    Returns:
        A descriptive error message
    """
    if not isinstance(title, str):
        return "Title must be a string"
    if len(title) == 0:
        return "Title cannot be empty"
    if len(title) > 100:
        return f"Title is too long ({len(title)} characters). Maximum is 100 characters."
    return "Title is invalid"


def get_description_error_message(description: str) -> str:
    """Get an error message for an invalid task description.

    Args:
        description: The invalid description

    Returns:
        A descriptive error message
    """
    if description is None:
        return ""  # No error for None (optional field)
    if not isinstance(description, str):
        return "Description must be a string"
    if len(description) > 500:
        return f"Description is too long ({len(description)} characters). Maximum is 500 characters."
    return "Description is invalid"