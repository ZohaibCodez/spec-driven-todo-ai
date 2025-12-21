import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.database import create_db_and_tables
    from backend.routes import tasks, users
    from backend.auth import routes as auth_routes
    FULL_BACKEND = True
except ImportError as e:
    print(f"Warning: Could not import backend modules: {e}")
    FULL_BACKEND = False

# Create FastAPI app instance  
app = FastAPI(
    title="Task Management API",
    description="API for managing tasks with CRUD operations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers if backend is available
if FULL_BACKEND:
    try:
        app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
        app.include_router(users.router, prefix="/api/users", tags=["Users"])
        app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
        
        # Startup event to create tables
        @app.on_event("startup")
        def on_startup():
            create_db_and_tables()
    except Exception as e:
        print(f"Error setting up routers: {e}")
        FULL_BACKEND = False

@app.get("/")
def read_root():
    return {
        "message": "Task Management API",
        "version": "1.0.0",
        "status": "online",
        "full_backend": FULL_BACKEND,
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "message": "API is running on Vercel",
        "full_backend": FULL_BACKEND
    }

@app.get("/api/test")
def test_endpoint():
    return {
        "test": "success", 
        "platform": "vercel",
        "full_backend": FULL_BACKEND
    }
