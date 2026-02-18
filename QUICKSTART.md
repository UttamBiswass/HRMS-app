# HRMS Lite - Quick Start Guide

This guide will help you get the HRMS Lite application up and running in minutes.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] npm 8+ installed

Check versions:
```bash
python --version
node --version
npm --version
```

## Step 1: Backend Setup (5 minutes)

### 1.1 Open Terminal/PowerShell
Navigate to the backend directory:
```bash
cd c:\Users\mi\Desktop\Task\backend
```

### 1.2 Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### 1.3 Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic

### 1.4 Start Backend Server
```bash
python main.py
```

Expected output:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend is now running at **http://localhost:8000**

Keep this terminal window open!

## Step 2: Frontend Setup (5 minutes)

### 2.1 Open New Terminal/PowerShell
Navigate to the frontend directory:
```bash
cd c:\Users\mi\Desktop\Task\frontend
```

### 2.2 Install Dependencies
```bash
npm install
```

This will install:
- React
- Vite
- Axios
- Development tools

### 2.3 Start Frontend Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

✅ Frontend is now running at **http://localhost:3000**

## Step 3: Access the Application

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the HRMS Lite application!

## Step 4: Test the Application

### Add Your First Employee

1. Click on the **"Employees"** tab (should be selected by default)
2. Click **"+ Add Employee"** button
3. Fill in the form:
   - Employee ID: `EMP001`
   - Full Name: `John Doe`
   - Email: `john.doe@company.com`
   - Department: `Engineering`
4. Click **"Add Employee"**
5. Employee should appear in the table

### Mark Attendance

1. Click on the **"Attendance"** tab
2. Click **"+ Mark Attendance"** button
3. Fill in the form:
   - Select Employee: `EMP001 - John Doe`
   - Date: Select today's date
   - Status: `Present`
4. Click **"Mark Attendance"**
5. Attendance record should appear in the table

### View Employee-Specific Attendance

1. In the Attendance tab, click **"View All"** button for an employee
2. You'll see only that employee's attendance records
3. Click **"← Back to All"** to return to all records

## API Documentation

The backend provides interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test all API endpoints directly from the Swagger UI.

## Stopping the Application

### Stop Frontend
In the frontend terminal, press: **Ctrl + C**

### Stop Backend
In the backend terminal, press: **Ctrl + C**

### Deactivate Virtual Environment (if using)
```bash
deactivate
```

## Restarting the Application

### Backend
```bash
cd c:\Users\mi\Desktop\Task\backend
venv\Scripts\activate
python main.py
```

### Frontend
```bash
cd c:\Users\mi\Desktop\Task\frontend
npm run dev
```

## Troubleshooting

### Backend Issues

**Problem: Port 8000 is already in use**
```bash
# Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

**Problem: Module not found error**
```bash
# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

**Problem: Database file is locked**
- Stop the backend server
- Delete `hrms.db` file
- Restart the backend (database will be recreated)

### Frontend Issues

**Problem: Port 3000 is already in use**
- Edit `vite.config.js`
- Change port from 3000 to 3001
- Restart frontend

**Problem: Cannot connect to backend**
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify `API_BASE_URL` in `src/services/api.js`

**Problem: npm install fails**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Project Structure Quick Reference

```
Task/
├── backend/
│   ├── main.py              ← Main API file
│   ├── requirements.txt     ← Python dependencies
│   └── hrms.db              ← SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/      ← React components
│   │   ├── services/        ← API calls
│   │   ├── App.jsx          ← Main app
│   │   └── index.css        ← Styles
│   ├── package.json         ← Node dependencies
│   └── vite.config.js       ← Vite configuration
│
└── README.md                ← Full documentation
```

## Key Features to Test

- [ ] Add multiple employees
- [ ] Test duplicate employee ID validation
- [ ] Test duplicate email validation
- [ ] Test invalid email format
- [ ] Mark attendance for today
- [ ] Mark attendance for past date
- [ ] Try marking future attendance (should fail)
- [ ] View all attendance records
- [ ] Filter attendance by employee
- [ ] Delete an employee
- [ ] Verify cascading delete (attendance removed too)

## Next Steps

1. **Customize Departments**: Edit department options in `EmployeeManagement.jsx`
2. **Add More Features**: Extend the application with additional functionality
3. **Deploy**: Follow deployment guide in main README.md
4. **Secure**: Add authentication and authorization for production use

## Support

- Check **README.md** for detailed documentation
- Check **API_DOCUMENTATION.md** for API reference
- Visit http://localhost:8000/docs for interactive API testing

---

**Happy HR Management! 🎉**
