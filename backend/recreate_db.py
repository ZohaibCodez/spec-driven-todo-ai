#!/usr/bin/env python3
"""
Script to recreate the database tables for the authentication system.
"""
import sys
import os

# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, create_db_and_tables
from sqlmodel import SQLModel

def recreate_tables():
    """Drop and recreate all tables to match the current models."""
    print("Dropping and recreating all tables...")

    # Drop all tables
    SQLModel.metadata.drop_all(engine)
    print("All tables dropped.")

    # Create all tables
    create_db_and_tables()
    print("All tables recreated with the new schema.")

    # Verify the tables were created
    from sqlalchemy import text
    with engine.connect() as conn:
        # List all tables
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"))
        tables = [row[0] for row in result]
        print(f"Tables in database: {tables}")

        # Check the user table structure if it exists
        if 'user' in tables:
            result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user' ORDER BY ordinal_position;"))
            columns = result.fetchall()
            print("Columns in 'user' table:")
            for col in columns:
                print(f"  - {col[0]} ({col[1]})")

if __name__ == "__main__":
    recreate_tables()