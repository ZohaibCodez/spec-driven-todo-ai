import sys
import os
# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from database import create_db_and_tables
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="Task Management API with Authentication",
    description="API for managing tasks with CRUD operations and JWT-based authentication",
    version="1.0.0",
    contact={
        "name": "API Support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware - Updated to be more specific for frontend integration
frontend_url = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Allow credentials for JWT cookies if used
    allow_credentials=True,
)

# Initialize database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routes
from routes import tasks, users
from auth.routes import router as auth_router

app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(auth_router)  # Authentication routes at /auth

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Task Management API", "status": "running"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}