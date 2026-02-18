# HRMS Lite - Human Resource Management System

A lightweight, full-stack web application for managing employee records and tracking daily attendance.

## 🚀 Features

### Employee Management
- ✅ Add new employees with unique ID, name, email, and department
- ✅ View all employees in a clean, organized table
- ✅ Delete employees (with cascading deletion of attendance records)
- ✅ Automatic validation for duplicate employee IDs and emails
- ✅ Email format validation

### Attendance Management
- ✅ Mark daily attendance (Present/Absent) for employees
- ✅ View all attendance records across all employees
- ✅ Filter attendance by specific employee
- ✅ **Filter attendance by date range** (Start date & End date)
- ✅ Automatic update if attendance already exists for a date
- ✅ Date validation (cannot mark future attendance)

### Dashboard & Analytics
- ✅ **Dashboard with summary statistics**
  - Total employees count
  - Total attendance records
  - Total present/absent days
  - Overall attendance rate
- ✅ **Department-wise employee breakdown**
- ✅ **Employee attendance statistics**
  - Total present days per employee
  - Total absent days per employee
  - Attendance rate with color coding
  - Sortable table view

### User Experience
- ✅ Clean, modern, professional UI
- ✅ Responsive design for all screen sizes
- ✅ Loading states with spinners
- ✅ Empty states with helpful messages
- ✅ Error handling with meaningful messages
- ✅ Success notifications
- ✅ Confirmation dialogs for destructive actions

> **Note**: All bonus features (date filtering, present days display, and dashboard summary) have been implemented. See [BONUS_FEATURES.md](./BONUS_FEATURES.md) for detailed documentation.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Validation**: Pydantic models with Pydantic Settings
- **Architecture**: Modular structure (Models, Schemas, Routers)
- **API**: RESTful endpoints with proper HTTP status codes

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Custom CSS (no external UI libraries)

## 📁 Project Structure

```
Task/
├── backend/
│   ├── app/
│   │   ├── models/              # Database models
│   │   │   ├── employee.py
│   │   │   └── attendance.py
│   │   ├── schemas/             # Pydantic schemas
│   │   │   ├── employee.py
│   │   │   └── attendance.py
│   │   ├── routers/             # API endpoints
│   │   │   ├── employees.py
│   │   │   └── attendance.py
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # Database setup
│   │   └── main.py              # FastAPI app
│   ├── main.py                  # Entry point
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeManagement.jsx
│   │   │   └── AttendanceManagement.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── QUICKSTART.md
```

## 🚦 Getting Started

### Prerequisites
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: 8 or higher

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python main.py
```

The backend API will be available at: **http://localhost:8000**

API documentation (Swagger UI): **http://localhost:8000/docs**

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## 📡 API Endpoints

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{employee_id}` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| DELETE | `/api/employees/{employee_id}` | Delete employee |

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get all attendance records |
| GET | `/api/attendance/{employee_id}` | Get attendance for specific employee |
| POST | `/api/attendance` | Mark attendance (create or update) |

## 📝 API Request Examples

### Create Employee
```bash
POST http://localhost:8000/api/employees
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering"
}
```

### Mark Attendance
```bash
POST http://localhost:8000/api/attendance
Content-Type: application/json

{
  "employee_id": "EMP001",
  "date": "2026-02-14",
  "status": "Present"
}
```

## ✅ Validation Rules

### Employee
- **Employee ID**: Required, unique, non-empty
- **Full Name**: Required, non-empty
- **Email**: Required, unique, valid email format
- **Department**: Required, non-empty

### Attendance
- **Employee ID**: Required, must exist in employees table
- **Date**: Required, cannot be in the future
- **Status**: Required, must be "Present" or "Absent"

## 🎨 UI Features

### Professional Design
- Modern gradient header
- Sticky navigation bar
- Card-based layout
- Smooth transitions and hover effects
- Color-coded status badges
- Modal dialogs for forms

### States Handled
- **Loading**: Spinner animation while fetching data
- **Empty**: Helpful empty state messages with call-to-action
- **Error**: Red alert banners with clear error messages
- **Success**: Green alert banners for successful actions

### Responsive Design
- Desktop: Full-width table layout
- Tablet: Adjusted spacing and font sizes
- Mobile: Stacked forms and optimized table view

## 🧪 Testing the Application

### Manual Testing Steps

1. **Add Employees**:
   - Go to "Employees" tab
   - Click "+ Add Employee"
   - Fill in the form with valid data
   - Verify employee appears in the table

2. **Validation Testing**:
   - Try adding duplicate employee ID (should show error)
   - Try adding duplicate email (should show error)
   - Try invalid email format (should show error)
   - Try empty fields (should show validation errors)

3. **Mark Attendance**:
   - Go to "Attendance" tab
   - Click "+ Mark Attendance"
   - Select an employee and date
   - Mark as Present or Absent
   - Verify attendance appears in the table

4. **View Employee Attendance**:
   - In attendance table, click "View All" for an employee
   - Verify only that employee's records are shown
   - Click "Back to All" to return

5. **Delete Employee**:
   - In employees table, click delete icon
   - Confirm deletion
   - Verify employee and their attendance records are removed

## 🔒 Security Considerations

For production deployment, consider adding:
- Authentication and authorization (JWT tokens)
- Input sanitization
- Rate limiting
- HTTPS/SSL certificates
- Environment variables for configuration
- Database migrations
- Logging and monitoring
- CORS restriction to specific domains

## 🚀 Production Deployment

### Backend Deployment

1. Use a production-ready database (PostgreSQL, MySQL)
2. Update database connection string
3. Set up environment variables
4. Use a production ASGI server (Gunicorn with Uvicorn workers)
5. Deploy to cloud platform (AWS, GCP, Azure, Heroku)

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `dist` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting service

3. Update API base URL in `src/services/api.js` to production backend URL

## 📊 Database Schema

### employees
| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | Primary Key, Auto-increment |
| employee_id | String | Unique, Not Null |
| full_name | String | Not Null |
| email | String | Unique, Not Null |
| department | String | Not Null |

### attendance
| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | Primary Key, Auto-increment |
| employee_id | String | Not Null, Foreign Key |
| date | Date | Not Null |
| status | Enum | Not Null (Present/Absent) |

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Module not found:**
```bash
pip install -r requirements.txt --upgrade
```

### Frontend Issues

**Port 3000 already in use:**
- Edit `vite.config.js` and change the port number

**Dependencies error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection refused:**
- Ensure backend is running on port 8000
- Check API_BASE_URL in `src/services/api.js`
- Verify CORS settings in `main.py`

## 📄 License

This project is created as a coding assignment and is free to use for educational purposes.

## 👨‍💻 Development Time

Estimated development time: **6-8 hours**

Includes:
- Backend API development
- Database schema design
- Frontend UI development
- Form validation
- Error handling
- Documentation

---

**Built with ❤️ using FastAPI and React**
