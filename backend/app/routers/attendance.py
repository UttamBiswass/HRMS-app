"""
Attendance API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict
from datetime import datetime

from ..database import get_db
from ..models.employee import Employee
from ..models.attendance import Attendance
from ..schemas.attendance import AttendanceCreate, AttendanceResponse

router = APIRouter(
    prefix="/api/attendance",
    tags=["attendance"]
)


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):
    """
    Mark attendance for an employee
    
    If attendance already exists for the given date, it will be updated.
    
    - **employee_id**: Employee identifier
    - **date**: Attendance date (YYYY-MM-DD)
    - **status**: Present or Absent
    """
    try:
        # Check if employee exists
        employee = db.query(Employee).filter(
            Employee.employee_id == attendance.employee_id
        ).first()
        
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{attendance.employee_id}' not found"
            )
        
        # Check if attendance already exists for this date
        existing_attendance = db.query(Attendance).filter(
            Attendance.employee_id == attendance.employee_id,
            Attendance.date == attendance.date
        ).first()
        
        if existing_attendance:
            # Update existing attendance
            existing_attendance.status = attendance.status
            db.commit()
            db.refresh(existing_attendance)
            return existing_attendance
        
        # Create new attendance record
        db_attendance = Attendance(**attendance.dict())
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create attendance: {str(e)}"
        )


@router.get("", response_model=List[AttendanceResponse])
async def get_all_attendance(
    employee_id: Optional[str] = Query(None, description="Filter by employee ID"),
    start_date: Optional[str] = Query(None, description="Filter by start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter by end date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all attendance records
    
    Optionally filter by employee_id, start_date, and end_date using query parameters
    
    - **employee_id** (optional): Filter attendance by specific employee
    - **start_date** (optional): Filter attendance from this date onwards (YYYY-MM-DD)
    - **end_date** (optional): Filter attendance up to this date (YYYY-MM-DD)
    """
    query = db.query(Attendance)
    
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    attendance_records = query.order_by(Attendance.date.desc()).all()
    return attendance_records


@router.get("/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve all attendance records for a specific employee
    
    - **employee_id**: The unique employee identifier
    """
    # Check if employee exists
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    # Get attendance records
    attendance_records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).order_by(Attendance.date.desc()).all()
    
    return attendance_records


@router.get("/stats/by-employee", response_model=List[Dict])
async def get_attendance_stats_by_employee(
    db: Session = Depends(get_db)
):
    """
    Get attendance statistics for all employees
    
    Returns total present days and total absent days for each employee
    """
    employees = db.query(Employee).all()
    stats = []
    
    for employee in employees:
        present_count = db.query(Attendance).filter(
            Attendance.employee_id == employee.employee_id,
            Attendance.status == "Present"
        ).count()
        
        absent_count = db.query(Attendance).filter(
            Attendance.employee_id == employee.employee_id,
            Attendance.status == "Absent"
        ).count()
        
        total_days = present_count + absent_count
        attendance_rate = (present_count / total_days * 100) if total_days > 0 else 0
        
        stats.append({
            "employee_id": employee.employee_id,
            "full_name": employee.full_name,
            "department": employee.department,
            "total_present": present_count,
            "total_absent": absent_count,
            "total_days": total_days,
            "attendance_rate": round(attendance_rate, 2)
        })
    
    return stats


@router.get("/stats/{employee_id}", response_model=Dict)
async def get_employee_attendance_stats(
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Get attendance statistics for a specific employee
    
    - **employee_id**: The unique employee identifier
    """
    # Check if employee exists
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    present_count = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.status == "Present"
    ).count()
    
    absent_count = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.status == "Absent"
    ).count()
    
    total_days = present_count + absent_count
    attendance_rate = (present_count / total_days * 100) if total_days > 0 else 0
    
    return {
        "employee_id": employee.employee_id,
        "full_name": employee.full_name,
        "department": employee.department,
        "email": employee.email,
        "total_present": present_count,
        "total_absent": absent_count,
        "total_days": total_days,
        "attendance_rate": round(attendance_rate, 2)
    }
