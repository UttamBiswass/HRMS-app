import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [employeeStats, setEmployeeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, statsRes] = await Promise.all([
        employeeAPI.getDashboardSummary(),
        attendanceAPI.getStatsByEmployee(),
      ]);
      setDashboardData(summaryRes.data);
      setEmployeeStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again later.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span className="alert-icon">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dashboard Overview</h2>
        </div>

        {/* Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          padding: '1.5rem'
        }}>
          <div className="stat-card" style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {dashboardData?.total_employees || 0}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Total Employees
            </div>
          </div>

          <div className="stat-card" style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {dashboardData?.total_attendance_records || 0}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Total Records
            </div>
          </div>

          <div className="stat-card" style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {dashboardData?.total_present || 0}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Present Days
            </div>
          </div>

          <div className="stat-card" style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {dashboardData?.overall_attendance_rate || 0}%
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
              Attendance Rate
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      {dashboardData?.department_breakdown && dashboardData.department_breakdown.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">Department Breakdown</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employee Count</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.department_breakdown.map((dept, index) => (
                  <tr key={index}>
                    <td>{dept.department}</td>
                    <td>
                      <span className="badge badge-primary">{dept.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Attendance Statistics */}
      {employeeStats.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">Employee Attendance Statistics</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Total Days</th>
                  <th>Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {employeeStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.employee_id}</td>
                    <td>{stat.full_name}</td>
                    <td>{stat.department}</td>
                    <td>
                      <span className="badge badge-success">{stat.total_present}</span>
                    </td>
                    <td>
                      <span className="badge badge-danger">{stat.total_absent}</span>
                    </td>
                    <td>{stat.total_days}</td>
                    <td>
                      <span 
                        className={`badge ${
                          stat.attendance_rate >= 90 
                            ? 'badge-success' 
                            : stat.attendance_rate >= 75 
                            ? 'badge-warning' 
                            : 'badge-danger'
                        }`}
                      >
                        {stat.attendance_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {employeeStats.length === 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3 className="empty-state-title">No Attendance Data</h3>
            <p className="empty-state-text">
              Start tracking attendance to see statistics here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
