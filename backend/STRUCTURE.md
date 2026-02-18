# Backend Folder Structure

## Directory Layout

```
backend/
├── app/
│   ├── models/              # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── employee.py      # Employee model
│   │   └── attendance.py    # Attendance model & status enum
│   │
│   ├── schemas/             # Pydantic validation schemas
│   │   ├── __init__.py
│   │   ├── employee.py      # Employee request/response schemas
│   │   └── attendance.py    # Attendance request/response schemas
│   │
│   ├── routers/             # FastAPI route handlers
│   │   ├── __init__.py
│   │   ├── employees.py     # Employee CRUD endpoints
│   │   └── attendance.py    # Attendance endpoints
│   │
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration & settings
│   └── database.py          # Database connection & session
│
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

## Architecture Layers

### 1. Models Layer (`app/models/`)
- Database schema definitions using SQLAlchemy ORM
- Represents tables and relationships

### 2. Schemas Layer (`app/schemas/`)
- Request/response validation using Pydantic
- Input sanitization and output serialization

### 3. Routers Layer (`app/routers/`)
- API endpoint definitions
- Business logic and HTTP handling
- Uses dependency injection for database sessions

### 4. Configuration Layer (`app/config.py`)
- Centralized settings management
- Environment variable support

### 5. Database Layer (`app/database.py`)
- SQLAlchemy engine and session factory
- Database initialization
- Dependency provider for routes

## Request Flow

```
HTTP Request
    ↓
FastAPI App (main.py)
    ↓
CORS Middleware
    ↓
Router (routers/)
    ↓
Schema Validation (schemas/)
    ↓
Database Session (database.py)
    ↓
Model Operations (models/)
    ↓
Database (SQLite)
    ↓
Response (serialized via schemas)
```

## Key Design Patterns

- **Separation of Concerns**: Models, schemas, and routes are separated
- **Dependency Injection**: Database sessions injected via `Depends()`
- **Modular Routing**: Routes organized by resource
- **Configuration Management**: Settings centralized with environment support

## Adding New Features

To add a new resource (e.g., "departments"):

1. Create model in `app/models/department.py`
2. Create schemas in `app/schemas/department.py`
3. Create router in `app/routers/departments.py`
4. Register router in `app/main.py`

---

**For complete documentation, see [README.md](README.md)**
