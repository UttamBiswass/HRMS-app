"""
Employee schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, validator


class EmployeeCreate(BaseModel):
    """Schema for creating a new employee"""
    
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not v or not v.strip():
            raise ValueError('Employee ID cannot be empty')
        return v.strip()
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Full name cannot be empty')
        return v.strip()
    
    @validator('department')
    def validate_department(cls, v):
        if not v or not v.strip():
            raise ValueError('Department cannot be empty')
        return v.strip()


class EmployeeResponse(BaseModel):
    """Schema for employee response"""
    
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    
    class Config:
        from_attributes = True
