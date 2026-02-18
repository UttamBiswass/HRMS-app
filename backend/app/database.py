"""
Database configuration and session management.
Supports both SQLite (local dev) and PostgreSQL (production).
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings


def _get_engine_kwargs():
    """Engine options: SQLite needs check_same_thread; PostgreSQL uses pool_pre_ping."""
    url = settings.DATABASE_URL
    if url.startswith("sqlite"):
        return {"connect_args": {"check_same_thread": False}}
    # PostgreSQL (and others): validate connections with pool_pre_ping
    return {"pool_pre_ping": True}


# Normalize postgres:// to postgresql:// (e.g. Render, Heroku)
_db_url = settings.DATABASE_URL
if _db_url.startswith("postgres://"):
    _db_url = "postgresql://" + _db_url[len("postgres://") :]

# Create database engine
engine = create_engine(
    _db_url,
    **_get_engine_kwargs(),
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Database dependency for FastAPI endpoints
    Yields a database session and ensures it's closed after use
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database tables
    Creates all tables defined in models
    """
    from .models import employee, attendance
    Base.metadata.create_all(bind=engine)
