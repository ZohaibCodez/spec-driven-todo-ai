from sqlmodel import Session, select
from backend.models import User
from backend.schemas import UserCreate, UserUpdate
from typing import Optional

class UserService:
    """
    Service class for handling user-related operations.
    """

    @staticmethod
    def create_user(user_data: UserCreate, session: Session) -> User:
        """
        Create a new user in the database.

        Args:
            user_data: User creation data
            session: Database session

        Returns:
            Created User object

        Raises:
            ValueError: If a user with the same email already exists
        """
        # Check if a user with this email already exists
        existing_user = UserService.get_user_by_email(user_data.email, session)
        if existing_user:
            raise ValueError(f"User with email {user_data.email} already exists")

        # Create user instance from the data
        user = User(
            email=user_data.email,
            name=user_data.name
        )

        # Add to session and commit
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    @staticmethod
    def get_user_by_id(user_id: int, session: Session) -> Optional[User]:
        """
        Retrieve a user by their ID.

        Args:
            user_id: The ID of the user to retrieve
            session: Database session

        Returns:
            User object if found, None otherwise
        """
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        return user

    @staticmethod
    def get_user_by_email(email: str, session: Session) -> Optional[User]:
        """
        Retrieve a user by their email.

        Args:
            email: The email of the user to retrieve
            session: Database session

        Returns:
            User object if found, None otherwise
        """
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        return user

    @staticmethod
    def update_user(user_id: int, user_update: UserUpdate, session: Session) -> Optional[User]:
        """
        Update a user's information.

        Args:
            user_id: The ID of the user to update
            user_update: User update data
            session: Database session

        Returns:
            Updated User object if found, None otherwise
        """
        user = session.get(User, user_id)
        if not user:
            return None

        # Update only provided fields
        if user_update.name is not None:
            user.name = user_update.name

        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    @staticmethod
    def delete_user_by_id(user_id: int, session: Session) -> bool:
        """
        Delete a user by their ID. This will also delete all tasks associated with the user
        due to the cascade delete relationship.

        Args:
            user_id: The ID of the user to delete
            session: Database session

        Returns:
            True if user was deleted, False if not found
        """
        user = session.get(User, user_id)
        if not user:
            return False

        # Delete the user (and all associated tasks due to cascade delete)
        session.delete(user)
        session.commit()

        return True