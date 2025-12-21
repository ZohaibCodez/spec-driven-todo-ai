import sys
sys.path.append('./backend')
from database import engine
from sqlalchemy import inspect, text

inspector = inspect(engine)

# Check better_auth_user table structure
print("=== better_auth_user table structure ===")
columns = inspector.get_columns('better_auth_user')
for col in columns:
    print(f"  {col['name']}: {col['type']} {'NOT NULL' if not col['nullable'] else 'NULL'}")

print("\n=== better_auth_session table structure ===")
columns = inspector.get_columns('better_auth_session')
for col in columns:
    print(f"  {col['name']}: {col['type']} {'NOT NULL' if not col['nullable'] else 'NULL'}")

print("\n=== better_auth_account table structure ===")
columns = inspector.get_columns('better_auth_account')
for col in columns:
    print(f"  {col['name']}: {col['type']} {'NOT NULL' if not col['nullable'] else 'NULL'}")

# Try to query a user to see if there are any existing users
print("\n=== Testing database connection ===")
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM better_auth_user"))
    count = result.scalar()
    print(f"Total users in better_auth_user: {count}")
