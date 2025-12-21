from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

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

@app.get("/")
def read_root():
    return {
        "message": "Task Management API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running on Vercel"}

@app.get("/api/test")
def test_endpoint():
    return {"test": "success", "platform": "vercel"}

# Wrap the FastAPI app with Mangum for AWS Lambda/Vercel compatibility
handler = Mangum(app)
