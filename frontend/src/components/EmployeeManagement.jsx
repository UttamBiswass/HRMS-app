import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees. Please try again later.');
      console.error('Error fetching employees:', err);
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
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id.trim()) {
      errors.employee_id = 'Employee ID is required';
    }
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
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
      await employeeAPI.create(formData);
      setShowModal(false);
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
      setFormErrors({});
      fetchEmployees();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to add employee';
      setError(errorMessage);
      console.error('Error creating employee:', err);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee? This will also delete all their attendance records.')) {
      return;
    }

    try {
      setError(null);
      await employeeAPI.delete(employeeId);
      fetchEmployees();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete employee';
      setError(errorMessage);
      console.error('Error deleting employee:', err);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setFormData({
      employee_id: '',
      full_name: '',
      email: '',
      department: '',
    });
    setFormErrors({});
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      employee_id: '',
      full_name: '',
      email: '',
      department: '',
    });
    setFormErrors({});
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

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Employee Management</h2>
          <button className="btn btn-primary" onClick={openModal}>
            + Add Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3 className="empty-state-title">No Employees Found</h3>
            <p className="empty-state-text">
              Get started by adding your first employee to the system.
            </p>
            <button className="btn btn-primary" onClick={openModal}>
              + Add Your First Employee
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.employee_id}</td>
                    <td>{employee.full_name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn danger"
                          onClick={() => handleDelete(employee.employee_id)}
                          title="Delete Employee"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
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
              <h3 className="modal-title">Add New Employee</h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label className="form-label required">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    className={`form-input ${formErrors.employee_id ? 'error' : ''}`}
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    placeholder="e.g., EMP001"
                  />
                  {formErrors.employee_id && (
                    <span className="form-error">{formErrors.employee_id}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    className={`form-input ${formErrors.full_name ? 'error' : ''}`}
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                  />
                  {formErrors.full_name && (
                    <span className="form-error">{formErrors.full_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., john.doe@company.com"
                  />
                  {formErrors.email && (
                    <span className="form-error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Department</label>
                  <select
                    name="department"
                    className={`form-select ${formErrors.department ? 'error' : ''}`}
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                  {formErrors.department && (
                    <span className="form-error">{formErrors.department}</span>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
