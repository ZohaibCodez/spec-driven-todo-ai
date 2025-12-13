"""
Quickstart validation script to ensure setup instructions work correctly
"""
import os
import sys
from pathlib import Path

def validate_setup():
    print("Validating Backend API Setup...")

    # Check if required files exist
    required_files = [
        "main.py",
        "models.py",
        "database.py",
        "schemas.py",
        "requirements.txt",
        "routes/tasks.py",
        ".env",
        "README.md"
    ]

    all_present = True
    for file in required_files:
        if not Path(file).exists():
            print(f"❌ Missing file: {file}")
            all_present = False
        else:
            print(f"✅ Found file: {file}")

    # Check requirements.txt content
    if Path("requirements.txt").exists():
        with open("requirements.txt", "r") as f:
            content = f.read()
            required_deps = ["fastapi", "sqlmodel", "uvicorn", "python-dotenv", "psycopg2-binary"]

            for dep in required_deps:
                if dep in content:
                    print(f"✅ Found dependency: {dep}")
                else:
                    print(f"❌ Missing dependency: {dep}")
                    all_present = False

    # Check .env file
    if Path(".env").exists():
        with open(".env", "r") as f:
            content = f.read()
            required_vars = ["DATABASE_URL", "SECRET_KEY", "DEBUG"]

            for var in required_vars:
                if var in content:
                    print(f"✅ Found environment variable: {var}")
                else:
                    print(f"❌ Missing environment variable: {var}")

    if all_present:
        print("\n🎉 All setup validation checks passed!")
        print("\nTo run the application:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Set up your database and update DATABASE_URL in .env")
        print("3. Run: uvicorn main:app --reload")
        print("4. Visit: http://localhost:8000 to see the API")
        print("5. API documentation available at: http://localhost:8000/docs")
    else:
        print("\n❌ Some validation checks failed. Please check the missing items above.")

    return all_present

if __name__ == "__main__":
    validate_setup()