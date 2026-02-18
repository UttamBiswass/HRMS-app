"""
Configuration settings for the HRMS Lite application
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "HRMS Lite API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database: PostgreSQL (default). Override with DATABASE_URL env var for production.
    DATABASE_URL: str = "postgresql://hrms_user:hrms123@localhost:5432/hrms_db"
    
    # CORS - Support environment variable for production (comma-separated origins)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,https://hrms-app-one.vercel.app,https://hrms-app-uttambiswass-projects.vercel.app"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = int(os.environ.get("PORT", 8000))
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from string"""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
