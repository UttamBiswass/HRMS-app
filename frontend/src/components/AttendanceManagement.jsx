import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
  });
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters for attendance
      const attendanceParams = {};
      if (filters.employee_id) attendanceParams.employee_id = filters.employee_id;
      if (filters.start_date) attendanceParams.start_date = filters.start_date;
      if (filters.end_date) attendanceParams.end_date = filters.end_date;
      
      const [employeesRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll(attendanceParams),
      ]);
      setEmployees(employeesRes.data);
      setAttendance(attendanceRes.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id) {
      errors.employee_id = 'Please select an employee';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await attendanceAPI.create(formData);
      setShowModal(false);
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      setFormErrors({});
      setSuccess('Attendance marked successfully!');
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to mark attendance';
      setError(errorMessage);
      console.error('Error marking attendance:', err);
    }
  };

  const viewEmployeeAttendance = async (employee) => {
    try {
      setSelectedEmployee(employee);
      const response = await attendanceAPI.getByEmployeeId(employee.employee_id);
      setAttendance(response.data);
    } catch (err) {
      setError('Failed to fetch employee attendance');
      console.error('Error fetching employee attendance:', err);
    }
  };

  const showAllAttendance = () => {
    setSelectedEmployee(null);
    setFilters({
      employee_id: '',
      start_date: '',
      end_date: '',
    });
    fetchData();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const clearFilters = () => {
    setFilters({
      employee_id: '',
      start_date: '',
      end_date: '',
    });
    setTimeout(() => fetchData(), 0);
  };

  const openModal = () => {
    setShowModal(true);
    setFormData({
      employee_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
    });
    setFormErrors({});
    setError(null);
    setSuccess(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      employee_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
    });
    setFormErrors({});
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {selectedEmployee
              ? `Attendance - ${selectedEmployee.full_name}`
              : 'Attendance Management'}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedEmployee && (
              <button className="btn btn-secondary" onClick={showAllAttendance}>
                ← Back to All
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={openModal}
              disabled={employees.length === 0}
            >
              + Mark Attendance
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {!selectedEmployee && employees.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: '#f8f9fa'
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600' }}>
              Filter Attendance Records
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Employee</label>
                <select
                  name="employee_id"
                  className="form-select"
                  value={filters.employee_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Employees</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.employee_id}>
                      {employee.employee_id} - {employee.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-input"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-input"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={applyFilters}>
                Apply Filters
              </button>
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No Employees Available</h3>
            <p className="empty-state-text">
              Please add employees before marking attendance.
            </p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3 className="empty-state-title">No Attendance Records</h3>
            <p className="empty-state-text">
              Start tracking attendance by marking employee presence.
            </p>
            <button className="btn btn-primary" onClick={openModal}>
              + Mark First Attendance
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  {!selectedEmployee && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.employee_id}</td>
                    <td>{getEmployeeName(record.employee_id)}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      <span
                        className={`badge ${
                          record.status === 'Present'
                            ? 'badge-success'
                            : 'badge-danger'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    {!selectedEmployee && (
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            const emp = employees.find(
                              (e) => e.employee_id === record.employee_id
                            );
                            if (emp) viewEmployeeAttendance(emp);
                          }}
                        >
                          View All
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Mark Attendance</h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label className="form-label required">Employee</label>
                  <select
                    name="employee_id"
                    className={`form-select ${formErrors.employee_id ? 'error' : ''}`}
                    value={formData.employee_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.employee_id}>
                        {employee.employee_id} - {employee.full_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.employee_id && (
                    <span className="form-error">{formErrors.employee_id}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Date</label>
                  <input
                    type="date"
                    name="date"
                    className={`form-input ${formErrors.date ? 'error' : ''}`}
                    value={formData.date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.date && (
                    <span className="form-error">{formErrors.date}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Status</label>
                  <select
                    name="status"
                    className={`form-select ${formErrors.status ? 'error' : ''}`}
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                  {formErrors.status && (
                    <span className="form-error">{formErrors.status}</span>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
