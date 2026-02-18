"""
Attendance database model
"""
import enum
from sqlalchemy import Column, String, Integer, Date, Enum
from ..database import Base


class AttendanceStatus(str, enum.Enum):
    """Attendance status enum"""
    PRESENT = "Present"
    ABSENT = "Absent"


class Attendance(Base):
    """Attendance database model"""
    
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatus), nullable=False)
    
    def __repr__(self):
        return f"<Attendance(id={self.id}, employee_id={self.employee_id}, date={self.date}, status={self.status})>"
