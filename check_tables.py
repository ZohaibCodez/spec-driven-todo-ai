import sys
sys.path.append('./backend')
from database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()
print("All tables in database:")
for table in sorted(tables):
    print(f"  - {table}")

print("\nBetter Auth related tables:")
better_auth_tables = [t for t in tables if 'better_auth' in t]
for table in better_auth_tables:
    print(f"  - {table}")
