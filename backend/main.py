import sys
import os
# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from database import create_db_and_tables

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="Task Management API",
    description="API for managing tasks with CRUD operations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routes
from routes import tasks, users
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(users.router, prefix="/api", tags=["users"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Task Management API", "status": "running"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}