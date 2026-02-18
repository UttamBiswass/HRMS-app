"""
Attendance schemas for request/response validation
"""
from datetime import date
from pydantic import BaseModel, validator
from ..models.attendance import AttendanceStatus


class AttendanceCreate(BaseModel):
    """Schema for creating/updating attendance"""
    
    employee_id: str
    date: date
    status: AttendanceStatus
    
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not v or not v.strip():
            raise ValueError('Employee ID cannot be empty')
        return v.strip()


class AttendanceResponse(BaseModel):
    """Schema for attendance response"""
    
    id: int
    employee_id: str
    date: date
    status: AttendanceStatus
    
    class Config:
        from_attributes = True
