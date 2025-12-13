from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
from dotenv import load_dotenv
import os
from models import User, Task  # Import models to register them

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Create engine
engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    """Create database tables for all registered models."""
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@contextmanager
def get_db_session():
    """Context manager for database sessions."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()