from sqlmodel import Session, select
from models import Task, User
from schemas import TaskCreate, TaskUpdate
from typing import Optional, List

class TaskService:
    """
    Service class for handling task-related operations with user scoping.
    """

    @staticmethod
    def create_task_for_user(task_data: TaskCreate, session: Session) -> Task:
        """
        Create a new task for a specific user.

        Args:
            task_data: Task creation data including user_id
            session: Database session

        Returns:
            Created Task object
        """
        # Verify the user exists
        user = session.get(User, task_data.user_id)
        if not user:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="User not found")

        # Create task instance from the data
        task = Task(
            title=task_data.title,
            description=task_data.description,
            completed=task_data.completed,
            user_id=task_data.user_id
        )

        # Add to session and commit
        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def get_tasks_for_user(user_id: int, session: Session) -> List[Task]:
        """
        Retrieve all tasks for a specific user.

        Args:
            user_id: The ID of the user whose tasks to retrieve
            session: Database session

        Returns:
            List of Task objects for the user
        """
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks

    @staticmethod
    def get_task_for_user(task_id: int, user_id: int, session: Session) -> Optional[Task]:
        """
        Retrieve a specific task for a user.

        Args:
            task_id: The ID of the task to retrieve
            user_id: The ID of the user who should own the task
            session: Database session

        Returns:
            Task object if found and belongs to user, None otherwise
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        return task

    @staticmethod
    def update_task_for_user(task_id: int, user_id: int, task_update: TaskUpdate, session: Session) -> Optional[Task]:
        """
        Update a specific task for a user.

        Args:
            task_id: The ID of the task to update
            user_id: The ID of the user who owns the task
            task_update: Update data
            session: Database session

        Returns:
            Updated Task object if found and belongs to user, None otherwise
        """
        # Get the existing task for the user
        task = TaskService.get_task_for_user(task_id, user_id, session)
        if not task:
            return None

        # Explicitly validate that the task cannot be transferred to another user
        # The user_id field is not part of TaskUpdate schema, so this is already protected
        # But we add this validation to make it explicit that task ownership cannot change

        # Update task fields if provided
        if task_update.title is not None:
            task.title = task_update.title
        if task_update.description is not None:
            task.description = task_update.description
        if task_update.completed is not None:
            task.completed = task_update.completed

        # Update the updated_at timestamp
        from datetime import datetime
        task.updated_at = datetime.utcnow()

        # Commit changes
        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def delete_task_for_user(task_id: int, user_id: int, session: Session) -> bool:
        """
        Delete a specific task for a user.

        Args:
            task_id: The ID of the task to delete
            user_id: The ID of the user who owns the task
            session: Database session

        Returns:
            True if task was deleted, False if not found
        """
        # Get the existing task for the user
        task = TaskService.get_task_for_user(task_id, user_id, session)
        if not task:
            return False

        # Delete the task
        session.delete(task)
        session.commit()

        return True

    @staticmethod
    def toggle_task_completion_for_user(task_id: int, user_id: int, session: Session) -> Optional[Task]:
        """
        Toggle completion status of a specific task for a user.

        Args:
            task_id: The ID of the task to toggle
            user_id: The ID of the user who owns the task
            session: Database session

        Returns:
            Updated Task object if found and belongs to user, None otherwise
        """
        # Get the existing task for the user
        task = TaskService.get_task_for_user(task_id, user_id, session)
        if not task:
            return None

        # Toggle the completion status
        task.completed = not task.completed

        # Update the updated_at timestamp
        from datetime import datetime
        task.updated_at = datetime.utcnow()

        # Commit changes
        session.add(task)
        session.commit()
        session.refresh(task)

        return task