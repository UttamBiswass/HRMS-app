"""
Entry point for the HRMS Lite API application
"""
import uvicorn
from app.main import app
from app.config import settings

if __name__ == "__main__":
    # Note: reload=False to avoid Windows multiprocessing permission issues
    # For development with auto-reload, use: uvicorn app.main:app --reload
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False  # Set to False to avoid Windows permission errors
    )
