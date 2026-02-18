"""
Pydantic schemas for request/response validation
"""
from .employee import EmployeeCreate, EmployeeResponse
from .attendance import AttendanceCreate, AttendanceResponse

__all__ = [
    "EmployeeCreate",
    "EmployeeResponse",
    "AttendanceCreate",
    "AttendanceResponse",
]
