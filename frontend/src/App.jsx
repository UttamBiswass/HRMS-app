import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>HRMS Lite</h1>
          <p>Human Resource Management System</p>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-content">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            👥 Employees
          </button>
          <button
            className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            📅 Attendance
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'attendance' && <AttendanceManagement />}
      </main>
    </div>
  );
}

export default App;
