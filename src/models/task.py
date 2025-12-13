"""Task dataclass definition for the CLI Todo Application."""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Task:
    """Represents a single todo item with attributes: ID, title, description, and completion status."""

    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False

    def __post_init__(self) -> None:
        """Validate task attributes after initialization."""
        if not isinstance(self.id, int) or self.id <= 0:
            raise ValueError(f"Task ID must be a positive integer, got {self.id}")

        if not isinstance(self.title, str) or not (1 <= len(self.title) <= 100):
            raise ValueError(f"Task title must be 1-100 characters, got {len(self.title) if isinstance(self.title, str) else 'non-string'}")

        if self.description is not None and (not isinstance(self.description, str) or len(self.description) > 500):
            raise ValueError(f"Task description must be 0-500 characters, got {len(self.description) if isinstance(self.description, str) else 'non-string'}")

        if not isinstance(self.completed, bool):
            raise ValueError(f"Task completion status must be boolean, got {type(self.completed)}")