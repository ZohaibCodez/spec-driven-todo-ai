from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

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

# Include routes
from routes import tasks
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Task Management API", "status": "running"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}