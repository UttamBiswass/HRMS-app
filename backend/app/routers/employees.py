"""
Employee API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict

from ..database import get_db
from ..models.employee import Employee
from ..models.attendance import Attendance
from ..schemas.employee import EmployeeCreate, EmployeeResponse

router = APIRouter(
    prefix="/api/employees",
    tags=["employees"]
)


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """
    Create a new employee
    
    - **employee_id**: Unique employee identifier
    - **full_name**: Employee's full name
    - **email**: Employee's email address (must be unique)
    - **department**: Department name
    """
    try:
        # Check for duplicate employee_id
        existing_employee = db.query(Employee).filter(
            Employee.employee_id == employee.employee_id
        ).first()
        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee with ID '{employee.employee_id}' already exists"
            )
        
        # Check for duplicate email
        existing_email = db.query(Employee).filter(
            Employee.email == employee.email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee with email '{employee.email}' already exists"
            )
        
        # Create new employee
        db_employee = Employee(**employee.dict())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create employee: {str(e)}"
        )


@router.get("", response_model=List[EmployeeResponse])
async def get_employees(db: Session = Depends(get_db)):
    """
    Retrieve all employees
    
    Returns a list of all employees in the system
    """
    employees = db.query(Employee).all()
    return employees


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a specific employee by ID
    
    - **employee_id**: The unique employee identifier
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """
    Delete an employee and all associated attendance records
    
    - **employee_id**: The unique employee identifier
    """
    try:
        employee = db.query(Employee).filter(
            Employee.employee_id == employee_id
        ).first()
        
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )
        
        # Delete associated attendance records (cascading delete)
        db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).delete()
        
        # Delete employee
        db.delete(employee)
        db.commit()
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete employee: {str(e)}"
        )


@router.get("/dashboard/summary", response_model=Dict)
async def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get dashboard summary statistics
    
    Returns total counts and department-wise breakdown
    """
    # Total counts
    total_employees = db.query(Employee).count()
    total_attendance_records = db.query(Attendance).count()
    total_present = db.query(Attendance).filter(Attendance.status == "Present").count()
    total_absent = db.query(Attendance).filter(Attendance.status == "Absent").count()
    
    # Department-wise employee count
    dept_counts = db.query(
        Employee.department,
        func.count(Employee.id).label('count')
    ).group_by(Employee.department).all()
    
    department_breakdown = [
        {"department": dept, "count": count}
        for dept, count in dept_counts
    ]
    
    # Calculate overall attendance rate
    overall_attendance_rate = (total_present / total_attendance_records * 100) if total_attendance_records > 0 else 0
    
    return {
        "total_employees": total_employees,
        "total_attendance_records": total_attendance_records,
        "total_present": total_present,
        "total_absent": total_absent,
        "overall_attendance_rate": round(overall_attendance_rate, 2),
        "department_breakdown": department_breakdown
    }
