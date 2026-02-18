# HRMS Lite Backend

FastAPI-based REST API for Human Resource Management System

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application and routes setup
│   ├── config.py            # Configuration and settings
│   ├── database.py          # Database configuration and session management
│   │
│   ├── models/              # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── employee.py      # Employee model
│   │   └── attendance.py    # Attendance model
│   │
│   ├── schemas/             # Pydantic schemas for validation
│   │   ├── __init__.py
│   │   ├── employee.py      # Employee request/response schemas
│   │   └── attendance.py    # Attendance request/response schemas
│   │
│   └── routers/             # API route handlers
│       ├── __init__.py
│       ├── employees.py     # Employee endpoints
│       └── attendance.py    # Attendance endpoints
│
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
├── .gitignore
└── README.md
```

## 🏗️ Architecture Overview

### **Separation of Concerns**

1. **Models** (`app/models/`): Database schema definitions using SQLAlchemy ORM
2. **Schemas** (`app/schemas/`): Request/response validation using Pydantic
3. **Routers** (`app/routers/`): API endpoint handlers organized by resource
4. **Database** (`app/database.py`): Database connection and session management
5. **Config** (`app/config.py`): Centralized configuration using Pydantic Settings

### **Design Patterns**

- **Dependency Injection**: Database sessions injected via FastAPI's `Depends()`
- **Repository Pattern**: Data access logic encapsulated in route handlers
- **Schema Validation**: Automatic validation using Pydantic models
- **Modular Routing**: Routes organized by resource for scalability

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment** (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

### Running the Server

**Development mode** (with auto-reload):
```bash
python main.py
```

**Production mode**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{employee_id}` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| DELETE | `/api/employees/{employee_id}` | Delete employee |
| GET | `/api/employees/dashboard/summary` | Get dashboard summary statistics |

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get all attendance records |
| GET | `/api/attendance?employee_id={id}` | Filter attendance by employee |
| GET | `/api/attendance?start_date={date}&end_date={date}` | Filter by date range |
| GET | `/api/attendance/{employee_id}` | Get employee's attendance |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/attendance/stats/by-employee` | Get attendance stats for all employees |
| GET | `/api/attendance/stats/{employee_id}` | Get attendance stats for specific employee |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |

## 🔧 Configuration

Edit `app/config.py` to customize:

```python
class Settings(BaseSettings):
    APP_NAME: str = "HRMS Lite API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql://hrms_user:hrms123@localhost:5432/hrms_db"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    HOST: str = "0.0.0.0"
    PORT: int = 8000
```

### Environment Variables

Create a `.env` file for custom configuration:

```env
DATABASE_URL=postgresql://hrms_user:hrms123@localhost:5432/hrms_db
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

## 🗄️ Database Models

### Employee Model
```python
class Employee(Base):
    id: int                    # Primary key
    employee_id: str           # Unique identifier
    full_name: str             # Employee name
    email: str                 # Unique email
    department: str            # Department name
```

### Attendance Model
```python
class Attendance(Base):
    id: int                    # Primary key
    employee_id: str           # Foreign key reference
    date: date                 # Attendance date
    status: AttendanceStatus   # Present/Absent enum
```

## 📝 Schema Validation

### Employee Creation
```python
class EmployeeCreate(BaseModel):
    employee_id: str           # Required, unique, trimmed
    full_name: str             # Required, trimmed
    email: EmailStr            # Required, valid email format
    department: str            # Required, trimmed
```

### Attendance Creation
```python
class AttendanceCreate(BaseModel):
    employee_id: str           # Required, must exist
    date: date                 # Required, ISO format
    status: AttendanceStatus   # Required, Present/Absent
```

## 🛡️ Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error message description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🧪 Testing

### Using Swagger UI
1. Start the server
2. Navigate to http://localhost:8000/docs
3. Use "Try it out" to test endpoints

### Using cURL

**Create Employee**:
```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }'
```

**Mark Attendance**:
```bash
curl -X POST http://localhost:8000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2026-02-14",
    "status": "Present"
  }'
```

**Filter Attendance by Date Range**:
```bash
curl "http://localhost:8000/api/attendance?start_date=2026-02-01&end_date=2026-02-14"
```

**Get Employee Attendance Stats**:
```bash
curl http://localhost:8000/api/attendance/stats/EMP001
```

**Get Dashboard Summary**:
```bash
curl http://localhost:8000/api/employees/dashboard/summary
```

## 📦 Dependencies

- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type hints
- **Pydantic Settings**: Settings management

## 🔒 Security Considerations

For production deployment:

1. **Database**: Use PostgreSQL/MySQL instead of SQLite
2. **Authentication**: Add JWT token authentication
3. **HTTPS**: Enable SSL/TLS certificates
4. **Rate Limiting**: Implement API rate limiting
5. **Input Sanitization**: Additional validation layers
6. **CORS**: Restrict to specific domains
7. **Environment Variables**: Store sensitive data securely
8. **Logging**: Implement comprehensive logging
9. **Monitoring**: Add health checks and metrics

## 🚀 Production Deployment

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t hrms-backend .
docker run -p 8000:8000 hrms-backend
```

### Using Gunicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📊 Database Migration

For schema changes, consider using **Alembic**:

```bash
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🐛 Troubleshooting

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

### Database Connection Issues
```bash
# Ensure PostgreSQL is running and hrms_db exists
# Default URL: postgresql://hrms_user:hrms123@localhost:5432/hrms_db
# Restart server after fixing connection
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 🤝 Contributing

To add new features:

1. Create new model in `app/models/`
2. Create corresponding schema in `app/schemas/`
3. Create router in `app/routers/`
4. Include router in `app/main.py`

---

**Built with FastAPI ⚡**
